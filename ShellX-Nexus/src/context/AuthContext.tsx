/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Bind Firebase auth listener on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'admins', firebaseUser.uid);
          let docSnap = await getDoc(docRef);
          
          if (!docSnap.exists()) {
            if (firebaseUser.email === 'arkamandal1919@gmail.com') {
              // Auto-provision admin document if missing in empty DB
              await setDoc(docRef, {
                name: firebaseUser.displayName || 'Arka Mandal',
                email: firebaseUser.email,
                role: 'owner',
                createdAt: new Date(),
              });
              docSnap = await getDoc(docRef);
            } else {
              // Logged in user is not an administrator, force sign out
              await firebaseSignOut(auth);
              setUser(null);
              setIsAuthLoading(false);
              return;
            }
          }
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: docSnap.data()?.name || firebaseUser.displayName || 'Administrator',
            photoURL: firebaseUser.photoURL || null,
          });
        } catch (error) {
          console.error('Error verifying admin authorization claims:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    setIsAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force Google account picker select account
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;

      // Query admin clearance directly in Firestore
      const docRef = doc(db, 'admins', firebaseUser.uid);
      let docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        if (firebaseUser.email === 'arkamandal1919@gmail.com') {
          // Auto-provision admin document in Firestore
          await setDoc(docRef, {
            name: firebaseUser.displayName || 'Arka Mandal',
            email: firebaseUser.email,
            role: 'owner',
            createdAt: new Date(),
          });
          docSnap = await getDoc(docRef);
        } else {
          await firebaseSignOut(auth);
          throw new Error('Access denied: You are not registered as an administrator.');
        }
      }

      const adminUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: docSnap.data()?.name || firebaseUser.displayName || 'Administrator',
        photoURL: firebaseUser.photoURL || null,
      };

      setUser(adminUser);
      setIsAuthLoading(false);
      return true;
    } catch (error) {
      setIsAuthLoading(false);
      const err = error as { message?: string; code?: string };
      
      let message = err.message || 'Google authentication failed.';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Authentication cancelled by user.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        message = 'Popup request cancelled.';
      }
      
      throw new Error(message, { cause: error });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
