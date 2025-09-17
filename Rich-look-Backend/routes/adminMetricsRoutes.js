const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const verifyToken = require('../middlewares/verifyToken');
// If you already have this service, it helps resolve the DB user + role
const { resolveOrCreateUserFromFirebase } = require('../services/firebaseUserResolver');

// --- helpers ---
function parseRange(range = '30d') {
    const now = new Date();
    const end = new Date(now);
    let start;

    switch (range) {
        case 'today': {
            start = new Date(now);
            start.setHours(0, 0, 0, 0);
            break;
        }
        case '7d':
            start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
        case '30d':
            start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
        case '90d':
            start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); break;
        case 'thisMonth': {
            start = new Date(now.getFullYear(), now.getMonth(), 1); break;
        }
        default:
            start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return { start, end };
}

// ============= OVERVIEW KPIs =============
// GET /api/admin/metrics/overview?tz=UTC
router.get('/overview', async (req, res) => {
    try {
        const tz = req.query.tz || 'UTC';

        // today window
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        // counts in parallel
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            todayOrdersAgg,
            todayRevenueAgg,
            todayUsersAgg
        ] = await Promise.all([
            User.countDocuments({}),
            Product.countDocuments({}),
            Order.countDocuments({}),
            Order.countDocuments({ createdAt: { $gte: startOfToday } }),
            Order.aggregate([
                { $match: { createdAt: { $gte: startOfToday } } },
                { $group: { _id: null, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
            ]),
            User.countDocuments({ createdAt: { $gte: startOfToday } }),
        ]);

        const todayRevenue = todayRevenueAgg[0]?.revenue || 0;

        res.json({
            totals: {
                users: totalUsers,
                products: totalProducts,
                orders: totalOrders,
            },
            today: {
                orders: todayOrdersAgg,
                revenue: todayRevenue,
                newUsers: todayUsersAgg,
            },
            timezone: tz,
        });
    } catch (err) {
        console.error('overview error:', err);
        res.status(500).json({ message: 'Failed to load overview' });
    }
});

// ============= REVENUE TIMESERIES =============
// GET /api/admin/metrics/revenue?range=30d&groupBy=day&tz=UTC
router.get('/revenue', async (req, res) => {
    try {
        const { range = '30d', groupBy = 'day', tz = 'UTC' } = req.query;
        const { start, end } = parseRange(range);

        // $dateTrunc (MongoDB 5.0+) for clean grouping
        const unit = groupBy === 'month' ? 'month' : groupBy === 'week' ? 'week' : 'day';

        const rows = await Order.aggregate([
            { $match: { createdAt: { $gte: start, $lt: end } } },
            {
                $group: {
                    _id: {
                        $dateTrunc: { date: '$createdAt', unit, timezone: tz }
                    },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            range,
            groupBy: unit,
            points: rows.map(r => ({
                date: r._id, revenue: r.revenue, orders: r.orders
            })),
        });
    } catch (err) {
        console.error('revenue error:', err);
        res.status(500).json({ message: 'Failed to load revenue series' });
    }
});

// ============= NEW USERS TIMESERIES =============
// GET /api/admin/metrics/new-users?range=30d&groupBy=day&tz=UTC
router.get('/new-users', async (req, res) => {
    try {
        const { range = '30d', groupBy = 'day', tz = 'UTC' } = req.query;
        const { start, end } = parseRange(range);
        const unit = groupBy === 'month' ? 'month' : groupBy === 'week' ? 'week' : 'day';

        const rows = await User.aggregate([
            { $match: { createdAt: { $gte: start, $lt: end } } },
            {
                $group: {
                    _id: { $dateTrunc: { date: '$createdAt', unit, timezone: tz } },
                    count: { $sum: 1 },
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            range,
            groupBy: unit,
            points: rows.map(r => ({ date: r._id, count: r.count })),
        });
    } catch (err) {
        console.error('new-users error:', err);
        res.status(500).json({ message: 'Failed to load user series' });
    }
});

// ============= TOP PRODUCTS =============
// GET /api/admin/metrics/top-products?range=30d&limit=5
router.get('/top-products', async (req, res) => {
    try {
        const { range = '30d', limit = 5 } = req.query;
        const { start, end } = parseRange(range);

        const rows = await Order.aggregate([
            { $match: { createdAt: { $gte: start, $lt: end } } },
            { $unwind: '$products' },
            {
                $group: {
                    _id: '$products.productId',
                    qty: { $sum: '$products.quantity' },
                    revenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: Number(limit) },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 0,
                    productId: '$product._id',
                    name: '$product.name',
                    thumbnailUrl: '$product.thumbnailUrl',
                    qty: 1,
                    revenue: 1,
                }
            }
        ]);

        res.json({ range, items: rows });
    } catch (err) {
        console.error('top-products error:', err);
        res.status(500).json({ message: 'Failed to load top products' });
    }
});

// ============= RECENT ORDERS =============
// GET /api/admin/metrics/recent-orders?limit=10
router.get('/recent-orders', async (req, res) => {
    try {
        const limit = Math.min(Number(req.query.limit || 10), 50);
        const orders = await Order.find({})
            .populate({ path: 'userId', select: 'name email' })
            .populate({ path: 'products.productId', select: 'name thumbnailUrl' })
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({ orders });
    } catch (err) {
        console.error('recent-orders error:', err);
        res.status(500).json({ message: 'Failed to load recent orders' });
    }
});

module.exports = router;