const User = require("../models/userModel");

async function resolveOrCreateUserFromFirebase(claims) {
    const uid   = claims.uid;
    const email = (claims.email || '').toLowerCase();
    const name  = claims.name || claims.displayName || '';

    // 1) by firebaseUid
    let user = await User.findOne({ firebaseUid: uid });
    if (user) return user;

    // 2) by email (if present)
    if (email) {
        user = await User.findOne({ email });
        if (user) {
            if (!user.firebaseUid || user.firebaseUid !== uid) {
                user.firebaseUid = uid;
                if (!user.name && name) user.name = name;
                await user.save();
            }
            return user;
        }
    }

    // 3) create (handle race on unique email)
    try {
        return await User.create({
            firebaseUid: uid,
            email: email || undefined,
            name,
            role: 'user',
        });
    } catch (err) {
        if (err?.code === 11000 && email) {
            const existing = await User.findOne({ email });
            if (existing) {
                if (!existing.firebaseUid) {
                    existing.firebaseUid = uid;
                    await existing.save();
                }
                return existing;
            }
        }
        throw err;
    }
}

module.exports = { resolveOrCreateUserFromFirebase };
