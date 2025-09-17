const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');      // <-- add this
const verifyToken = require('../middlewares/verifyToken');
const { resolveOrCreateUserFromFirebase } = require("../services/firebaseUserResolver");

const ALLOWED_STATUSES = ['Pending', 'Shipped', 'Delivered'];

router.post('/place', verifyToken, async (req, res) => {
    const userDoc = await resolveOrCreateUserFromFirebase(req.user);
    const userId = userDoc._id;

    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ message: 'No items provided' });

    try {
        let totalAmount = 0;
        const orderProducts = [];

        for (const line of items) {
            const { productId, quantity, size, color } = line || {};
            const qty = Number(quantity) || 0;

            if (!mongoose.isValidObjectId(productId)) throw new Error(`Invalid productId: ${productId}`);
            if (!qty || qty <= 0) throw new Error(`Invalid quantity (${quantity}) for product ${productId}`);
            if (!size || !color) throw new Error(`Variant (size/color) required for product ${productId}`);

            // Load for price + validate variant
            const product = await Product.findById(productId).lean();
            if (!product || product.isActive === false) throw new Error(`Product ${productId} not found or inactive`);

            const variant = (product.variants || []).find(v => v.size === size && v.color === color);
            if (!variant) throw new Error(`Variant not found for ${size}/${color}`);

            const unitPrice = Number(variant.price ?? product.price) || 0;

            // Atomic decrement of that variant
            const dec = await Product.updateOne(
                { _id: productId, isActive: { $ne: false }, variants: { $elemMatch: { size, color, quantity: { $gte: qty } } } },
                { $inc: { 'variants.$[v].quantity': -qty } },
                { arrayFilters: [{ 'v.size': size, 'v.color': color }] }
            );
            if (dec.modifiedCount !== 1) throw new Error(`Insufficient stock for ${product.name} (${size}/${color}). Requested ${qty}.`);

            // Recompute totalQuantity
            await Product.updateOne({ _id: productId }, [{ $set: { totalQuantity: { $sum: '$variants.quantity' } } }]);

            totalAmount += unitPrice * qty;
            orderProducts.push({ productId: product._id, quantity: qty, price: unitPrice, size, color });
        }

        const order = await Order.create({
            userId,                     // <-- ObjectId goes here
            products: orderProducts,
            totalAmount,
            status: 'Pending',
        });

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(400).json({ message: err.message || 'Error placing order' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    const firebaseUid = req.user.uid;
    const userDoc = await User.findOne({ firebaseUid });
    if (!userDoc) return res.status(401).json({ message: 'User not found' });

    try {
        const orders = await Order.find({ userId: userDoc._id }) // <-- query by ObjectId
            .populate('products.productId')
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

router.get('/find-All', async (req, res) => {
    try {
        const { status, page = 1, limit = 20, q } = req.query;

        const filter = {};
        if (status) filter.status = status;

        // Search by order id or user name/email
        if (q) {
            const or = [];
            if (mongoose.isValidObjectId(q)) {
                or.push({ _id: new mongoose.Types.ObjectId(q) });
            }
            // Need a join-like search => fetch user ids by name/email first, then filter
            const users = await User.find({
                $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }],
            }).select('_id');
            if (users.length) {
                or.push({ userId: { $in: users.map(u => u._id) } });
            }
            if (or.length) filter.$or = or;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate({ path: 'userId', select: 'name email' })
                .populate({ path: 'products.productId', select: 'name price thumbnailUrl images' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Order.countDocuments(filter),
        ]);

        res.json({
            orders,
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
        });
    } catch (err) {
        console.error('Admin list orders error:', err);
        res.status(500).json({ message: 'Failed to list orders' });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid order id' });
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}` });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate({ path: 'userId', select: 'name email' })
            .populate({ path: 'products.productId', select: 'name price thumbnailUrl images' });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json({ message: 'Status updated', order });
    } catch (err) {
        console.error('Admin update status error:', err);
        res.status(500).json({ message: 'Failed to update status' });
    }
});

router.get('/find-by-id/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid order id' });

        const order = await Order.findById(id)
            .populate({ path: 'userId', select: 'name email' })
            .populate({ path: 'products.productId', select: 'name price thumbnailUrl images' });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json({ order });
    } catch (err) {
        console.error('Admin get order error:', err);
        res.status(500).json({ message: 'Failed to fetch order' });
    }
});

module.exports = router;
