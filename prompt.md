# Coder AI Prompt — Phase 2.2: Live Authentication Integration (Firebase Auth & Google OAuth)

Act as an elite Mobile System Architect and Lead React Native Developer. Your task is to implement the changes and new files required for **Phase 2.2** of the ShellX application.

This phase focuses on:
1. Setting up Firebase App, Firebase Auth, and Google Sign-in dependencies.
2. Building the reactive `AuthContext` as the single source of truth for session states (signing-in, signing-out, and auth user cached metadata in `AsyncStorage`).
3. Configuring a secure conditional auth guard rendering mechanism inside `RootNavigator.tsx`.
4. Integrating functional login with loaders and error layouts inside `AuthScreen.tsx`.
5. Wiring a dynamic confirmation alert and storage cache purge on log-out inside `SettingsScreen.tsx`.

---

### ⚠️ IMPORTANT: ANTI-HALLUCINATION & FILE INTEGRITY RULES
1. **DO NOT guess, assume, or hallucinate** the contents, exports, or types of any existing project files.
2. If you need to see the exact implementation of any existing token, atom, or component to resolve dependencies, **stop and ask the user to provide that file.**
3. Adhere strictly to the design system tokens:
   - OLED True Dark background: `#000000` (`Theme.colors.background.floor`).
   - Zero-shadow rule (`Theme.noShadow`).
   - Interactive elements must satisfy the minimum 44×44dp touch target constraint.
   - Monospace typography constraints (`Theme.fontFamily.mono`) for code/terminal elements.

---

### 📂 Phase 2.2 Targets

Here are the precise specifications for the files to create and modify:

#### 1. [NEW] `/src/context/AuthContext.tsx`
Create the authentication context to subscribe to Firebase Auth state updates and orchestrate Google Sign-In:
- On mount, configure `GoogleSignin.configure({ webClientId: AppEnv.google.webClientId })`.
- Wire `auth().onAuthStateChanged` to catch user credentials.
- When user is logged in: map `{ uid, displayName, email, photoURL }` and cache values in `StorageService` (`StorageKeys.AUTH_USER_UID`, etc.).
- When user is logged out: clear state and clear cached values (`StorageService.remove(StorageKeys.AUTH_USER_UID)`).
- Implement `signInWithGoogle` using `GoogleSignin.signIn()` and `auth().signInWithCredential`.
- Implement `signOut` which revokes Google credentials access, logs out of Firebase, and invokes `StorageService.clearAll()`.
- Export `AuthContext`, `AuthContextProvider`, and the `useAuthContext()` hook (with a null context check).

#### 2. [MODIFY] `/src/navigation/RootNavigator.tsx`
Wire the Navigator to conditionally render child screens using the reactive `AuthContext` state to prevent routing flicker:
- Extract `user` and `isAuthLoading` from `useAuthContext()`.
- If `isAuthLoading === true`, return `null` (the `SplashScreen` handles the boot window).
- Conditionally render child stack screens (Never conditionally render the `<Stack.Navigator>` itself):
  ```typescript
  {user ? (
    <Stack.Screen name="Main" component={MainTabNavigator} />
  ) : (
    <Stack.Screen name="Auth" component={AuthScreen} />
  )}
  <Stack.Screen name="Splash" component={SplashScreen} />
  ```

#### 3. [MODIFY] `/src/screens/AuthScreen.tsx`
Integrate the live authentication trigger and capture loading states:
- Extract `signInWithGoogle`, `isSigningIn`, and `authError` from `useAuthContext()`.
- Bind `GoogleSignInButton` trigger to `signInWithGoogle` and pass `loading={isSigningIn}` / `disabled={isSigningIn}`.
- During `isSigningIn`, replace the G logo inside `GoogleSignInButton` with an animated rotating refresh icon from `MaterialIcon`.
- If `authError !== null`, render an error banner row below the button using `StatusDot variant="error"` and `TerminalText` displaying `authError`. (Style it using `backgroundColor: Theme.colors.semantic.errorDim`, `padding: Theme.spacing.sm`, and `borderRadius: Theme.borderRadius.default`).

#### 4. [MODIFY] `/src/screens/SettingsScreen.tsx`
Replace the mock Sign Out action with a fully functional log-out sequence:
- Extract `signOut`, `isSigningOut`, and `user` from `useAuthContext()`.
- Populate `ProfileAvatarBlock` props using the real `user` credentials (fallback name to `"student@shellx"`, email to empty string).
- In `handleSignOut`, display `Alert.alert` confirmation dialog:
  - Title: `"Sign Out"`
  - Message: `"This will clear all local data and return you to the login screen."`
  - Option Buttons: `"Cancel"` (do nothing) and `"Sign Out"` (fire `signOut()`).
- Bind the button in the Account section to trigger the confirmation handler, passing `loading={isSigningOut}` and `disabled={isSigningOut}`.

#### 5. [MODIFY] `/src/screens/SplashScreen.tsx`
Refactor the boot routing sequence to consult Firebase Auth or local storage UIDs:
- Since Firebase Auth listener resolver `onAuthStateChanged` is asynchronous, check `StorageKeys.AUTH_USER_UID` from storage cache to make immediate, flicker-free routing decisions.
- If a UID exists in cache, route to `'Main'`. Otherwise, route to `'Auth'`.

#### 6. [MODIFY] `/src/App.tsx`
Wire the provider trees sequentially in this exact nesting order:
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppBackground } from './components/shell';
import { RootNavigator } from './navigation';
import { AppContextProvider, NetworkBanner } from './context';
import { AuthContextProvider } from './context/AuthContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <AppContextProvider>
        <AuthContextProvider>
          <AppBackground>
            <View style={styles.root}>
              <RootNavigator />
              <NetworkBanner />
            </View>
          </AppBackground>
        </AuthContextProvider>
      </AppContextProvider>
    </SafeAreaProvider>
  );
};
```

---

Provide clean, production-ready TypeScript files without truncated lines or placeholders. Ensure all imports are accurate.