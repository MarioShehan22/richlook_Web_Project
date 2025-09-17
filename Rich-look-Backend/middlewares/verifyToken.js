const admin = require('../services/firebase');

const verifyToken = async (req, res, next) => {
    const authz = req.header('Authorization') || '';
    const token = authz.startsWith('Bearer ') ? authz.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // IMPORTANT: this expects a Firebase **ID token**
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;          // includes uid, email, etc.
        return next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

module.exports = verifyToken;
