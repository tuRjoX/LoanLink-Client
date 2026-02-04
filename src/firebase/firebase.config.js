import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnWSlPWTf__Lgu6HSLmFBVC15O6IGDGPw",
  authDomain: "loanlink-3d15f.firebaseapp.com",
  projectId: "loanlink-3d15f",
  storageBucket: "loanlink-3d15f.firebasestorage.app",
  messagingSenderId: "35096797972",
  appId: "1:35096797972:web:7468208b16374b8ae09801",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
