const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function initFirebaseAdmin() {
    if (admin.apps.length) return admin;

    let credential;

    // 1) If GOOGLE_APPLICATION_CREDENTIALS is set (points to a JSON file path),
    //    let Admin SDK load it automatically.
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        credential = admin.credential.applicationDefault();
    }
    // 2) Or, if you injected the JSON as an env var (stringified):
    else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(svc);
    }
    // 3) Fallback for local dev: read from /keys/…json
    else {
        const serviceAccountPath = path.resolve(__dirname, '../keys/richlook-web-firebase-adminsdk.json');
        const raw = fs.readFileSync(serviceAccountPath, 'utf8');  // throws if missing
        const svc = JSON.parse(raw);
        credential = admin.credential.cert(svc);
    }

    admin.initializeApp({ credential });
    console.log('✅ Firebase Admin SDK initialized');
    return admin;
}

module.exports = initFirebaseAdmin();