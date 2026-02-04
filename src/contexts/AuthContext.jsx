import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [jwt, setJwt] = useState(
    () => localStorage.getItem("loanlink_jwt") || "",
  );

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  // Create user with email and password
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in with email and password
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Sign in with GitHub
  const signInWithGithub = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  // Update user profile
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      // Remove JWT token
      localStorage.removeItem("loanlink_jwt");
      setJwt("");
      setUserRole(null);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`);
      return signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Get user role from database
  const fetchUserRole = async (email) => {
    try {
      const token = localStorage.getItem("loanlink_jwt");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${email}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUserRole(response.data?.role || "borrower");
      return response.data;
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole("borrower");
      return null;
    }
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Get JWT from backend
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/jwt`,
            { email: currentUser.email },
          );
          if (res.data.token) {
            localStorage.setItem("loanlink_jwt", res.data.token);
            setJwt(res.data.token);
          }
          await fetchUserRole(currentUser.email);
        } catch (error) {
          console.error("Error setting up auth:", error);
        }
      } else {
        setUserRole(null);
        setJwt("");
        localStorage.removeItem("loanlink_jwt");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    userRole,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    logout,
    updateUserProfile,
    fetchUserRole,
    jwt,
    setJwt,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
