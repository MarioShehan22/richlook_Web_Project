const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const verifyToken = require('../middlewares/verifyToken');

// Add a product to the cart (Protected route)
router.post('/add', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.uid; // Extract user ID from the decoded token

    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product stock is sufficient
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock' });
        }

        // Find or create a cart for the user
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Update existing cart
            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                // Update quantity if product already exists in the cart
                existingItem.quantity += quantity;
            } else {
                // Add new item to the cart
                cart.items.push({ productId, quantity });
            }
            await cart.save();
        } else {
            // Create a new cart for the user
            cart = new Cart({
                userId,
                items: [{ productId, quantity }],
            });
            await cart.save();
        }

        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Error adding product to cart', error: error.message });
    }
});

// Get the user's cart (Protected route)
router.get('/', verifyToken, async (req, res) => {
    const userId = req.user.uid; // Extract user ID from the decoded token

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

// Remove a product from the cart (Protected route)
router.delete('/remove', verifyToken, async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.uid; // Extract user ID from the decoded token

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Error removing product from cart', error: error.message });
    }
});

module.exports = router;