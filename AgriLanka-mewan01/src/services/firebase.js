import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration (from user-provided SDK)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};


// const firebaseConfig = {
//   apiKey: "AIzaSyAAB3kxIGQbYN3R0uKmdFHa8J_eP3AacxY",
//   authDomain: "agrilanka-e49f9.firebaseapp.com",
//   projectId: "agrilanka-e49f9",
//   storageBucket: "agrilanka-e49f9.firebasestorage.app",
//   messagingSenderId: "749831293040",
//   appId: "1:749831293040:web:fe7d440bfaafa01f71ccb5",
//   measurementId: "G-E7CSX2HG6G"
// };

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