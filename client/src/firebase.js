import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration for authentication only
// Database operations are handled by the backend server
const firebaseConfig = {
  apiKey: "AIzaSyDJzqP5Yx9kL9_-8xoZJ3w7NhTWpFiZN8A",
  authDomain: "gdg-blog-99118.firebaseapp.com",
  projectId: "gdg-blog-99118",
  storageBucket: "gdg-blog-99118.firebasestorage.app",
  messagingSenderId: "581623854369",
  appId: "1:581623854369:web:5a5e6fcdbecf96ee0fe26b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// NOTE: Database operations are handled by the backend server, not here
export const auth = getAuth(app);

export default app;