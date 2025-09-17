const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:       { type: String, trim: true, lowercase: true, index: true },
    firebaseUid: { type: String, index: true, unique: true },
    name:        { type: String },
    role:        { type: String, default: 'user' },
}, { timestamps: true });

// Optional: unique partial index for email (create once or ensureIndex on startup)
userSchema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { email: { $exists: true, $nin: [null, ""] } } }
);

module.exports = mongoose.model('User', userSchema);
