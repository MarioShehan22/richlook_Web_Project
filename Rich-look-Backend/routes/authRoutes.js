const express = require('express');
const router = express.Router();
const admin = require('../services/firebase.js');  // Firebase Admin SDK
const User = require('../models/userModel');
const mongoose = require("mongoose");
const Order = require("../models/orderModel");

// User signup route
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if user already exists in Firebase
        try {
            const existingUser = await admin.auth().getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
        } catch (error) {
            // No user exists, proceed with creation
        }

        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        // Store additional user data in MongoDB
        const newUser = new User({
            email,
            name,
            firebaseUid: userRecord.uid,
        });

        await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Authenticate the user using Firebase Authentication
        const user = await admin.auth().getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate Firebase custom token for client-side usage
        const idToken = await admin.auth().createCustomToken(user.uid);

        res.status(200).json({
            message: 'User authenticated successfully',
            token: idToken,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
});

// Get user profile route (Protected by Firebase token)
router.get('/profile', async (req, res) => {
    const { userId } = req.user;  // Assuming user information is attached in req.user from the authentication middleware

    try {
        const user = await User.findOne({ firebaseUid: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
    }
});

router.get('/find-By-id/:id', async (req, res) => {
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    }catch(error){
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
})

// Update user profile route (Protected by Firebase token)
router.put('/profile', async (req, res) => {
    const { userId } = req.user;  // Get the userId from the Firebase token
    const { name, email } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { firebaseUid: userId },
            { name, email },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
});

// Delete user route (Protected by Firebase token)
router.delete('/profile', async (req, res) => {
    const { userId } = req.user;  // Get the userId from the Firebase token

    try {
        const deletedUser = await User.findOneAndDelete({ firebaseUid: userId });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally, delete the user from Firebase as well
        await admin.auth().deleteUser(userId);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Social login route for Google and Facebook
router.post('/social-login', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ message: 'ID Token is required' });
    }

    try {
        // Verify the ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;  // Email from the decoded token

        // Check if user already exists in your database
        let user = await User.findOne({ email });

        if (!user) {
            // If user does not exist, create a new one
            user = new User({
                firebaseUid: uid,
                email: email,
                name: decodedToken.name || 'Unnamed User', // Get the user name if available
            });

            await user.save();
            res.status(201).json({ message: 'User created successfully', user });
        } else {
            // If user exists, just return the user
            res.status(200).json({ message: 'User logged in successfully', user });
        }
    } catch (error) {
        console.error('Error during social login:', error);
        res.status(500).json({ message: 'Error during social login', error: error.message });
    }
});

router.get('/find-all', async (req, res) => {
    try {
        const user = await User.find().lean();
        //if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('users/me error:', err);
        res.status(500).json({ message: 'Failed to load profile' });
    }
});

router.put('/me', async (req, res) => {
    try {
        const { name, email } = req.body;

        const updated = await User.findOneAndUpdate(
            { firebaseUid: req.user.uid },
            {
                ...(name !== undefined ? { name } : {}),
                ...(email !== undefined ? { email: (email || '').toLowerCase() || undefined } : {}),
            },
            { new: true, runValidators: true, projection: 'name email role createdAt' }
        ).lean();

        if (!updated) return res.status(404).json({ message: 'User not found' });
        res.json(updated);
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        console.error('users/me update error:', err);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

router.get('/me/stats', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid }, '_id').lean();
        if (!user) return res.status(404).json({ message: 'User not found' });

        const userId = new mongoose.Types.ObjectId(user._id);

        // 1) Faceted counts + last order
        const [facet] = await Order.aggregate([
            { $match: { userId } },
            {
                $facet: {
                    totals: [
                        { $group: { _id: null, totalOrders: { $sum: 1 }, totalAmount: { $sum: '$totalAmount' } } },
                    ],
                    byStatus: [
                        { $group: { _id: '$status', count: { $sum: 1 } } },
                    ],
                    last: [
                        { $sort: { createdAt: -1 } }, { $limit: 1 },
                        { $project: { _id: 1, totalAmount: 1, status: 1, createdAt: 1 } },
                    ],
                },
            },
        ]);

        const totalsDoc = facet?.totals?.[0] || { totalOrders: 0, totalAmount: 0 };
        const statusCounts = (facet?.byStatus || []).reduce((acc, s) => {
            acc[s._id || 'Unknown'] = s.count;
            return acc;
        }, {});

        // 2) Spend by month (for small chart)
        const spendByMonth = await Order.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
                    amount: { $sum: '$totalAmount' },
                },
            },
            { $sort: { '_id.y': 1, '_id.m': 1 } },
            {
                $project: {
                    _id: 0,
                    year: '$_id.y',
                    month: '$_id.m',
                    amount: 1,
                    label: {
                        $concat: [
                            { $toString: '$_id.y' }, '-',
                            { $cond: [{ $lt: ['$_id.m', 10] }, { $concat: ['0', { $toString: '$_id.m' }] }, { $toString: '$_id.m' }] }
                        ],
                    },
                },
            },
        ]);

        // 3) Recent orders (+ lightweight product info)
        const recentOrders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({ path: 'products.productId', select: 'name thumbnailUrl price' })
            .lean();

        res.json({
            totals: {
                totalOrders: totalsDoc.totalOrders || 0,
                totalAmount: totalsDoc.totalAmount || 0,
            },
            statusCounts, // e.g. { Pending: 2, Shipped: 1, Delivered: 4 }
            lastOrder: facet?.last?.[0] || null,
            spendByMonth,
            recentOrders,
        });
    } catch (err) {
        console.error('users/me/stats error:', err);
        res.status(500).json({ message: 'Failed to load stats' });
    }
});

module.exports = router;