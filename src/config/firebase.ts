import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// These values come from environment variables (fallbacks are set to your actual config)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyChDNxbhndoeR4rlT3KyRPSrwb6ichtyfQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "login-a4a82.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "login-a4a82",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "login-a4a82.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "866487609022",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:866487609022:web:4d24e4cc81830e48b7e0ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;