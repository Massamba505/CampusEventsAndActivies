// src/utils/auth.js
import toast from 'react-hot-toast';
import { auth, provider } from '../firebase.config';
import { signInWithPopup, getIdToken } from 'firebase/auth';

// Sign in with Google
export const signInWithGoogle = async (setAuthUser) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const googleIdToken = await getIdToken(user);

    // Send the token to your backend
    await sendGoogleTokenToBackend(googleIdToken,setAuthUser);
  } catch (error) {
    toast.error('Error signing in with Google:', error);
  }
};

// Send Google ID token to backend
const sendGoogleTokenToBackend = async (googleIdToken,setAuthUser) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + googleIdToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ googleIdToken }),
    });

    const data = await response.json();
    toast.success('Login successful');
    //need to set local storage
    localStorage.setItem("events-app",JSON.stringify(data)); // has the userId in database
    setAuthUser(data);

  } catch (error) {
    toast.error('Error sending token to backend:', error);
  }
};
