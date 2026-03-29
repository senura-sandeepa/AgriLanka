import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration (from user-provided SDK)
const firebaseConfig = {
  apiKey: "AIzaSyAAB3kxIGQbYN3R0uKmdFHa8J_eP3AacxY",
  authDomain: "agrilanka-e49f9.firebaseapp.com",
  projectId: "agrilanka-e49f9",
  storageBucket: "agrilanka-e49f9.firebasestorage.app",
  messagingSenderId: "749831293040",
  appId: "1:749831293040:web:fe7d440bfaafa01f71ccb5",
  measurementId: "G-E7CSX2HG6G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize analytics if available (may not work in React Native environment)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Firebase analytics not initialized:', error.message);
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export { analytics };
export default app;