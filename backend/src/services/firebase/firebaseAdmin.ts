import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccount = require('/path-to-your-service-account-key.json');  // Replace with the path to your Firebase service account key

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://<your-database-name>.firebaseio.com"
    });
}

const auth = admin.auth();
const firestore = admin.firestore();

export { auth, firestore };