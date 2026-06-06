import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AppEnv } from '../config/env';
import { StorageService, StorageKeys } from '../services/storage';
import firestore from '@react-native-firebase/firestore';

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
  isOnboarded: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string, avatarUrl?: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL: string) => Promise<void>;
  completeOnboarding: (displayName: string, photoURL: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextState | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const isSigningUpEmailRef = useRef(false);

  useEffect(() => {
    // Initialize Google SDK
    GoogleSignin.configure({ webClientId: AppEnv.google.webClientId });

    // Subscribe to Firebase Auth state
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (isSigningUpEmailRef.current) {
        setIsAuthLoading(false);
        return;
      }

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

        // Ensure userProgress/{uid} root profile document exists in Firestore and check policy acceptance
        try {
          const userRef = firestore().collection('userProgress').doc(userData.uid);
          const docSnap = await userRef.get();
          if (!docSnap.exists()) {
            setIsOnboarded(false);
            await userRef.set({
              name: userData.displayName || userData.email?.split('@')[0] || `Student (${userData.uid.slice(0, 5)})`,
              email: userData.email,
              status: 'active',
              joinedDate: new Date().toISOString().split('T')[0],
              policiesAccepted: false,
            });
          } else {
            const data = docSnap.data();
            if (data && data.policiesAccepted === true) {
              setIsOnboarded(true);
            } else {
              setIsOnboarded(false);
            }
            await userRef.update({
              email: userData.email,
            });
          }
        } catch (fsErr) {
          console.warn('[AuthContext] Failed to provision userProgress profile:', fsErr);
          setIsOnboarded(true); // Fallback to avoid bricking app
        }
      } else {
        setUser(null);
        setIsOnboarded(false);
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

  const signUpWithEmail = async (email: string, password: string, displayName: string, avatarUrl?: string) => {
    setIsSigningIn(true);
    setAuthError(null);
    isSigningUpEmailRef.current = true;
    try {
      const cleanName = displayName.trim();
      const cleanAvatar = avatarUrl?.trim() || '';
      const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);
      
      if (credential.user) {
        await credential.user.updateProfile({ 
          displayName: cleanName,
          photoURL: cleanAvatar || null 
        });
        
        const userData: AuthUser = {
          uid: credential.user.uid,
          displayName: cleanName,
          email: credential.user.email,
          photoURL: cleanAvatar || null,
        };
        
        // Create Firestore userProgress document directly with policiesAccepted: true
        const userRef = firestore().collection('userProgress').doc(userData.uid);
        await userRef.set({
          name: cleanName,
          email: userData.email,
          photoURL: cleanAvatar || null,
          status: 'active',
          joinedDate: new Date().toISOString().split('T')[0],
          policiesAccepted: true,
        });

        setIsOnboarded(true);
        setUser(userData);
        
        // Cache credentials locally
        await StorageService.set(StorageKeys.AUTH_USER_UID, userData.uid);
        await StorageService.set(StorageKeys.AUTH_USER_DISPLAY_NAME, cleanName);
        if (userData.email) await StorageService.set(StorageKeys.AUTH_USER_EMAIL, userData.email);
        if (cleanAvatar) await StorageService.set(StorageKeys.AUTH_USER_PHOTO_URL, cleanAvatar);
      }
    } catch (error: any) {
      console.error('[AuthContext] Email Sign-Up Error:', error);
      setAuthError(error.message || 'Failed to create account.');
      throw error;
    } finally {
      isSigningUpEmailRef.current = false;
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

  const updateUserProfile = async (displayName: string, photoURL: string) => {
    const firebaseUser = auth().currentUser;
    if (!firebaseUser) throw new Error('No user is currently signed in.');

    const cleanName = displayName.trim();
    const cleanPhotoURL = photoURL.trim();

    await firebaseUser.updateProfile({
      displayName: cleanName || null,
      photoURL: cleanPhotoURL || null,
    });

    await firebaseUser.reload();
    const updatedUser = auth().currentUser;
    if (updatedUser) {
      const userData: AuthUser = {
        uid: updatedUser.uid,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        photoURL: updatedUser.photoURL,
      };
      setUser(userData);

      // Cache credentials locally
      if (userData.displayName) await StorageService.set(StorageKeys.AUTH_USER_DISPLAY_NAME, userData.displayName);
      if (userData.photoURL) {
        await StorageService.set(StorageKeys.AUTH_USER_PHOTO_URL, userData.photoURL);
      } else {
        await StorageService.remove(StorageKeys.AUTH_USER_PHOTO_URL);
      }

      // Update Firestore userProgress doc
      try {
        const userRef = firestore().collection('userProgress').doc(userData.uid);
        await userRef.update({
          name: userData.displayName || userData.email?.split('@')[0] || `Student (${userData.uid.slice(0, 5)})`,
        });
      } catch (fsErr) {
        console.warn('[AuthContext] Failed to update userProgress in Firestore:', fsErr);
      }
    }
  };

  const completeOnboarding = async (displayName: string, photoURL: string) => {
    const firebaseUser = auth().currentUser;
    if (!firebaseUser) throw new Error('No user is currently signed in.');

    const cleanName = displayName.trim();
    const cleanPhotoURL = photoURL.trim();

    await firebaseUser.updateProfile({
      displayName: cleanName || null,
      photoURL: cleanPhotoURL || null,
    });

    await firebaseUser.reload();
    const updatedUser = auth().currentUser;
    if (updatedUser) {
      const userData: AuthUser = {
        uid: updatedUser.uid,
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        photoURL: updatedUser.photoURL,
      };

      if (userData.displayName) await StorageService.set(StorageKeys.AUTH_USER_DISPLAY_NAME, userData.displayName);
      if (userData.photoURL) {
        await StorageService.set(StorageKeys.AUTH_USER_PHOTO_URL, userData.photoURL);
      }

      try {
        const userRef = firestore().collection('userProgress').doc(userData.uid);
        const docSnap = await userRef.get();
        if (!docSnap.exists()) {
          await userRef.set({
            name: cleanName,
            email: userData.email,
            photoURL: cleanPhotoURL || null,
            status: 'active',
            joinedDate: new Date().toISOString().split('T')[0],
            policiesAccepted: true,
          });
        } else {
          await userRef.update({
            name: cleanName,
            photoURL: cleanPhotoURL || null,
            policiesAccepted: true,
          });
        }
      } catch (fsErr) {
        console.warn('[AuthContext] Failed to save userProgress onboarding:', fsErr);
      }

      setIsOnboarded(true);
      setUser(userData);
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
        isOnboarded,
        signInWithGoogle,
        signOut,
        signInWithEmail,
        signUpWithEmail,
        updateUserProfile,
        completeOnboarding,
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