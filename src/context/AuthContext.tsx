import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AppEnv } from '../config/env';
import { StorageService, StorageKeys } from '../services/storage';

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AuthContextState {
  user: AuthUser | null;
  isAuthLoading: boolean;
  isSigningIn: boolean;
  isSigningOut: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextState | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Google SDK
    GoogleSignin.configure({ webClientId: AppEnv.google.webClientId });

    // Subscribe to Firebase Auth state
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData: AuthUser = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        
        // Cache credentials locally for fast boot routing
        await StorageService.set(StorageKeys.AUTH_USER_UID, userData.uid);
        if (userData.displayName) await StorageService.set(StorageKeys.AUTH_USER_DISPLAY_NAME, userData.displayName);
        if (userData.email) await StorageService.set(StorageKeys.AUTH_USER_EMAIL, userData.email);
        if (userData.photoURL) await StorageService.set(StorageKeys.AUTH_USER_PHOTO_URL, userData.photoURL);
      } else {
        setUser(null);
        await StorageService.remove(StorageKeys.AUTH_USER_UID);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      if (response.type === 'success') {
        const idToken = response.data.idToken;
        if (!idToken) throw new Error('No ID Token found from Google Sign-In.');
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);
      } else {
        throw new Error('Sign-In cancelled by user.');
      }
    } catch (error: any) {
      console.error('[AuthContext] Google Sign-In Error:', error);
      setAuthError(error.message || 'Failed to sign in with Google.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
    } catch (error: any) {
      console.error('[AuthContext] Email Sign-In Error:', error);
      setAuthError(error.message || 'Failed to sign in with email.');
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const cleanName = displayName.trim();
      const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);
      
      if (credential.user) {
        await credential.user.updateProfile({ displayName: cleanName });
        
        const userData: AuthUser = {
          uid: credential.user.uid,
          displayName: cleanName,
          email: credential.user.email,
          photoURL: credential.user.photoURL,
        };
        setUser(userData);
        
        // Cache credentials locally
        await StorageService.set(StorageKeys.AUTH_USER_UID, userData.uid);
        await StorageService.set(StorageKeys.AUTH_USER_DISPLAY_NAME, cleanName);
        if (userData.email) await StorageService.set(StorageKeys.AUTH_USER_EMAIL, userData.email);
      }
    } catch (error: any) {
      console.error('[AuthContext] Email Sign-Up Error:', error);
      setAuthError(error.message || 'Failed to create account.');
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    setIsSigningOut(true);
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      await StorageService.clearAll();
    } catch (error) {
      console.error('[AuthContext] Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        isSigningIn,
        isSigningOut,
        authError,
        signInWithGoogle,
        signOut,
        signInWithEmail,
        signUpWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('[useAuthContext] Must be used within <AuthContextProvider>.');
  return ctx;
}