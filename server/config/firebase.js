const admin = require('firebase-admin');
require('dotenv').config();

// Firebase configuration from environment variables
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || "gdg-blog-99118",
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    // Try to use service account key if available
    // In development, you can use Firebase emulator or Application Default Credentials
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      ...firebaseConfig
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.warn('Firebase Admin initialization warning:', error.message);
    console.log('Note: For full functionality, set up Firebase service account credentials');
    // Initialize with minimal config for development
    admin.initializeApp(firebaseConfig);
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };