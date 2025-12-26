const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const adminMetricsRoutes = require('./routes/adminMetricsRoutes');
const userRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chatRoutes = require("./routes/chatRoutes");

// Initialize Express app
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Set security headers
app.use(helmet());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// // Rate limiting (prevent brute-force attacks / DDOS)
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
//     message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// Cookie parser (to handle cookies if you use JWT or sessions)
app.use(cookieParser());

// CORS configuration with specific origin
const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend URL (make sure it's correct)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// COOP and COEP headers configuration (for Firebase Auth to work properly)
app.use((req, res, next) => {
    if (req.path.includes('auth') || req.path.includes('login')) {
        res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');  // Allow popups
        res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');  // Allow cross-origin embedding
    } else {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    }
    next();
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/richlookDb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/metrics', adminMetricsRoutes);
app.use("/api/chat", chatRoutes);

// Health check route (optional)
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'API is working!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});