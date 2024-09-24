// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyA0ABDMzi58hMXrSEsbwYmbH_-9zIXRHHI",
  authDomain: "events-and-activities-97e17.firebaseapp.com",
  projectId: "events-and-activities-97e17",
  storageBucket: "events-and-activities-97e17.appspot.com",
  messagingSenderId: "346195858859",
  appId: "1:346195858859:web:cfdfc866016c7b8304aeee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
