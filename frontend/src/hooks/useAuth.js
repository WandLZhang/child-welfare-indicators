// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase'; 

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          // Create a new user document if it doesn't exist
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date(),
          });
        }
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setError(error);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // User is set by the onAuthStateChanged listener
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      // User is set to null by the onAuthStateChanged listener
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (updates) => {
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    setLoading(true);
    setError(null);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, updates, { merge: true });
      // Update local user state
      setUser(prevUser => ({ ...prevUser, ...updates }));
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    updateUserProfile
  };
};
