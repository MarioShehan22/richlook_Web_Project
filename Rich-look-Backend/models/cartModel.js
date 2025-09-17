const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Ensure that the quantity is at least 1
    }
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    items: [cartItemSchema], // An array of cart items
}, { timestamps: true });

// Create the Cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
