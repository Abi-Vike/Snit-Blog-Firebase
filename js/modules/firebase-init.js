// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1mc1rUDQQkL9CUMJKIh9Ybk-H2IBw1Hw",
  authDomain: "betty-thinks.firebaseapp.com",
  projectId: "betty-thinks",
  storageBucket: "betty-thinks.appspot.com",
  messagingSenderId: "145409410703",
  appId: "1:145409410703:web:08888f5adc7c9c7dddd2fa",
  measurementId: "G-5C9Q452TZD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firestore and Auth instances
export { db, auth };
