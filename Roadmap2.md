# ShellX — Roadmap 2: Dynamic & Live CUI Backend Integration
## Masterclass-Tier Production Build Plan
### Target: Full Dynamic Android CUI Linux Lab Simulator (React Native CLI + TypeScript)

---

> **Document Authority:** This file is the singular, uncompromised source of truth for the Antigravity dynamic verification system and the coder AI agent. Every checkbox below represents one discrete, mandatory, atomic build action. No file may be modified, created, or wired without a corresponding checked box. Build order is strictly chronological within each phase.
>
> **Strict Rule:** This roadmap builds exclusively on top of the verified, static Roadmap 1 codebase. The agent must not guess, fabricate, or assume the internal structure of any existing file. If the exact export signature of any existing atom, component, or token file is required to complete a task, **stop and request the file contents from the user before proceeding.**

---

## ⚙️ Suggested Build Order (Macro)

```
Phase 2.1 ──────→ Phase 2.2 ──────→ Phase 2.3 ──────→ Phase 2.4 ──────→ Phase 2.5 ──────→ Phase 2.6
    ↓                  ↓                  ↓                  ↓                  ↓                  ↓
Persistence &      Firebase Auth      SSH Socket &       Terminal PTY       Lesson Engine      FileSystem
Routing Flow       & Google OAuth     Diagnostics        Shell Stream       & Firestore        Live Sync
    ↓                  ↓                  ↓                  ↓                  ↓                  ↓
AsyncStorage,      @firebase/app,     WebSocket          ANSI Escape        Firestore          Remote ls
AppContext,        /auth,             Bridge, IP/Port    Injection,         Progress,          Traversal,
Animated Splash    GoogleSignin       Validation,        Auto-scroll,       Task Validator,    Tree Nodes,
                                      Ping Probe         Vim Sync           State Unlock       File Inspect
                                            ↓
                                    Verification Pass
```

> **Phase Dependency Rule:** Phase 2.2 requires Phase 2.1's `AppContext` to be stable and tested. Phase 2.3 requires Phase 2.2's `AuthContext` user object. Phase 2.4 requires Phase 2.3's `TerminalConnectionContext` socket ref. Phase 2.5 requires Phase 2.2 Firebase init and Phase 2.4 terminal socket. Phase 2.6 requires Phase 2.4's shell execution pipeline. Never skip a phase.

---

## 🔖 Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[x]` | Completed |
| `⚡` | Critical path item — blocks all downstream work in this phase |
| `🔒` | Foundational contract file — do not modify after tests pass without full re-verification |
| `📐` | Must pass 44×44dp touch target check |
| `📱` | Must be verified on 5-inch 720×1280 low-end Android device profile |
| `⌨️` | Keyboard-aware — must be tested with soft keyboard open |
| `🌑` | Must render pure #000000 background — no off-black substitution |
| `🔥` | Firebase lifecycle dependency — must handle cold-start, sign-in, and sign-out states |
| `🔌` | Network-sensitive — must handle offline, timeout, and socket error states |
| `🔐` | Security-sensitive — never log, store in plaintext, or leak to version control |
| `🧪` | Requires a dedicated integration test or manual test protocol |
| `♻️` | Modifies an existing Roadmap 1 file — must preserve all static UI contracts |

---

---

# PHASE 2.1 — Local Persistence & Initial Routing Flow

> **Goal:** Establish the client-side persistence foundation using `AsyncStorage`. Convert the static `SplashScreen` into a real animated boot sequence that checks auth state and routes dynamically. Wire `SettingsScreen` configuration saving and loading against `AsyncStorage`. No network calls in this phase — local only.

---

## Sub-Phase 2.1.A — Dependency Installation & Environment Config

- [x] ⚡ 🔒 🔐 Install `react-native-config` for environment variable management.
  - **Command:** `npm install react-native-config`
  - **Android integration:** Add `apply plugin: "com.github.triplet.play"` and `apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"` to `/android/app/build.gradle`.
  - **Post-install action:** Run `cd android && ./gradlew clean` to regenerate the build config.

- [x] ⚡ 🔒 🔐 Create `/.env` (project root — **must be in `.gitignore`**)
  - **Structure:** Define all staging environment keys here. This file must never be committed.
  - **Required Variables:**
    ```dotenv
    # Firebase Configuration
    FIREBASE_API_KEY=your_firebase_api_key_here
    FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    FIREBASE_PROJECT_ID=your_firebase_project_id
    FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    FIREBASE_APP_ID=your_app_id

    # Google Sign-In
    GOOGLE_WEB_CLIENT_ID=your_google_web_client_id.apps.googleusercontent.com

    # SSH / WebSocket Gateway
    SHELLX_WS_GATEWAY_SCHEME=wss
    SHELLX_WS_GATEWAY_PORT=8080
    SHELLX_WS_PING_TIMEOUT_MS=5000
    SHELLX_WS_RECONNECT_DELAY_MS=3000
    SHELLX_WS_MAX_RECONNECT_ATTEMPTS=5

    # App
    SHELLX_ENV=staging
    SHELLX_VERSION=2.0.0
    ```
  - **Constraint:** Every key must be prefixed consistently. Never place bearer tokens, private keys, or SSH credentials in this file. SSH credentials belong exclusively in `AsyncStorage` at runtime.

- [x] 🔒 🔐 Create `/.env.example` (project root — **committed to version control**)
  - **Structure:** Identical key names as `/.env` with all values replaced by descriptive placeholder strings. This is the safe public reference for the team.

- [x] 🔒 Create `/src/config/env.ts`
  - **Purpose:** Typed wrapper around `react-native-config` exports. Provides TypeScript auto-complete and runtime validation for all environment variables.
  - **Code Layout:**
    ```typescript
    import Config from 'react-native-config';

    function requireEnv(key: string, fallback?: string): string {
      const value = (Config as Record<string, string | undefined>)[key] ?? fallback;
      if (value === undefined || value === '') {
        throw new Error(`[ShellX Config] Missing required environment variable: ${key}`);
      }
      return value;
    }

    export const AppEnv = {
      firebase: {
        apiKey:            requireEnv('FIREBASE_API_KEY'),
        authDomain:        requireEnv('FIREBASE_AUTH_DOMAIN'),
        projectId:         requireEnv('FIREBASE_PROJECT_ID'),
        storageBucket:     requireEnv('FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: requireEnv('FIREBASE_MESSAGING_SENDER_ID'),
        appId:             requireEnv('FIREBASE_APP_ID'),
      },
      google: {
        webClientId: requireEnv('GOOGLE_WEB_CLIENT_ID'),
      },
      ws: {
        scheme:              requireEnv('SHELLX_WS_GATEWAY_SCHEME', 'wss'),
        port:                parseInt(requireEnv('SHELLX_WS_GATEWAY_PORT', '8080'), 10),
        pingTimeoutMs:       parseInt(requireEnv('SHELLX_WS_PING_TIMEOUT_MS', '5000'), 10),
        reconnectDelayMs:    parseInt(requireEnv('SHELLX_WS_RECONNECT_DELAY_MS', '3000'), 10),
        maxReconnectAttempts:parseInt(requireEnv('SHELLX_WS_MAX_RECONNECT_ATTEMPTS', '5'), 10),
      },
      app: {
        env:     requireEnv('SHELLX_ENV', 'staging'),
        version: requireEnv('SHELLX_VERSION', '2.0.0'),
      },
    } as const;

    export type AppEnvType = typeof AppEnv;
    ```
  - **Constraint:** Import exclusively from `/src/config/env.ts` throughout the codebase — never from `react-native-config` directly.

- [x] ⚡ Install `@react-native-async-storage/async-storage`
  - **Command:** `npm install @react-native-async-storage/async-storage`
  - **Android integration:** Auto-linked. Verify in `android/app/src/main/java/.../MainApplication.kt` or `MainApplication.java` that the package is resolved.
  - **Post-install action:** `cd android && ./gradlew clean`.

- [x] ⚡ Install `@react-native-community/netinfo`
  - **Command:** `npm install @react-native-community/netinfo`
  - **Post-install action:** `cd android && ./gradlew clean`.

---

## Sub-Phase 2.1.B — AsyncStorage Service Layer (`/src/services/storage/`)

- [x] ⚡ 🔒 Create `/src/services/storage/StorageKeys.ts`
  - **Purpose:** Single source of truth for all `AsyncStorage` key strings. Prevents key naming collisions and typos throughout the codebase.
  - **Code Layout:**
    ```typescript
    // RULE: Never use raw string literals as AsyncStorage keys outside this file.
    export const StorageKeys = {
      // Server configuration (set by user in SettingsScreen)
      SERVER_IP:       '@shellx/server_ip',
      SERVER_PORT:     '@shellx/server_port',
      SERVER_SSH_USER: '@shellx/server_ssh_user',

      // Auth session cache
      AUTH_USER_UID:         '@shellx/auth_user_uid',
      AUTH_USER_DISPLAY_NAME:'@shellx/auth_user_display_name',
      AUTH_USER_EMAIL:       '@shellx/auth_user_email',
      AUTH_USER_PHOTO_URL:   '@shellx/auth_user_photo_url',

      // App state
      APP_ONBOARDED:      '@shellx/app_onboarded',
      LAST_ACTIVE_SCREEN: '@shellx/last_active_screen',

      // Terminal session
      TERMINAL_HISTORY:   '@shellx/terminal_history', // Capped rolling buffer
    } as const;

    export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];
    ```

- [x] ⚡ 🔒 Create `/src/services/storage/StorageService.ts`
  - **Purpose:** Typed `AsyncStorage` wrapper with error-swallowing, JSON serialization, and typed generics. All storage reads/writes in the app go through this service.
  - **Code Layout:**
    ```typescript
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { StorageKey } from './StorageKeys';

    export const StorageService = {
      async get<T>(key: StorageKey): Promise<T | null> {
        try {
          const raw = await AsyncStorage.getItem(key);
          if (raw === null) return null;
          return JSON.parse(raw) as T;
        } catch (error) {
          console.warn(`[StorageService] get error for key "${key}":`, error);
          return null;
        }
      },

      async set<T>(key: StorageKey, value: T): Promise<boolean> {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (error) {
          console.warn(`[StorageService] set error for key "${key}":`, error);
          return false;
        }
      },

      async remove(key: StorageKey): Promise<boolean> {
        try {
          await AsyncStorage.removeItem(key);
          return true;
        } catch (error) {
          console.warn(`[StorageService] remove error for key "${key}":`, error);
          return false;
        }
      },

      async clearAll(): Promise<boolean> {
        try {
          // Only clears ShellX-namespaced keys, not all AsyncStorage
          const allKeys = await AsyncStorage.getAllKeys();
          const shellxKeys = allKeys.filter(k => k.startsWith('@shellx/'));
          await AsyncStorage.multiRemove(shellxKeys);
          return true;
        } catch (error) {
          console.warn('[StorageService] clearAll error:', error);
          return false;
        }
      },

      async multiGet<T>(keys: StorageKey[]): Promise<Partial<Record<StorageKey, T>>> {
        try {
          const pairs = await AsyncStorage.multiGet(keys);
          return pairs.reduce((acc, [key, value]) => {
            if (value !== null) {
              try { acc[key as StorageKey] = JSON.parse(value) as T; }
              catch { /* skip malformed values */ }
            }
            return acc;
          }, {} as Partial<Record<StorageKey, T>>);
        } catch (error) {
          console.warn('[StorageService] multiGet error:', error);
          return {};
        }
      },
    };
    ```
  - **Constraint:** This service must never throw. All errors are caught, logged with `console.warn`, and resolved with a safe fallback. Callers must handle `null` return values.

- [x] Create `/src/services/storage/index.ts`
  - **Exports:** `StorageService`, `StorageKeys`, `StorageKey`.

---

## Sub-Phase 2.1.C — Server Config Schema & Validation (`/src/services/validation/`)

- [x] ⚡ 🔒 Create `/src/services/validation/serverConfig.ts`
  - **Purpose:** Input validation schemas for the `SettingsScreen` server configuration form. Pure functions — no imports from components or screens. Used in Phase 2.3 connection layer as well.
  - **Required Validators:**
    ```typescript
    // IPv4 regex — supports standard dotted-decimal notation
    const IPV4_REGEX =
      /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

    // Hostname regex — allows subdomains and TLDs
    const HOSTNAME_REGEX =
      /^(([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;

    export function validateServerIP(ip: string): { valid: boolean; error?: string } {
      const trimmed = ip.trim();
      if (!trimmed) return { valid: false, error: 'IP address or hostname is required.' };
      if (IPV4_REGEX.test(trimmed) || HOSTNAME_REGEX.test(trimmed)) return { valid: true };
      return { valid: false, error: 'Enter a valid IPv4 address or hostname.' };
    }

    export function validateServerPort(port: string): { valid: boolean; error?: string } {
      const trimmed = port.trim();
      if (!trimmed) return { valid: false, error: 'Port number is required.' };
      const num = parseInt(trimmed, 10);
      if (isNaN(num)) return { valid: false, error: 'Port must be a number.' };
      if (num < 1 || num > 65535) return { valid: false, error: 'Port must be between 1 and 65535.' };
      return { valid: true };
    }

    export function validateSSHUsername(username: string): { valid: boolean; error?: string } {
      const trimmed = username.trim();
      if (!trimmed) return { valid: false, error: 'SSH username is required.' };
      if (trimmed.length > 32) return { valid: false, error: 'Username too long (max 32 chars).' };
      if (!/^[a-z_][a-z0-9_-]*$/.test(trimmed)) return { valid: false, error: 'Invalid Linux username format.' };
      return { valid: true };
    }

    export interface ServerConfigSchema {
      ip:       string;
      port:     string;
      sshUser:  string;
    }

    export function validateServerConfig(config: ServerConfigSchema): {
      valid: boolean;
      errors: Partial<Record<keyof ServerConfigSchema, string>>;
    } {
      const ipResult       = validateServerIP(config.ip);
      const portResult     = validateServerPort(config.port);
      const userResult     = validateSSHUsername(config.sshUser);
      const errors: Partial<Record<keyof ServerConfigSchema, string>> = {};
      if (!ipResult.valid)   errors.ip      = ipResult.error;
      if (!portResult.valid) errors.port    = portResult.error;
      if (!userResult.valid) errors.sshUser = userResult.error;
      return { valid: Object.keys(errors).length === 0, errors };
    }
    ```
  - **Constraint:** Zero side effects. No async operations. No React imports. Pure TypeScript functions only.

- [x] Create `/src/services/validation/index.ts`
  - **Exports:** `validateServerIP`, `validateServerPort`, `validateSSHUsername`, `validateServerConfig`, `ServerConfigSchema`.

---

## Sub-Phase 2.1.D — Global App Context (`/src/context/`)

- [x] ⚡ 🔒 Create `/src/context/AppContext.tsx`
  - **Purpose:** The root React Context providing global reactive state for: server configuration, network connectivity status, and auth initialization flag. This context wraps the entire navigator tree.
  - **State Shape:**
    ```typescript
    interface ServerConfig {
      ip:      string;
      port:    string;
      sshUser: string;
    }

    interface AppContextState {
      // Initialization
      isAppReady:       boolean;      // true after SplashScreen completes checks
      // Server config (loaded from AsyncStorage on mount)
      serverConfig:     ServerConfig;
      setServerConfig:  (config: ServerConfig) => Promise<void>;
      // Network
      isNetworkOnline:  boolean;
      // Actions
      saveServerConfig: (config: ServerConfig) => Promise<boolean>;
      loadServerConfig: () => Promise<void>;
    }
    ```
  - **Provider Implementation:**
    - On mount: subscribe to `NetInfo.addEventListener` for online/offline changes. Store the `unsubscribe` function in a `useRef` and call it in the cleanup return.
    - On mount: call `loadServerConfig()` which reads `StorageKeys.SERVER_IP`, `SERVER_PORT`, `SERVER_SSH_USER` via `StorageService.multiGet` and hydrates `serverConfig` state.
    - `saveServerConfig`: validates via `validateServerConfig`, then writes to `AsyncStorage` via `StorageService.set` for each key, updates in-memory state, returns `boolean` success.
    - `isNetworkOnline` default: `true` (optimistic). Updated by `NetInfo` listener.
  - **Exports:** `AppContext`, `AppContextProvider`, `useAppContext` hook.
  - **`useAppContext` hook:** Must throw a descriptive error if called outside `AppContextProvider`. Pattern:
    ```typescript
    export function useAppContext(): AppContextState {
      const ctx = useContext(AppContext);
      if (!ctx) throw new Error('[useAppContext] Must be used within <AppContextProvider>.');
      return ctx;
    }
    ```

- [x] 🔌 Create `/src/context/NetworkBanner.tsx`
  - **Purpose:** A globally positioned offline status banner that appears at the top of the screen when `isNetworkOnline` is `false`. Consumed by `AppContextProvider`'s render output.
  - **Wrappers:** React Native `<Animated.View>` absolutely positioned at top + `<LabelCapsText>`
  - **Behavior:** `Animated.timing` drives `translateY` from `-40` (hidden above screen edge) to `0` (visible) when offline. Reverses when back online with a 1-second delay.
  - **Styling:** `position: 'absolute'`, `top: 0`, `left: 0`, `right: 0`, `zIndex: ZIndex.toast`. `backgroundColor: Colors.semantic.warning`. `height: 32dp`. Center-aligned `LabelCapsText` `"NO NETWORK CONNECTION"` in `Colors.text.inverse`. Must account for `StatusBar.currentHeight` offset.
  - **Constraint:** `pointerEvents='none'` — this banner must never block touches on underlying content.

- [x] Create `/src/context/index.ts`
  - **Exports:** `AppContextProvider`, `useAppContext`, `NetworkBanner`.

---

## Sub-Phase 2.1.E — Animated SplashScreen Boot Flow

- [x] ⚡ ♻️ 🌑 📱 Modify `/src/screens/SplashScreen.tsx`
  - **Action:** Replace the static `useState(0.72)` progress stub with a real animated initialization sequence.
  - **New State Shape:**
    ```typescript
    const progressAnim   = useRef(new Animated.Value(0)).current;
    const [bootLog, setBootLog]   = useState<BootLogLine[]>([]);
    const [currentPhase, setCurrentPhase] = useState<'booting' | 'checking' | 'done'>('booting');
    ```
  - **New Type:**
    ```typescript
    interface BootLogLine {
      id:     string;
      prefix: '[  OK  ]' | '[ WAIT ]' | '[ FAIL ]';
      text:   string;
    }
    ```
  - **Boot Sequence Logic (inside `useEffect` on mount):**

    **Step 1 — Animate progress bar 0→40% over 600ms** via `Animated.timing` on `progressAnim`. Simultaneously append the following `BootLogLine` entries to `bootLog` via `setBootLog` in sequence with `setTimeout` offsets at 100ms, 200ms, 300ms:
    - `{ prefix: '[  OK  ]', text: 'Starting kernel event logging daemon...' }`
    - `{ prefix: '[  OK  ]', text: 'Mounting local filesystems...' }`
    - `{ prefix: '[  OK  ]', text: 'Activating swap...' }`

    **Step 2 — Animate progress bar 40→70% over 400ms** starting at 700ms offset. Simultaneously append at 750ms, 850ms:
    - `{ prefix: '[ WAIT ]', text: 'Checking auth session integrity...' }`
    - `{ prefix: '[  OK  ]', text: 'ShellX runtime environment loaded.' }`

    **Step 3 — At 1100ms offset:** Call `StorageService.get<string>(StorageKeys.AUTH_USER_UID)`. Check Firebase Auth current user (imported from `@react-native-firebase/auth`). Determine target route: if user is authenticated → `'Main'`, otherwise → `'Auth'`.

    **Step 4 — Animate progress bar 70→100% over 400ms** starting at 1200ms. Append at 1250ms:
    - `{ prefix: '[  OK  ]', text: 'System initialization complete.' }`

    **Step 5 — At 1700ms offset:** Call `navigation.replace('Auth')` or `navigation.replace('Main')` based on Step 3 result.

  - **BootLog Render:** Replace the static line array with a `FlatList` or mapped `bootLog.map(...)` rendering `TerminalText` lines. Each line: prefix `SyntaxText` (`[  OK  ]` → `Colors.semantic.success`, `[ WAIT ]` → `Colors.semantic.warning`, `[ FAIL ]` → `Colors.semantic.error`) + plain `TerminalText` for the message.
  - **Animated Progress Width:** Replace `<ProgressTrack progress={0.72}>` with an `Animated.View` fill where `width` is driven by `progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })`.
  - **Percentage Text:** Replace `useState("72%")` with `progressAnim.addListener(({ value }) => setPercentText(Math.round(value * 100) + '%'))`.
  - **Cleanup:** All `setTimeout` handles must be stored in a `useRef<NodeJS.Timeout[]>` array and cleared in the `useEffect` cleanup function to prevent memory leaks on unmount.
  - **New imports to add:** `Animated`, `useRef`, `useEffect` from `react`; `StorageService` from `/src/services/storage`; `StorageKeys`; `auth` from `@react-native-firebase/auth` (Phase 2.2 dependency — **stub this import with a comment for Phase 2.1, wire it in Phase 2.2**).
  - **Constraint:** The boot sequence duration must be ≤ 2000ms total. Must not block the JS thread with synchronous work. All `setTimeout` calls use the ref-tracked array for cleanup.

---

## Sub-Phase 2.1.F — Settings Persistence Wiring

- [x] ⚡ ♻️ ⌨️ Modify `/src/screens/SettingsScreen.tsx`
  - **Action:** Wire `ServerConfigInput` to real `AsyncStorage` persistence and validation. Replace all static `useState` stubs with live data.
  - **New Imports to Add:**
    ```typescript
    import { useAppContext }       from '../context/AppContext';
    import { validateServerConfig } from '../services/validation';
    ```
  - **Replace static state stubs** `useState('192.168.1.100')` and `useState('22')` with values sourced from `useAppContext().serverConfig`.
  - **New State Shape:**
    ```typescript
    const { serverConfig, saveServerConfig } = useAppContext();
    const [ipValue,   setIpValue]   = useState(serverConfig.ip);
    const [portValue, setPortValue] = useState(serverConfig.port);
    const [sshUser,   setSshUser]   = useState(serverConfig.sshUser);
    const [errors, setErrors]       = useState<{ip?: string; port?: string; sshUser?: string}>({});
    const [isSaving, setIsSaving]   = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    ```
  - **Save Handler:**
    ```typescript
    const handleSave = async () => {
      const config = { ip: ipValue.trim(), port: portValue.trim(), sshUser: sshUser.trim() };
      const { valid, errors: validationErrors } = validateServerConfig(config);
      if (!valid) { setErrors(validationErrors); return; }
      setErrors({});
      setIsSaving(true);
      const success = await saveServerConfig(config);
      setIsSaving(false);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    };
    ```
  - **Wire `SaveConfigurationButton`:** Pass `onPress={handleSave}`, `loading={isSaving}`, `disabled={isSaving}`.
  - **Wire `ServerConfigInput`:** Pass validation `errors` prop down to display field-level error text below each `ConfigInputField`.
  - **Success Feedback:** When `saveSuccess === true`, render a temporary `StatusIndicatorBadge` variant `success` with label `"CONFIG SAVED"` below the `SaveConfigurationButton`. Disappears after 2.5 seconds.
  - **`useEffect` dependency on `serverConfig`:** When `AppContext` serverConfig changes (e.g., from another screen or reload), re-sync local `ipValue`, `portValue`, `sshUser` state.
  - **Constraint:** `handleSave` must be wrapped in a try-catch. Keyboard must dismiss on save press via `Keyboard.dismiss()` before async work begins.

- [x] ♻️ Modify `/src/components/settings/ServerConfigInput.tsx`
  - **Action:** Add `sshUser` / `onSshUserChange` / `sshUserError` props to the existing `ServerConfigInput` component to accommodate the third configuration field.
  - **New `ConfigInputField`:** SSH Username field below Port. Label: `"SSH USERNAME"`. `keyboardType='default'`, `autoCapitalize='none'`, `autoCorrect={false}`.
  - **Constraint:** Must not break existing prop contracts. New props must be optional with sensible defaults for backward compatibility.

---

---

# PHASE 2.2 — Live Authentication Integration (Firebase Auth & Google OAuth)

> **Goal:** Replace all static mock auth flows with fully functional Firebase Authentication. Integrate Google Sign-In credential flow. Establish a reactive `AuthContext` that broadcasts user session state across the entire navigator. Wire the Sign Out handler in Settings with full local cache clearing.

---

## Sub-Phase 2.2.A — Firebase & Google Sign-In Dependencies

- [x] ⚡ 🔒 Install `@react-native-firebase/app`
  - **Command:** `npm install @react-native-firebase/app`
  - **Android integration:**
    1. Download `google-services.json` from Firebase Console and place it at `/android/app/google-services.json`.
    2. Add `apply plugin: 'com.google.gms.google-services'` at the bottom of `/android/app/build.gradle`.
    3. Add `classpath 'com.google.gms:google-services:4.3.15'` to `/android/build.gradle` `dependencies` block.
  - **Post-install:** `cd android && ./gradlew clean`.

- [x] ⚡ Install `@react-native-firebase/auth`
  - **Command:** `npm install @react-native-firebase/auth`
  - **No additional Android configuration required** — auto-linked via Firebase BoM from the app module.
  - **Post-install:** `cd android && ./gradlew clean`.

- [x] ⚡ 🔒 Install `@react-native-google-signin/google-signin`
  - **Command:** `npm install @react-native-google-signin/google-signin`
  - **Android integration:**
    1. Verify SHA-1 fingerprint of the debug keystore is registered in Firebase Console → Project Settings → Your App → SHA certificate fingerprints.
    2. No manual `android/app/build.gradle` changes required — auto-linked.
  - **Post-install:** `cd android && ./gradlew clean`.

- [x] Install `@react-native-firebase/firestore` (required by Phase 2.5, installed here to avoid multiple rebuild cycles)
  - **Command:** `npm install @react-native-firebase/firestore`
  - **Post-install:** `cd android && ./gradlew clean`.

---

## Sub-Phase 2.2.B — Auth Context (`/src/context/AuthContext.tsx`)

- [x] ⚡ 🔒 🔥 Create `/src/context/AuthContext.tsx`
  - **Purpose:** Firebase Auth state subscriber. Provides reactive user session data to the entire component tree. Single source of truth for authentication state.
  - **Dependencies:**
    ```typescript
    import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
    import { GoogleSignin } from '@react-native-google-signin/google-signin';
    import { AppEnv }       from '../config/env';
    import { StorageService } from '../services/storage/StorageService';
    import { StorageKeys }   from '../services/storage/StorageKeys';
    ```
  - **State Shape:**
    ```typescript
    interface AuthUser {
      uid:         string;
      displayName: string | null;
      email:       string | null;
      photoURL:    string | null;
    }

    interface AuthContextState {
      user:            AuthUser | null;
      isAuthLoading:   boolean;   // true during initial Firebase state resolution
      isSigningIn:     boolean;   // true during Google Sign-In flow
      isSigningOut:    boolean;   // true during sign-out + cache clear flow
      authError:       string | null;
      signInWithGoogle: () => Promise<void>;
      signOut:          () => Promise<void>;
    }
    ```
  - **Provider Implementation:**
    - **`useEffect` on mount — GoogleSignin configuration:**
      ```typescript
      GoogleSignin.configure({ webClientId: AppEnv.google.webClientId });
      ```
    - **Firebase Auth State Listener:**
      ```typescript
      const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          const mappedUser: AuthUser = {
            uid:         firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email:       firebaseUser.email,
            photoURL:    firebaseUser.photoURL,
          };
          setUser(mappedUser);
          // Cache user metadata for SplashScreen offline check
          await StorageService.set(StorageKeys.AUTH_USER_UID,          firebaseUser.uid);
          await StorageService.set(StorageKeys.AUTH_USER_DISPLAY_NAME, firebaseUser.displayName ?? '');
          await StorageService.set(StorageKeys.AUTH_USER_EMAIL,        firebaseUser.email ?? '');
          await StorageService.set(StorageKeys.AUTH_USER_PHOTO_URL,    firebaseUser.photoURL ?? '');
        } else {
          setUser(null);
          // Clear stale user cache keys on sign-out
          await StorageService.remove(StorageKeys.AUTH_USER_UID);
        }
        setIsAuthLoading(false);
      });
      return () => unsubscribe(); // Clean up listener on unmount
      ```
    - **`signInWithGoogle` implementation:**
      ```typescript
      const signInWithGoogle = async () => {
        setIsSigningIn(true);
        setAuthError(null);
        try {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
          const userInfo      = await GoogleSignin.signIn();
          const credential    = auth.GoogleAuthProvider.credential(userInfo.idToken);
          await auth().signInWithCredential(credential);
          // Auth state listener above handles user state update
        } catch (error: any) {
          const message = error?.message ?? 'Google sign-in failed. Please try again.';
          setAuthError(message);
          console.warn('[AuthContext] signInWithGoogle error:', error);
        } finally {
          setIsSigningIn(false);
        }
      };
      ```
    - **`signOut` implementation:**
      ```typescript
      const signOut = async () => {
        setIsSigningOut(true);
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          await auth().signOut();
          await StorageService.clearAll(); // Wipes all @shellx/* AsyncStorage keys
        } catch (error) {
          console.warn('[AuthContext] signOut error:', error);
        } finally {
          setIsSigningOut(false);
        }
      };
      ```
  - **Exports:** `AuthContext`, `AuthContextProvider`, `useAuthContext` hook (throws if used outside provider).

---

## Sub-Phase 2.2.C — Root Navigator Firebase Guard

- [x] ⚡ 🔥 ♻️ Modify `/src/navigation/RootNavigator.tsx`
  - **Action:** Wire Firebase auth state to navigation. The navigator must respond to `isAuthLoading` and `user` from `useAuthContext()` to determine the initial route dynamically.
  - **New Logic Pattern:**
    ```typescript
    const { user, isAuthLoading } = useAuthContext();

    if (isAuthLoading) {
      // Return null or a minimal loading placeholder — SplashScreen handles this window
      return null;
    }
    ```
  - **Navigation Route Resolution:** Use `React Navigation`'s conditional screen rendering pattern (not `navigation.navigate`) to avoid flicker:
    ```typescript
    // Inside <Stack.Navigator>:
    {user ? (
      <Stack.Screen name="Main" component={MainTabNavigator} />
    ) : (
      <Stack.Screen name="Auth" component={AuthScreen} />
    )}
    // Always include SplashScreen as the initial route regardless
    <Stack.Screen name="Splash" component={SplashScreen} />
    ```
  - **Constraint:** Never conditionally render the `<Stack.Navigator>` itself. Only conditionally render `Stack.Screen` children. This prevents navigation state corruption.

---

## Sub-Phase 2.2.D — AuthScreen Live Integration

- [x] ⚡ 🔥 ⌨️ 📐 ♻️ Modify `/src/screens/AuthScreen.tsx`
  - **Action:** Replace the mock `onPress: () => console.log(...)` handler on `GoogleSignInButton` with the real `signInWithGoogle` flow from `AuthContext`.
  - **New imports to add:**
    ```typescript
    import { useAuthContext } from '../context/AuthContext';
    ```
  - **Replace static state:**
    ```typescript
    const { signInWithGoogle, isSigningIn, authError } = useAuthContext();
    ```
  - **Wire `GoogleSignInButton`:** `onPress={signInWithGoogle}`, `loading={isSigningIn}`.
  - **Error Display:** Below `GoogleSignInButton`, conditionally render when `authError !== null`:
    - A `<View>` row with `StatusDot variant='error'` + `TerminalText` displaying `authError`.
    - Styled: `backgroundColor: Colors.semantic.errorDim`, `borderRadius: BorderRadius.default`, `padding: Spacing.sm`, `marginTop: Spacing.sm`.
  - **Auth Transition:** When `useAuthContext().user` becomes non-null (fired by `onAuthStateChanged`), the `RootNavigator` guard (Phase 2.2.C) automatically re-renders and shows the Main stack. **Do not** call `navigation.navigate` manually from `AuthScreen`.
  - **Loading State on `GoogleSignInButton`:** During `isSigningIn`, show a spinner (animated `Animated.View` rotation loop on a `MaterialIcon` `'refresh'`) replacing the Google G icon. Button `disabled={isSigningIn}`.

---

## Sub-Phase 2.2.E — App.tsx Context Provider Wiring

- [x] ⚡ ♻️ Modify `/src/App.tsx`
  - **Action:** Wrap `RootNavigator` with both `AppContextProvider` and `AuthContextProvider` in the correct order. Also add `NetworkBanner` as a globally positioned sibling inside `AppBackground`.
  - **New Code Layout:**
    ```typescript
    import React from 'react';
    import { View, StyleSheet } from 'react-native';
    import { AppBackground }      from './components/shell';
    import { RootNavigator }      from './navigation';
    import { AppContextProvider, NetworkBanner } from './context';
    import { AuthContextProvider } from './context/AuthContext';

    const App = () => (
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
    );

    const styles = StyleSheet.create({
      root: { flex: 1 },
    });

    export default App;
    ```
  - **Provider Order:** `AppContextProvider` → `AuthContextProvider`. `AppContext` must be outermost because `AuthContext` may call `StorageService` which is independent, but the `NetworkBanner` depends on `useAppContext`. This order ensures `NetworkBanner` can access `AppContext`.

---

## Sub-Phase 2.2.F — Settings Sign-Out Handler

- [x] 🔥 ♻️ Modify `/src/screens/SettingsScreen.tsx`
  - **Action:** Replace the stub `SecondaryActionButton "SIGN OUT"` with a real sign-out flow.
  - **New imports to add:**
    ```typescript
    import { useAuthContext }   from '../context/AuthContext';
    import { useNavigation }    from '@react-navigation/native';
    ```
  - **New state and handlers:**
    ```typescript
    const { signOut, isSigningOut, user } = useAuthContext();
    const navigation = useNavigation();
    ```
  - **Wire `ProfileAvatarBlock`:** Pass `displayName={user?.displayName ?? 'student@shellx'}`, `email={user?.email ?? ''}`, `avatarUri={user?.photoURL ?? undefined}`.
  - **Sign Out Handler:**
    ```typescript
    const handleSignOut = async () => {
      await signOut();
      // RootNavigator guard will automatically re-render to AuthScreen
      // No manual navigation.navigate needed
    };
    ```
  - **Sign Out Button:** Replace static `SecondaryActionButton` with `PrimaryActionButton` (or keep `SecondaryActionButton` with danger styling override). Pass `onPress={handleSignOut}`, `loading={isSigningOut}`, `disabled={isSigningOut}`.
  - **Confirmation Pattern:** Before calling `handleSignOut`, show a React Native `Alert.alert(...)` confirmation dialog: title `"Sign Out"`, message `"This will clear all local data and return you to the login screen."`, buttons `["Cancel", "Sign Out"]`. Only call `signOut()` if user confirms.

---

---

# PHASE 2.3 — SSH Socket Connection Layer & Diagnostic Engine

> **Goal:** Build the full remote connection infrastructure. Implement a WebSocket terminal bridge client architecture. Wire the `ServerStatusSignal` live ping probe. Add complete input validation error states to the Settings form.

---

## Sub-Phase 2.3.A — WebSocket Terminal Bridge Architecture (`/src/services/terminal/`)

- [x] ⚡ 🔒 🔌 Create `/src/services/terminal/TerminalSocket.ts`
  - **Purpose:** Manages the WebSocket connection lifecycle to a remote `node-pty`/xterm.js socket gateway. This service is the sole owner of the `WebSocket` instance. All send/receive operations go through this service.
  - **Connection URL Construction:**
    ```typescript
    // URL format: wss://{ip}:{wsPort}/terminal?user={sshUser}&uid={firebaseUID}
    function buildGatewayUrl(ip: string, port: string, sshUser: string, uid: string): string {
      const { scheme, port: wsPort } = AppEnv.ws;
      return `${scheme}://${ip}:${wsPort}/terminal?user=${encodeURIComponent(sshUser)}&uid=${encodeURIComponent(uid)}&sshPort=${port}`;
    }
    ```
  - **Class Structure:**
    ```typescript
    type SocketEventCallback = {
      onOpen:    ()              => void;
      onMessage: (data: string) => void;
      onError:   (event: Event) => void;
      onClose:   (code: number, reason: string) => void;
    };

    class TerminalSocketClient {
      private ws:                  WebSocket | null      = null;
      private callbacks:           SocketEventCallback | null = null;
      private reconnectAttempts:   number                = 0;
      private reconnectTimer:      ReturnType<typeof setTimeout> | null = null;
      private isIntentionallyClosed: boolean             = false;

      connect(ip: string, port: string, sshUser: string, uid: string, callbacks: SocketEventCallback): void { ... }
      send(data: string): void { ... }
      sendRaw(bytes: Uint8Array): void { ... }  // For ANSI escape sequences
      disconnect(): void { ... }
      private scheduleReconnect(): void { ... }
      get isConnected(): boolean { return this.ws?.readyState === WebSocket.OPEN; }
      get readyState(): number { return this.ws?.readyState ?? WebSocket.CLOSED; }
    }
    ```
  - **`connect` Implementation:**
    1. Call `disconnect()` first to close any existing socket.
    2. Set `isIntentionallyClosed = false`.
    3. Instantiate `new WebSocket(buildGatewayUrl(...))`.
    4. Wire `ws.onopen`, `ws.onmessage`, `ws.onerror`, `ws.onclose` to `callbacks`.
    5. `ws.onclose`: if `!isIntentionallyClosed` and `reconnectAttempts < AppEnv.ws.maxReconnectAttempts`, call `scheduleReconnect()`.
  - **`scheduleReconnect` Implementation:** Uses `setTimeout` with exponential backoff: `AppEnv.ws.reconnectDelayMs * (2 ** reconnectAttempts)` capped at 30000ms.
  - **`disconnect` Implementation:** Set `isIntentionallyClosed = true`. Clear `reconnectTimer`. Call `ws.close(1000, 'Client disconnect')`. Set `ws = null`. Reset `reconnectAttempts = 0`.
  - **`send` Implementation:** If `ws?.readyState !== WebSocket.OPEN`, log warning and return without throwing. Otherwise call `ws.send(data)`.
  - **Export:** `export const terminalSocket = new TerminalSocketClient();` (singleton).

- [x] 🔒 🔌 Create `/src/services/terminal/PingService.ts`
  - **Purpose:** Lightweight TCP/WebSocket reachability probe. Used exclusively by `ServerStatusSignal` "Test Connection" button. Does NOT use `terminalSocket` — creates a one-shot WebSocket probe instead.
  - **Interface:**
    ```typescript
    export interface PingResult {
      reachable:  boolean;
      latencyMs:  number | null;
      error:      string | null;
    }

    export async function pingServer(
      ip: string,
      port: string,
      timeoutMs: number = AppEnv.ws.pingTimeoutMs,
    ): Promise<PingResult> { ... }
    ```
  - **Implementation:**
    ```typescript
    // Opens a one-shot WebSocket to /ping endpoint, measures open→first message RTT
    const startTime = Date.now();
    return new Promise((resolve) => {
      const probeUrl = `${AppEnv.ws.scheme}://${ip}:${AppEnv.ws.port}/ping`;
      let settled = false;

      const settle = (result: PingResult) => {
        if (settled) return;
        settled = true;
        try { ws.close(1000); } catch {}
        resolve(result);
      };

      const timer = setTimeout(() => settle({
        reachable: false, latencyMs: null, error: 'Connection timed out.',
      }), timeoutMs);

      const ws = new WebSocket(probeUrl);
      ws.onopen    = () => settle({ reachable: true, latencyMs: Date.now() - startTime, error: null });
      ws.onerror   = () => settle({ reachable: false, latencyMs: null, error: 'Host unreachable.' });
      ws.onclose   = (e) => {
        if (!settled && e.code !== 1000) {
          settle({ reachable: false, latencyMs: null, error: `Connection closed (code ${e.code}).` });
        }
        clearTimeout(timer);
      };
    });
    ```
  - **Constraint:** `pingServer` must always resolve (never reject). Callers must not wrap in try-catch. The settled flag prevents double-resolution.

- [x] Create `/src/services/terminal/AnsiSequences.ts`
  - **Purpose:** Named constants for ANSI/VT100 escape sequences sent by the `DeveloperKeyboardBar`. Prevents raw escape string literals scattered throughout the codebase.
  - **Required Sequences:**
    ```typescript
    export const ANSI = {
      // Navigation
      ARROW_UP:    '\x1b[A',
      ARROW_DOWN:  '\x1b[B',
      ARROW_RIGHT: '\x1b[C',
      ARROW_LEFT:  '\x1b[D',
      // Control
      ESC:         '\x1b',
      TAB:         '\t',
      CTRL_C:      '\x03',
      CTRL_D:      '\x04',
      CTRL_Z:      '\x1a',
      CTRL_L:      '\x0c',   // Clear screen
      CTRL_A:      '\x01',   // Go to line start
      CTRL_E:      '\x05',   // Go to line end
      CTRL_U:      '\x15',   // Clear to line start
      CTRL_K:      '\x0b',   // Clear to line end
      CTRL_W:      '\x17',   // Delete word backwards
      CTRL_R:      '\x12',   // Reverse history search
      // Edit
      BACKSPACE:   '\x7f',
      DELETE:      '\x1b[3~',
      HOME:        '\x1b[H',
      END:         '\x1b[F',
      PAGE_UP:     '\x1b[5~',
      PAGE_DOWN:   '\x1b[6~',
      // Special characters
      PIPE:        '|',
      TILDE:       '~',
      FSLASH:      '/',
      BSLASH:      '\\',
      AMPERSAND:   '&',
      SEMICOLON:   ';',
      SPACE:       ' ',
    } as const;

    export type AnsiKey = keyof typeof ANSI;
    ```

- [x] Create `/src/services/terminal/TerminalOutputParser.ts`
  - **Purpose:** Parses raw WebSocket message strings from the terminal gateway into structured `TerminalLine` objects for display in `TerminalEditor`. Handles ANSI color code stripping, line splitting, and output type classification.
  - **Interface:**
    ```typescript
    import { TerminalLine } from '../../types/terminal';  // Type defined in Phase 2.3.B

    export function parseTerminalOutput(raw: string, currentPrompt: string): TerminalLine[] { ... }
    export function stripAnsiCodes(raw: string): string { ... }
    export function classifyOutputLine(line: string): TerminalLine['type'] { ... }
    ```
  - **`stripAnsiCodes`:** Strips `\x1b[...m` color codes and `\x1b[...J/K/H/A/B/C/D` cursor control sequences using regex: `/\x1b\[[0-9;]*[a-zA-Z]/g`.
  - **`classifyOutputLine`:** Returns `'error'` if line starts with common error prefixes (`bash: `, `command not found`, `-bash: `, `Error:`, `Permission denied`). Returns `'system'` for login banners. Returns `'output'` otherwise.
  - **`parseTerminalOutput`:** Splits `raw` by `\r\n` and `\n`. For each non-empty line, creates a `TerminalLine` with a unique `id` (`Date.now() + '-' + index + '-' + Math.random()`), `type` from `classifyOutputLine`, and `content` from `stripAnsiCodes`.

- [x] Create `/src/services/terminal/index.ts`
  - **Exports:** `terminalSocket`, `pingServer`, `ANSI`, `AnsiKey`, `parseTerminalOutput`, `stripAnsiCodes`.

---

## Sub-Phase 2.3.B — Shared TypeScript Types (`/src/types/`)

- [x] ⚡ 🔒 Create `/src/types/terminal.ts`
  - **Purpose:** Shared TypeScript interfaces for terminal domain objects. Imported by both components and services — no React Native imports allowed here.
  - **Code Layout:**
    ```typescript
    export type TerminalLineType = 'command' | 'output' | 'error' | 'system';

    export interface TerminalLine {
      id:         string;
      type:       TerminalLineType;
      content:    string;
      timestamp?: number;
    }

    export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error' | 'offline';

    export type VimMode = 'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND';

    export interface ServerConfig {
      ip:      string;
      port:    string;
      sshUser: string;
    }

    export interface PingResult {
      reachable:  boolean;
      latencyMs:  number | null;
      error:      string | null;
    }
    ```

- [x] 🔒 Create `/src/types/lessons.ts`
  - **Purpose:** Shared TypeScript interfaces for the lesson domain. Matches Firestore document schema (Phase 2.5).
  - **Code Layout:**
    ```typescript
    export type LessonState = 'complete' | 'inProgress' | 'locked';

    export interface LessonData {
      id:                 string;
      moduleId:           string;
      title:              string;
      description:        string;
      commandCount:       number;
      estimatedMinutes:   number;
      state:              LessonState;
      progress:           number;         // 0–1
      validationCommand:  string;         // Shell command to run for "Run Check"
      validationExpected: string;         // Expected stdout substring for pass
      instructions:       string;         // Markdown or plain text task instructions
      order:              number;         // Sort order within module
    }

    export interface LessonModule {
      id:       string;
      title:    string;
      order:    number;
      lessons:  LessonData[];
    }
    ```

- [x] 🔒 Create `/src/types/filesystem.ts`
  - **Purpose:** Shared TypeScript interfaces for filesystem tree nodes.
  - **Code Layout:**
    ```typescript
    export type FileNodeType = 'file' | 'directory' | 'symlink';

    export interface FileTreeNode {
      name:       string;
      path:       string;
      type:       FileNodeType;
      size?:      number;       // bytes, undefined for directories
      extension?: string;
      children?:  FileTreeNode[];  // undefined = not yet fetched; [] = empty dir
      isLoading?: boolean;         // true while children are being fetched
      isExpanded?: boolean;
    }
    ```

- [x] Create `/src/types/index.ts`
  - **Exports:** Re-exports from `terminal.ts`, `lessons.ts`, `filesystem.ts`.

---

## Sub-Phase 2.3.C — Terminal Connection Context (`/src/context/TerminalConnectionContext.tsx`)

- [x] ⚡ 🔒 🔌 Create `/src/context/TerminalConnectionContext.tsx`
  - **Purpose:** Reactive context wrapping the `terminalSocket` singleton. Broadcasts connection state, latency, and error signals to all consumers (`TerminalScreen`, `FileSystemScreen`, `TopMetricsBar`, `ConnectionBadge`).
  - **State Shape:**
    ```typescript
    interface TerminalConnectionContextState {
      connectionState:  ConnectionState;
      latencyMs:        number | null;
      lastError:        string | null;
      isReconnecting:   boolean;
      // Actions
      connect:          (config: ServerConfig, uid: string) => void;
      disconnect:       () => void;
      sendCommand:      (command: string) => void;
      sendRawKey:       (ansiSequence: string) => void;
      pingServer:       (config: ServerConfig) => Promise<PingResult>;
      // Terminal output stream — read-only for consumers
      outputLines:      TerminalLine[];
      clearOutput:      () => void;
    }
    ```
  - **Provider Implementation:**
    - **`useEffect` on mount:** Attach callbacks to `terminalSocket` via a re-connection pattern. The socket itself is a singleton — only one connection context should exist.
    - **`connect` action:**
      ```typescript
      const connect = useCallback((config: ServerConfig, uid: string) => {
        setConnectionState('connecting');
        setLastError(null);
        terminalSocket.connect(config.ip, config.port, config.sshUser, uid, {
          onOpen:    ()            => setConnectionState('connected'),
          onMessage: (data)        => {
            const parsed = parseTerminalOutput(data, '');
            setOutputLines(prev => [...prev.slice(-499), ...parsed]); // Cap at 500 lines
          },
          onError:   ()            => setLastError('Socket error occurred.'),
          onClose:   (code, reason)=> {
            setConnectionState(code === 1000 ? 'disconnected' : 'error');
            if (code !== 1000) setIsReconnecting(true);
            else setIsReconnecting(false);
          },
        });
      }, []);
      ```
    - **`disconnect` action:** Calls `terminalSocket.disconnect()`, sets `connectionState('disconnected')`, `isReconnecting(false)`.
    - **`sendCommand` action:** Appends a local `TerminalLine` of `type: 'command'` to `outputLines` immediately (optimistic), then calls `terminalSocket.send(command + '\n')`.
    - **`sendRawKey` action:** Calls `terminalSocket.send(ansiSequence)` directly — no local line append.
    - **Output line cap:** `outputLines` is capped at 500 entries. When new lines arrive, old entries beyond the 500 cap are sliced off from the front using `prev.slice(-499 + newLines.length)`.
    - **`useEffect` cleanup:** `terminalSocket.disconnect()`.
  - **Exports:** `TerminalConnectionContextProvider`, `useTerminalConnection` hook.

- [x] ♻️ Modify `/src/context/index.ts`
  - **Action:** Add `TerminalConnectionContextProvider` and `useTerminalConnection` to exports.

- [x] ♻️ Modify `/src/App.tsx`
  - **Action:** Add `TerminalConnectionContextProvider` inside `AuthContextProvider`, wrapping `AppBackground`.
  - **Provider Tree Order:**
    ```
    AppContextProvider
      AuthContextProvider
        TerminalConnectionContextProvider
          AppBackground
            RootNavigator
            NetworkBanner
    ```

---

## Sub-Phase 2.3.D — ServerStatusSignal Live Wiring

- [x] 🔌 📐 ♻️ Modify `/src/components/settings/ServerStatusSignal.tsx`
  - **Action:** Wire the `onTest` prop to accept an async handler that calls `pingServer` and updates UI state reactively.
  - **New Props to support:**
    ```typescript
    interface ServerStatusSignalProps {
      state:      ConnectionState;
      latencyMs?: number | null;
      onTest?:    () => Promise<void>;
      isTesting?: boolean;  // true while ping is in-flight
      style?:     ViewStyle;
    }
    ```
  - **When `isTesting === true`:** Replace `StatusDot` with a small animated spinning `MaterialIcon` `'refresh'`. Disable the test tap target.
  - **Latency display:** When `latencyMs !== null`, render `MonoText` `${latencyMs}ms` in `Colors.semantic.success` next to the dot.
  - **Constraint:** Touch target for `onTest` must remain ≥ 44dp even when `isTesting` spinner replaces the dot.

- [x] 🔌 ♻️ Modify `/src/screens/SettingsScreen.tsx`
  - **Action:** Wire `ServerStatusSignal` to a real ping handler.
  - **New state:**
    ```typescript
    const [isTesting,      setIsTesting]      = useState(false);
    const [signalState,    setSignalState]    = useState<ConnectionState>('offline');
    const [signalLatency,  setSignalLatency]  = useState<number | null>(null);
    ```
  - **Ping Handler:**
    ```typescript
    const handleTestConnection = async () => {
      const ipResult   = validateServerIP(ipValue);
      const portResult = validateServerPort(portValue);
      if (!ipResult.valid || !portResult.valid) {
        setErrors({ ip: ipResult.error, port: portResult.error });
        return;
      }
      setIsTesting(true);
      setSignalState('connecting');
      setSignalLatency(null);
      const result = await pingServer({ ip: ipValue, port: portValue, sshUser: sshUser });
      setSignalState(result.reachable ? 'connected' : 'error');
      setSignalLatency(result.latencyMs);
      setIsTesting(false);
    };
    ```
  - **Pass down to `ServerStatusSignal`:** `state={signalState}`, `latencyMs={signalLatency}`, `onTest={handleTestConnection}`, `isTesting={isTesting}`.

---

---

# PHASE 2.4 — Interactive Terminal Shell PTY Integration

> **Goal:** Replace `MOCK_TERMINAL_LINES` with live data from `TerminalConnectionContext`. Wire the full command send/receive flow. Map `DeveloperKeyboardBar` keys to ANSI sequences. Implement auto-scroll and dynamic Vim mode detection.

---

## Sub-Phase 2.4.A — TerminalScreen Live Integration

- [x] ⚡ 🔌 ⌨️ 📱 ♻️ Modify `/src/screens/TerminalScreen.tsx`
  - **Action:** Full replacement of static state stubs with live `TerminalConnectionContext` data.
  - **New imports to add:**
    ```typescript
    import { useTerminalConnection } from '../context/TerminalConnectionContext';
    import { useAuthContext }        from '../context/AuthContext';
    import { useAppContext }         from '../context/AppContext';
    import { ANSI }                  from '../services/terminal/AnsiSequences';
    ```
  - **Replace static state stubs:**
    ```typescript
    const { user }          = useAuthContext();
    const { serverConfig }  = useAppContext();
    const {
      connectionState,
      outputLines,
      sendCommand,
      sendRawKey,
      connect,
      disconnect,
      latencyMs,
    } = useTerminalConnection();

    const [inputText,    setInputText]    = useState('');
    const [vimMode,      setVimMode]      = useState<VimMode>('NORMAL');
    const [isTaskSheetVisible, setIsTaskSheetVisible] = useState(false);
    const [showLessonContext,  setShowLessonContext]  = useState(true);
    // activeLesson populated by LessonsScreen navigation param (Phase 2.5)
    const [activeLesson, setActiveLesson] = useState<LessonData | null>(null);
    ```
  - **`useEffect` on mount — initiate connection:**
    ```typescript
    useEffect(() => {
      if (user && serverConfig.ip) {
        connect(serverConfig, user.uid);
      }
      return () => {
        // Do NOT disconnect on unmount — connection persists across tab switches
        // Only disconnect on explicit sign-out (handled in AuthContext.signOut)
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    ```
  - **`handleSubmitCommand`:**
    ```typescript
    const handleSubmitCommand = () => {
      if (!inputText.trim() && vimMode === 'NORMAL') return;
      sendCommand(inputText);
      setInputText('');
    };
    ```
  - **`handleKeyPress` (passed to `DeveloperKeyboardBar`):**
    ```typescript
    const handleKeyPress = (key: string) => {
      sendRawKey(key); // key is already an ANSI sequence from AnsiSequences.ts
    };
    ```
  - **Vim mode detection:** In the `onMessage` callback within `TerminalConnectionContext`, detect Vim/nano mode switches by inspecting `outputLines` for terminal title sequences or mode indicator strings. In `TerminalScreen`, watch `outputLines` via a `useEffect` and update `vimMode` when specific mode indicator patterns are detected.
    ```typescript
    useEffect(() => {
      const last = outputLines[outputLines.length - 1];
      if (!last) return;
      if (last.content.includes('-- INSERT --'))  setVimMode('INSERT');
      if (last.content.includes('-- VISUAL --'))  setVimMode('VISUAL');
      if (last.content.includes('-- COMMAND --')) setVimMode('COMMAND');
      // Exit insert/visual when we see a bare prompt line
      if (last.type === 'command') setVimMode('NORMAL');
    }, [outputLines]);
    ```
  - **Pass `connectionState` to `TopMetricsBar`:** Replace static `'offline'` with `connectionState`.
  - **Pass `outputLines` to `TerminalWorkspace` / `TerminalEditor`:** Replace `MOCK_TERMINAL_LINES`.
  - **Pass `vimMode` to `VimStatusStrip`.**
  - **Connection status in `AppHeader`:** `ConnectionBadge state={connectionState}`.

---

## Sub-Phase 2.4.B — TerminalEditor Live Data & Auto-Scroll

- [x] 🔌 📱 ♻️ Modify `/src/components/terminal/TerminalEditor.tsx`
  - **Action:** Replace `ScrollView` + `map` with `FlatList` for virtualized rendering. Add auto-scroll-to-bottom on new lines. Accept live `TerminalLine[]` prop.
  - **Props interface change:**
    ```typescript
    interface TerminalEditorProps {
      lines:       TerminalLine[];   // Live from TerminalConnectionContext
      promptText:  string;
      onSubmit:    () => void;
      inputValue:  string;
      onInputChange:(text: string) => void;
      style?:      ViewStyle;
    }
    ```
  - **Replace `ScrollView` with `FlatList`:**
    ```typescript
    const flatListRef = useRef<FlatList>(null);

    // Auto-scroll on new lines
    useEffect(() => {
      if (lines.length > 0) {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    }, [lines.length]);

    <FlatList
      ref={flatListRef}
      data={lines}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TerminalCodeLine line={item} />}
      showsVerticalScrollIndicator={false}
      maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      keyboardShouldPersistTaps='always'
      ListFooterComponent={<TerminalPromptLine ... />}
    />
    ```
  - **`maintainVisibleContentPosition`:** Critical for OLED terminal UX — prevents jarring scroll position resets when new content arrives while the user is scrolled up reviewing history.
  - **Constraint:** `FlatList` must not re-render all items on each new line. Wrap `TerminalCodeLine` in `React.memo`. The `renderItem` function must be defined with `useCallback`.

- [x] ♻️ Modify `/src/components/terminal/TerminalCodeLine.tsx`
  - **Action:** Update props interface to accept a single `TerminalLine` object instead of individual string props. Wrap component in `React.memo`.
  - **New props:**
    ```typescript
    interface TerminalCodeLineProps {
      line:   TerminalLine;
      style?: ViewStyle;
    }
    ```
  - **Render logic:** Destructure `{ type, content }` from `line`. Type → color/prefix mapping as defined in Roadmap 1. Wrap in `React.memo((props) => ..., (prev, next) => prev.line.id === next.line.id)` for stable equality check.

---

## Sub-Phase 2.4.C — Developer Keyboard ANSI Injection

- [x] 🔌 📐 ♻️ Modify `/src/components/terminal/DeveloperKeyboardBar.tsx`
  - **Action:** Update `onKeyPress` callback to pass ANSI sequence strings instead of plain key label strings.
  - **New `KeyDef` type:**
    ```typescript
    interface KeyDef {
      label:    string;           // Display label on the key chip
      sequence: string;           // ANSI sequence to send (from ANSI constants)
      wide?:    boolean;
      special?: boolean;          // Styled as a modifier key
    }
    ```
  - **Default Key Map** (replace existing string array with typed `KeyDef[]`):
    ```typescript
    const DEFAULT_KEYS: KeyDef[] = [
      { label: 'ESC',   sequence: ANSI.ESC,         special: true  },
      { label: 'TAB',   sequence: ANSI.TAB                         },
      { label: 'CTRL+C',sequence: ANSI.CTRL_C,       special: true  },
      { label: 'CTRL+D',sequence: ANSI.CTRL_D,       special: true  },
      { label: 'CTRL+Z',sequence: ANSI.CTRL_Z,       special: true  },
      { label: 'CTRL+L',sequence: ANSI.CTRL_L                      },
      { label: 'CTRL+R',sequence: ANSI.CTRL_R                      },
      { label: '|',     sequence: ANSI.PIPE                         },
      { label: '~',     sequence: ANSI.TILDE                        },
      { label: '/',     sequence: ANSI.FSLASH                       },
      { label: '\\',    sequence: ANSI.BSLASH                       },
      { label: '&',     sequence: ANSI.AMPERSAND                    },
      { label: ';',     sequence: ANSI.SEMICOLON                    },
      { label: '↑',     sequence: ANSI.ARROW_UP                     },
      { label: '↓',     sequence: ANSI.ARROW_DOWN                   },
      { label: '←',     sequence: ANSI.ARROW_LEFT                   },
      { label: '→',     sequence: ANSI.ARROW_RIGHT                  },
    ];
    ```
  - **`onKeyPress` callback now passes `sequence` not `label`:** `onKeyPress(key.sequence)`.

---

## Sub-Phase 2.4.D — VimStatusStrip Dynamic Sync

- [x] ♻️ Modify `/src/components/terminal/VimStatusStrip.tsx`
  - **Action:** Accept `VimMode` type instead of plain `string`. Add cursor position props.
  - **Updated props:**
    ```typescript
    interface VimStatusStripProps {
      mode:       VimMode;            // 'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND'
      filename?:  string;
      cursorLine: number;             // 1-based line number
      cursorCol:  number;             // 1-based column number
      lineCount:  number;             // Total lines in terminal output
      style?:     ViewStyle;
    }
    ```
  - **Cursor position display:** Right slot: `MonoText` `"Ln ${cursorLine}, Col ${cursorCol}"` in `Colors.text.secondary`, `FontSize.labelXS`.
  - **Line count display:** Right of cursor position: `MonoText` `"${lineCount}L"`.
  - **Mode background color map:** `NORMAL → Colors.surface.raised`, `INSERT → Colors.primary.default`, `VISUAL → Colors.semantic.warning`, `COMMAND → Colors.semantic.info`.
  - **Mode text color:** When `INSERT`, text must be `Colors.text.inverse` (dark on blue background). When `NORMAL`, text is `Colors.text.primary`.

- [x] ♻️ Modify `/src/components/terminal/TerminalWorkspace.tsx`
  - **Action:** Pass through `vimMode`, `cursorLine`, `cursorCol`, `lineCount`, `outputLines`, `inputValue`, `onInputChange`, `onSubmit`, `onKeyPress` as props from `TerminalScreen`.
  - **Constraint:** `TerminalWorkspace` is a layout compositor only — no business logic, no context calls. All data flows down from `TerminalScreen`.

---

---

# PHASE 2.5 — Dynamic Lesson Engine & Progress Synchronization

> **Goal:** Replace `MOCK_LESSONS` with Firestore-backed lesson data. Connect lesson card selection to terminal context loading. Implement the "Run Check" validation flow using the terminal socket. Synchronize progress to Firestore.

---

## Sub-Phase 2.5.A — Firestore Data Schema

- [x] ⚡ 🔒 🔥 Create `/src/services/firestore/FirestoreSchema.ts`
  - **Purpose:** Defines the exact Firestore collection/document path structure. Single source of truth for all database paths and document shapes. Prevents inconsistent path strings.
  - **Collection Structure:**
    ```
    /lessons/{moduleId}/lessonCards/{lessonId}    — LessonCardDocument
    /userProgress/{uid}/modules/{moduleId}         — UserModuleProgressDocument
    /userProgress/{uid}/lessonChecks/{lessonId}    — UserLessonCheckDocument
    ```
  - **Document Interfaces:**
    ```typescript
    export interface LessonCardDocument {
      id:                 string;
      moduleId:           string;
      title:              string;
      description:        string;
      commandCount:       number;
      estimatedMinutes:   number;
      validationCommand:  string;
      validationExpected: string;
      instructions:       string;
      order:              number;
      prerequisiteId?:    string;   // lessonId that must be complete first
    }

    export interface UserModuleProgressDocument {
      moduleId:              string;
      completedLessonIds:    string[];
      inProgressLessonId?:   string;
      lastUpdated:           FirebaseFirestoreTypes.Timestamp;
    }

    export interface UserLessonCheckDocument {
      lessonId:     string;
      passed:       boolean;
      attempts:     number;
      lastOutput:   string;
      completedAt?: FirebaseFirestoreTypes.Timestamp;
    }
    ```
  - **Path helpers:**
    ```typescript
    export const FirestorePaths = {
      lessonCard:     (moduleId: string, lessonId: string) =>
        `lessons/${moduleId}/lessonCards/${lessonId}`,
      moduleCards:    (moduleId: string) =>
        `lessons/${moduleId}/lessonCards`,
      userModuleProgress: (uid: string, moduleId: string) =>
        `userProgress/${uid}/modules/${moduleId}`,
      userLessonCheck:    (uid: string, lessonId: string) =>
        `userProgress/${uid}/lessonChecks/${lessonId}`,
    };
    ```

---

## Sub-Phase 2.5.B — Lesson Service Layer (`/src/services/lessons/`)

- [x] ⚡ 🔥 Create `/src/services/lessons/LessonService.ts`
  - **Purpose:** All Firestore read operations for lessons and user progress. Returns typed objects. No React imports.
  - **Dependencies:**
    ```typescript
    import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
    import { LessonCardDocument, UserModuleProgressDocument, FirestorePaths } from '../firestore/FirestoreSchema';
    import { LessonData, LessonModule, LessonState } from '../../types/lessons';
    ```
  - **Functions to implement:**

    **`fetchLessonModules(uid: string): Promise<LessonModule[]>`**
    - Queries the top-level `/lessons` collection to get module IDs.
    - For each module, fetches all `lessonCards` subcollection documents ordered by `order`.
    - Fetches user progress for each module from `userProgress/{uid}/modules/{moduleId}`.
    - Merges card data with user progress to compute `LessonState` and `progress` (0–1).
    - `LessonState` logic: `completedLessonIds.includes(id)` → `'complete'`. `inProgressLessonId === id` → `'inProgress'`. Else check prerequisite: if prerequisite is complete → `'inProgress'` (unlocked/available). Else → `'locked'`.
    - Returns `LessonModule[]` sorted by module `order`.

    **`fetchLessonDetail(moduleId: string, lessonId: string): Promise<LessonCardDocument | null>`**
    - Single document fetch from `lessons/{moduleId}/lessonCards/{lessonId}`.
    - Returns `null` if document does not exist.

    **`subscribeToUserProgress(uid: string, moduleId: string, callback: (doc: UserModuleProgressDocument | null) => void): () => void`**
    - Returns a Firestore `onSnapshot` unsubscribe function.
    - Fires `callback` on each progress update.

  - **Error handling:** All functions wrapped in try-catch. On error, log `console.warn` and return safe fallback (`[]` or `null`). Never throw from a service function.

- [x] 🔥 Create `/src/services/lessons/ProgressService.ts`
  - **Purpose:** All Firestore write operations for user lesson progress.
  - **Functions to implement:**

    **`markLessonInProgress(uid: string, moduleId: string, lessonId: string): Promise<boolean>`**
    - Merges `{ inProgressLessonId: lessonId, lastUpdated: Timestamp.now() }` into `userProgress/{uid}/modules/{moduleId}` using `firestore().doc(path).set(data, { merge: true })`.
    - Returns `boolean` success.

    **`markLessonComplete(uid: string, moduleId: string, lessonId: string, output: string): Promise<boolean>`**
    - Transaction that:
      1. Reads current `completedLessonIds` from module progress doc.
      2. Appends `lessonId` if not already present.
      3. Clears `inProgressLessonId` if it matches `lessonId`.
      4. Writes updated module progress doc.
      5. Writes a `UserLessonCheckDocument` to `userProgress/{uid}/lessonChecks/{lessonId}`.
    - Returns `boolean` success.

    **`recordLessonCheckAttempt(uid: string, lessonId: string, passed: boolean, output: string): Promise<void>`**
    - Increments `attempts` counter using `firestore.FieldValue.increment(1)`. Sets `passed` and `lastOutput`. If `passed`, sets `completedAt`.

- [x] Create `/src/services/lessons/index.ts`
  - **Exports:** `LessonService`, `ProgressService`.

---

## Sub-Phase 2.5.C — Lessons Context (`/src/context/LessonsContext.tsx`)

- [x] ⚡ 🔥 Create `/src/context/LessonsContext.tsx`
  - **Purpose:** Reactive context for lesson data. Subscribes to Firestore lesson fetches and user progress updates. Provides lesson selection, task sheet state, and validation trigger.
  - **State Shape:**
    ```typescript
    interface LessonsContextState {
      modules:          LessonModule[];
      isLoading:        boolean;
      activeLessonData: LessonData | null;
      isTaskSheetOpen:  boolean;
      isValidating:     boolean;
      lastValidationResult: { passed: boolean; output: string } | null;
      // Actions
      selectLesson:     (lesson: LessonData) => void;
      dismissTaskSheet: () => void;
      runValidation:    () => Promise<void>;
      refreshLessons:   () => Promise<void>;
    }
    ```
  - **Provider Implementation:**
    - On mount, call `LessonService.fetchLessonModules(uid)` and set `modules` state.
    - Subscribe to Firestore progress updates via `LessonService.subscribeToUserProgress`. On each update, call `refreshLessons()` to re-merge progress into module state.
    - Unsubscribe the Firestore listener in `useEffect` cleanup.
    - **`selectLesson` action:** Sets `activeLessonData`. Calls `ProgressService.markLessonInProgress(...)`. Opens task sheet by setting `isTaskSheetOpen = true`. Triggers `sendCommand` (from `useTerminalConnection`) to set up the terminal workspace context by running `cd /home/${sshUser}/lessons/${lesson.id}` silently.
    - **`runValidation` action:**
      1. Sets `isValidating = true`.
      2. Sends `activeLessonData.validationCommand` to terminal via `sendCommand`.
      3. Waits for the terminal output to settle (observe `outputLines` in a one-time `Promise` that resolves when new lines stop arriving for 800ms — implement via a debounce pattern using `setTimeout` that resets on each new line).
      4. Checks if the collected output contains `activeLessonData.validationExpected`.
      5. If pass: call `ProgressService.markLessonComplete(...)`, update `lastValidationResult`, refresh lessons.
      6. If fail: call `ProgressService.recordLessonCheckAttempt(...)` with `passed: false`, set `lastValidationResult`.
      7. Sets `isValidating = false`.
  - **Exports:** `LessonsContextProvider`, `useLessonsContext` hook.

- [x] ♻️ Modify `/src/App.tsx`
  - **Action:** Add `LessonsContextProvider` inside `TerminalConnectionContextProvider`.

---

## Sub-Phase 2.5.D — LessonsScreen Live Integration

- [x] 🔥 📐 📱 ♻️ Modify `/src/screens/LessonsScreen.tsx`
  - **Action:** Replace `MOCK_LESSONS` with live `useLessonsContext().modules` data.
  - **New imports:**
    ```typescript
    import { useLessonsContext } from '../context/LessonsContext';
    ```
  - **Replace static data:**
    ```typescript
    const { modules, isLoading, selectLesson } = useLessonsContext();
    ```
  - **Loading state:** When `isLoading`, replace the `FlatList` content area with a column of 3–4 `BorderedSurface` "skeleton" pulse-animated placeholder cards. Animation: `Animated.loop(Animated.sequence([Animated.timing(opacityAnim, {toValue: 0.3, duration: 700}), Animated.timing(opacityAnim, {toValue: 0.7, duration: 700})]))`.
  - **`onLessonPress`:** Call `selectLesson(lesson)`, then `navigation.navigate('Terminal')` to bring the terminal screen to the foreground. The `TaskBottomSheet` opens automatically via `LessonsContext`.
  - **Empty state:** When `modules.length === 0` and `!isLoading`, render a centered column: `TerminalText` `"No lessons available."` + `SecondaryActionButton` `"REFRESH"` calling `refreshLessons()`.

- [x] 🔥 ♻️ Modify `/src/screens/TerminalScreen.tsx`
  - **Action:** Wire `TaskBottomSheet` and `LessonContextHeader` to `LessonsContext`.
  - **New imports:**
    ```typescript
    import { useLessonsContext } from '../context/LessonsContext';
    ```
  - **Wire `TaskBottomSheet`:**
    ```typescript
    const {
      isTaskSheetOpen, dismissTaskSheet, activeLessonData,
      runValidation, isValidating, lastValidationResult,
    } = useLessonsContext();
    ```
    - `visible={isTaskSheetOpen}`, `onDismiss={dismissTaskSheet}`.
    - `taskTitle={activeLessonData?.title ?? ''}`.
    - `taskContent={activeLessonData?.instructions ?? ''}`.
  - **Wire `TaskSheetActions`:** `onRunCheck={runValidation}`, pass `isValidating` down.
  - **Wire `LessonContextHeader`:** `lessonTitle={activeLessonData?.title}`, `progress={activeLessonData?.progress ?? 0}`.
  - **Validation result display:** Inside `TaskBottomSheet` content area, when `lastValidationResult !== null`, render a `StatusIndicatorBadge`: `variant={lastValidationResult.passed ? 'success' : 'error'}`, `label={lastValidationResult.passed ? 'PASSED' : 'FAILED'}`. Below it, `TerminalText` showing the output snippet (max 3 lines).

- [x] ♻️ Modify `/src/components/terminal/TaskSheetActions.tsx`
  - **Action:** Add `isValidating` prop. When `true`, show loading spinner on "Run Check" button and disable both buttons.
  - **New props:** `onRunCheck?: () => void`, `onShowHint?: () => void`, `isValidating?: boolean`.

---

---

# PHASE 2.6 — Active FileSystem Explorer Sync

> **Goal:** Replace `MOCK_FILE_TREE` with a dynamic remote filesystem traversal layer. Commands are executed on the remote shell socket to `ls`/`stat` directories. Folder nodes expand on-demand. File tap events load file info or content into the terminal workspace.

---

## Sub-Phase 2.6.A — FileSystem Command Layer (`/src/services/filesystem/`)

- [ ] ⚡ 🔒 Create `/src/services/filesystem/FileSystemCommands.ts`
  - **Purpose:** Encapsulates all shell commands used to interrogate the remote filesystem. Pure string-building functions. No React imports.
  - **Functions:**
    ```typescript
    // List directory contents as machine-readable output
    export function buildListCommand(path: string): string {
      // Uses ls with null-terminated, long format, hidden files included
      // Output format per line: {type_char} {size_bytes} {name}
      return `ls -la --time-style='+' "${path}" 2>/dev/null | awk 'NR>1 {print $1,$5,$NF}'`;
    }

    // Stat a single file for metadata
    export function buildStatCommand(path: string): string {
      return `stat --printf="%n|%s|%F\n" "${path}" 2>/dev/null`;
    }

    // Read file content (capped to avoid overwhelming the socket)
    export function buildReadFileCommand(path: string, maxLines: number = 50): string {
      return `head -n ${maxLines} "${path}" 2>/dev/null`;
    }

    // Get home directory of current SSH user
    export function buildHomeDirCommand(): string {
      return 'echo $HOME';
    }

    // Check if path exists and what type it is
    export function buildTypeCheckCommand(path: string): string {
      return `[ -d "${path}" ] && echo DIR || ([ -f "${path}" ] && echo FILE || echo NONE)`;
    }
    ```

- [ ] 🔒 Create `/src/services/filesystem/FileSystemParser.ts`
  - **Purpose:** Parses the raw shell output of `buildListCommand` into `FileTreeNode[]` arrays. Pure functions.
  - **`parseLsOutput(rawOutput: string, parentPath: string): FileTreeNode[]`:**
    - Splits output by `\n`. Skips empty lines.
    - Each line format: `{permissions} {size} {name}` (from the awk command above).
    - Extracts `type` from first character of permissions: `d` → `'directory'`, `l` → `'symlink'`, else → `'file'`.
    - Extracts `name` from third field.
    - Extracts `size` from second field (`parseInt`).
    - Extracts `extension` from `name.split('.').pop()` if `type === 'file'`.
    - Filters out `.` and `..` entries.
    - Constructs `path` as `parentPath === '/' ? '/' + name : parentPath + '/' + name`.
    - Sets `children: undefined` for directories (not yet fetched), `isExpanded: false`, `isLoading: false`.
    - Returns sorted: directories first, then files, both alphabetically.
  - **`parseStatOutput(rawOutput: string): Partial<FileTreeNode> | null`:**
    - Splits on `|`. Returns `{ name, size, type }` if format is valid, else `null`.

- [ ] Create `/src/services/filesystem/index.ts`
  - **Exports:** `buildListCommand`, `buildStatCommand`, `buildReadFileCommand`, `buildHomeDirCommand`, `FileSystemParser`.

---

## Sub-Phase 2.6.B — FileSystem Context (`/src/context/FileSystemContext.tsx`)

- [ ] ⚡ 🔌 Create `/src/context/FileSystemContext.tsx`
  - **Purpose:** Manages the reactive filesystem tree state. Sends commands via `useTerminalConnection` to populate and expand tree nodes. Decouples the terminal output stream from the UI tree.
  - **State Shape:**
    ```typescript
    interface FileSystemContextState {
      tree:            FileTreeNode[];
      rootPath:        string;         // e.g. '/home/student'
      selectedPath:    string | null;
      isRootLoading:   boolean;
      pendingPaths:    Set<string>;    // Paths currently being fetched
      // Actions
      initialize:      () => Promise<void>;   // Fetch home dir + root contents
      expandFolder:    (node: FileTreeNode) => Promise<void>;
      collapseFolder:  (path: string) => void;
      selectFile:      (node: FileTreeNode) => void;
      openFileInTerminal:(path: string) => void;
    }
    ```
  - **Command Execution Architecture:**
    - `FileSystemContext` cannot directly receive WebSocket responses because `TerminalConnectionContext`'s `outputLines` is a shared stream used by `TerminalScreen` as well. A dedicated "filesystem command bus" pattern is needed:
    - Create a `filesystemOutputBuffer: string[]` ref inside this context.
    - When a filesystem command is sent, generate a unique `requestId` (e.g. `'__fs_req_${Date.now()}__'`).
    - Prefix the command with the requestId marker: `echo "FS_START:${requestId}" && ${command} && echo "FS_END:${requestId}"`.
    - Watch `outputLines` (from `useTerminalConnection`) via `useEffect`. When lines containing `FS_START:{requestId}` and `FS_END:{requestId}` are detected, extract the content between the markers, resolve the pending `Promise`.
    - This pattern cleanly scopes filesystem responses without contaminating the visible terminal history. The `FS_START/FS_END` sentinel lines are filtered from `TerminalCodeLine` display.
  - **`initialize` action:**
    1. Sends `buildHomeDirCommand()` with requestId. Parses `$HOME` from response. Sets `rootPath`.
    2. Sends `buildListCommand(rootPath)` with requestId. Parses result via `FileSystemParser.parseLsOutput`. Sets `tree`.
  - **`expandFolder` action:**
    1. If `node.children !== undefined` (already fetched), toggle `isExpanded` only — no network call.
    2. If `node.children === undefined` (never fetched): Add path to `pendingPaths`. Send `buildListCommand(node.path)`. On response, update the matching tree node's `children` with parsed result. Remove from `pendingPaths`.
    3. Updates `isExpanded = true` on the matching node.
    - Tree update is immutable: use recursive `updateNodeInTree(tree, targetPath, updater)` helper that returns a new tree array.
  - **`collapseFolder` action:** Sets `isExpanded = false` on matching node. Does not discard `children` — they remain cached for instant re-expansion.
  - **`selectFile` action:** Sets `selectedPath`. Does not open the file.
  - **`openFileInTerminal` action:** Sends `buildReadFileCommand(path)` to the visible terminal stream (no requestId prefix — output appears in terminal history). Navigates to terminal tab.
  - **`updateNodeInTree` helper (pure function, defined outside component):**
    ```typescript
    function updateNodeInTree(
      nodes: FileTreeNode[],
      targetPath: string,
      updater: (node: FileTreeNode) => FileTreeNode,
    ): FileTreeNode[] {
      return nodes.map(node => {
        if (node.path === targetPath) return updater(node);
        if (node.children) return { ...node, children: updateNodeInTree(node.children, targetPath, updater) };
        return node;
      });
    }
    ```
  - **Recursion depth guard:** `updateNodeInTree` must track depth. If depth exceeds 10, log a warning and return nodes unchanged. Prevents infinite recursion on malformed server responses.
  - **Exports:** `FileSystemContextProvider`, `useFileSystemContext` hook.

- [ ] ♻️ Modify `/src/App.tsx`
  - **Action:** Add `FileSystemContextProvider` inside `LessonsContextProvider`.

---

## Sub-Phase 2.6.C — FileSystemScreen Live Integration

- [ ] 🔌 📐 📱 ♻️ Modify `/src/screens/FileSystemScreen.tsx`
  - **Action:** Replace `MOCK_FILE_TREE` and static state with `useFileSystemContext`.
  - **New imports:**
    ```typescript
    import { useFileSystemContext } from '../context/FileSystemContext';
    import { useTerminalConnection } from '../context/TerminalConnectionContext';
    ```
  - **Replace static state:**
    ```typescript
    const {
      tree, rootPath, selectedPath, isRootLoading,
      pendingPaths, expandFolder, collapseFolder,
      selectFile, openFileInTerminal, initialize,
    } = useFileSystemContext();
    const { connectionState } = useTerminalConnection();
    ```
  - **`useEffect` on mount:**
    ```typescript
    useEffect(() => {
      if (connectionState === 'connected') {
        initialize();
      }
    }, [connectionState]); // Re-initialize if connection drops and reconnects
    ```
  - **Loading state:** When `isRootLoading`, show 4 animated skeleton rows in place of the tree.
  - **Offline state:** When `connectionState !== 'connected'`, show a centered `StatusIndicatorBadge variant='error'` with label `"NOT CONNECTED"` and `BodyText` `"Connect to a remote server in Settings."`. Hide the tree.
  - **Wire `FileSystemTree`:** `tree={tree}`, `selectedPath={selectedPath}`, `onFileSelect={(node) => selectFile(node)}`, `onFolderToggle={(node) => node.isExpanded ? collapseFolder(node.path) : expandFolder(node)}`.
  - **Wire bottom action bar:** `"OPEN"` button `onPress={() => selectedPath && openFileInTerminal(selectedPath)}`. `"COPY PATH"` button uses `Clipboard.setString(selectedPath ?? '')`.
  - **Breadcrumb:** Replace static `'/home/student'` with `selectedPath ?? rootPath`.

- [ ] 📐 ♻️ Modify `/src/components/filesystem/FileSystemTree.tsx`
  - **Action:** Update `onFolderToggle` callback to pass the full `FileTreeNode` instead of just `path`, so the caller can check `isExpanded`.
  - **Update `FolderRow` integration:** Pass `isLoading={pendingPaths.has(node.path)}` to `FolderRow` to show a loading spinner on the expand chevron while children are being fetched.

- [ ] 📐 ♻️ Modify `/src/components/filesystem/FolderRow.tsx`
  - **Action:** Add `isLoading?: boolean` prop. When `true`, replace the expand chevron `MaterialIcon` with a small animated rotating `MaterialIcon 'refresh'`.

---

---

# ✅ PRODUCTION-READY DYNAMIC VERIFICATION CHECKLIST

> Run this checklist as the final gate before the Antigravity system marks Roadmap 2 as complete. All items must be verified on a **physical or emulated 5-inch 720×1280 Android device running Android 10 or higher**. Network tests must use a real or simulated WAN-latency network path — never localhost.

---

## 🔲 Section V1 — Environment & Security Configuration

- [ ] `/.env` is present in `.gitignore`. Verified with `git status --short` — file must not appear as tracked.
- [ ] `/.env.example` is committed and contains all required keys with placeholder values.
- [ ] `AppEnv` object in `/src/config/env.ts` throws a descriptive error when any required key is missing. Verified by temporarily removing one key and running the app.
- [ ] `google-services.json` is present at `/android/app/google-services.json` and not committed to version control (added to `.gitignore`).
- [ ] `StorageService.clearAll()` wipes only `@shellx/*` namespaced keys — does not affect other app data. Verified by manually inserting a non-shellx key and confirming it survives `clearAll()`.
- [ ] No Firebase API keys, SSH credentials, or bearer tokens appear in any `.ts` or `.tsx` file outside of `/src/config/env.ts`.
- [ ] `react-native-config` build is verified: run `console.log(AppEnv.app.env)` and confirm it prints `'staging'` (not `undefined`).

---

## 🔲 Section V2 — AsyncStorage Persistence

- [ ] Server config saves persist across app cold restarts. Verified: set IP + Port + SSH User, force-close app, reopen — values pre-populate `SettingsScreen` inputs.
- [ ] `StorageService.get` returns `null` (not throw) for a non-existent key. Verified with a unit test or manual `console.log`.
- [ ] `StorageService.set` with a value exceeding 2MB handles gracefully (AsyncStorage limit). Verified by attempting to store a large string and confirming the error is caught.
- [ ] Validation errors appear correctly for invalid IP (`999.999.0.1` → error message), invalid port (`70000` → error message), invalid SSH username (`root user` with space → error message).
- [ ] `saveSuccess` flash badge appears for 2.5 seconds after a successful save, then disappears without a trace UI element.
- [ ] Settings inputs re-populate from `AppContext` when the screen is re-mounted after the app backgrounding.

---

## 🔲 Section V3 — Animated SplashScreen Timing & Routing

- [ ] SplashScreen boot sequence completes in ≤ 2000ms on a cold start. Measured with `performance.now()` markers in development.
- [ ] Progress bar animates smoothly from 0% to 100% without jank on a 2GB RAM low-end device. Confirmed with `systrace` or React DevTools profiler — no dropped frames during animation.
- [ ] Boot log lines append sequentially — no batch render flash showing all lines at once.
- [ ] When user is authenticated (Firebase user exists): app routes to `Main` tab navigator after boot. Verified by signing in, force-closing, and reopening.
- [ ] When user is not authenticated: app routes to `AuthScreen` after boot.
- [ ] All `setTimeout` handles are cleared on `SplashScreen` unmount. Verified by navigating away mid-boot and confirming no `setState` on unmounted component warning in logs.
- [ ] `[ WAIT ]` prefix appears in `Colors.semantic.warning` yellow. `[  OK  ]` appears in `Colors.semantic.success` green. Confirmed visually on device.

---

## 🔲 Section V4 — Firebase Authentication Lifecycle

- [ ] **Cold start, no prior session:** Firebase `onAuthStateChanged` fires with `null`. `isAuthLoading` becomes `false`. `RootNavigator` shows `AuthScreen`.
- [ ] **Google Sign-In happy path:** Tap "Sign in with Google". Google account picker appears. User selects account. Firebase `signInWithCredential` succeeds. `onAuthStateChanged` fires with user. `RootNavigator` transitions to `Main`. **Transition must be automatic — no manual `navigation.navigate` call.**
- [ ] **Google Sign-In cancellation:** User dismisses account picker. `authError` is `null` (not `'Sign in cancelled'` — silently ignore user cancellation). No crash. Button re-enables.
- [ ] **Google Sign-In network error:** Airplane mode active. Tap sign-in. `authError` is set with a user-readable error string. Error banner displays below the button.
- [ ] **Sign Out happy path:** Tap "Sign Out", confirm dialog, sign out completes. `StorageService.clearAll()` fires. `onAuthStateChanged` fires with `null`. `RootNavigator` transitions to `AuthScreen`. All cached user data cleared.
- [ ] **`ProfileAvatarBlock`** displays the Firebase user's Google photo URL as the avatar when available.
- [ ] **`isSigningIn` loading state:** Google button shows spinner and is `disabled` during the sign-in flow. Confirmed by adding a 2-second artificial delay to `GoogleSignin.signIn()` in development.
- [ ] **`isSigningOut` loading state:** Sign-out button shows spinner and is `disabled` during the sign-out flow.

---

## 🔲 Section V5 — SSH Socket Connection & Diagnostics

- [ ] **WebSocket ping happy path (server online):** Enter valid IP/Port, tap "Test Connection". `signalState` transitions: `offline → connecting → connected`. Latency value appears in milliseconds. `StatusDot` turns green.
- [ ] **WebSocket ping failure (server offline/wrong IP):** Enter unreachable IP, tap "Test Connection". `signalState` transitions to `error` after `SHELLX_WS_PING_TIMEOUT_MS` (default 5s). `StatusDot` turns red. Error is displayed. **Timeout must not exceed 5 seconds on 5-inch device.**
- [ ] **Ping during invalid form:** Tap "Test Connection" with empty IP field. Validation errors appear on the form fields. No ping is attempted. `isTesting` stays `false`.
- [ ] **`ServerStatusSignal` touch target:** `onTest` tap area is ≥ 44×44dp. Verified with Android Layout Inspector.
- [ ] **`TerminalSocket` reconnection:** Simulate connection drop mid-session (disable network interface). Confirm `onClose` fires. `isReconnecting` becomes `true`. `ConnectionBadge` updates to `'connecting'`. After reconnect delay, reconnection is attempted (visible in WebSocket debug logs).
- [ ] **Exponential backoff:** Reconnection delay doubles on each failed attempt. Verified: 3s → 6s → 12s → 24s → capped at 30s for attempt 5.
- [ ] **Max reconnect attempts:** After `maxReconnectAttempts` (5), no further reconnection is scheduled. `connectionState` settles at `'error'`. User must manually trigger reconnect.
- [ ] **Intentional disconnect:** Calling `disconnect()` sets `isIntentionallyClosed = true`. No reconnection is attempted. `connectionState = 'disconnected'`.
- [ ] **Socket cleanup on sign-out:** `signOut()` in `AuthContext` calls `terminalSocket.disconnect()`. No dangling WebSocket connection after sign-out.

---

## 🔲 Section V6 — Terminal PTY Integration & Keyboard Behavior

- [ ] **Command send flow:** Type `ls -la` in `TerminalPromptLine`, press submit. Command appears as a `type: 'command'` line with `$` prefix immediately (optimistic). Response lines appear as `type: 'output'` within expected network latency.
- [ ] **Error output classification:** Run `invalidcmd`. Response containing `command not found` renders with `Colors.semantic.error` text.
- [ ] **Auto-scroll behavior:** When new output lines arrive, `FlatList` auto-scrolls to bottom. Verified with 50+ rapid output lines.
- [ ] **Manual scroll preserved:** When user scrolls up to review history, `maintainVisibleContentPosition` prevents forced scroll-to-bottom. New lines arriving do not jump the view. User must scroll back down manually.
- [ ] **Output line cap (500 lines):** After 500 lines, oldest lines are evicted from state. No memory growth crash on low-end device after 10+ minutes of active use.
- [ ] **Developer keyboard bar position:** When soft keyboard is open, `DeveloperKeyboardBar` sits directly above the soft keyboard, below the terminal editor. No overlap. Verified on 5-inch 720×1280 with `KeyboardAvoidingView behavior='height'`.
- [ ] **ANSI key injection — ESC:** Tap ESC key. `terminalSocket.send('\x1b')` is called. If vim INSERT mode is active, vim transitions to NORMAL mode (output confirms mode change).
- [ ] **ANSI key injection — CTRL+C:** Tap CTRL+C. Running process on server is interrupted. Prompt reappears. Verified with `sleep 60` command.
- [ ] **ANSI key injection — Arrow UP:** Tap ↑ key. Previous command history is recalled in the terminal (PTY history on server side). Prompt text updates.
- [ ] **ANSI key injection — TAB:** Tap TAB. Shell autocomplete is triggered. Partial commands are completed.
- [ ] **Vim mode detection — INSERT:** Enter vim with `vim file.txt`, press `i`. `VimStatusStrip` background becomes `Colors.primary.default`. Mode label reads `INSERT`.
- [ ] **Vim mode detection — NORMAL:** Press ESC in vim. `VimStatusStrip` background reverts to `Colors.surface.raised`. Mode label reads `NORMAL`.
- [ ] **Terminal output wrapping:** Long output lines (>80 chars) wrap within `TerminalCodeLine` at the `MonoText` level. No horizontal overflow on 720dp width. `MonoText` uses `flexWrap: 'wrap'` or `numberOfLines` is not capped.
- [ ] **`TerminalCodeLine` memoization:** React DevTools confirms `TerminalCodeLine` does not re-render when a new line is appended (only the new item renders). Verified with React DevTools "Highlight updates" feature.
- [ ] **Keyboard dismiss:** Tapping anywhere on the `TerminalEditor` `FlatList` area (not the input) does NOT dismiss the keyboard. `keyboardShouldPersistTaps='always'` is confirmed.

---

## 🔲 Section V7 — Lesson Engine & Firestore Progress

- [ ] **Firestore lesson fetch:** `LessonsScreen` loads with real lesson cards from Firestore. Skeleton loader shows during fetch (≤ 3 seconds typical). Static mock data is not rendered.
- [ ] **Lesson state rendering — complete:** A completed lesson card has `Colors.semantic.success` border and `Colors.semantic.successDim` badge.
- [ ] **Lesson state rendering — locked:** A locked lesson card has `opacity: 0.5`. Tapping a locked card does not call `selectLesson` — it shows a brief `Alert` or `Toast`: `"Complete the previous lesson first."`.
- [ ] **Lesson selection flow:** Tap an unlocked lesson. `markLessonInProgress` is called (Firestore write confirmed in Firebase Console). Terminal navigates to foreground. `LessonContextHeader` shows lesson title. `TaskBottomSheet` slides up.
- [ ] **"Run Check" happy path:** Complete the lesson task in terminal. Tap "Run Check". Validation command executes on server. Expected output is detected. `lastValidationResult.passed = true`. Green `PASSED` badge appears in task sheet. Lesson card transitions to `complete` state on Lessons screen. Next lesson unlocks.
- [ ] **"Run Check" failure path:** Tap "Run Check" with incorrect work. `passed = false`. Red `FAILED` badge appears. Lesson remains in `inProgress` state. `attempts` counter increments in Firestore.
- [ ] **Progress Firestore sync:** Sign out and sign back in. Previously completed lessons are restored to `complete` state (Firestore persistence confirmed).
- [ ] **`LessonProgressBar`** on each lesson card shows correct `progress` (0–1) reflecting partial completion within a lesson (future: based on sub-task completion; in Roadmap 2 it reflects `passed` as 1.0).
- [ ] **Firestore listener unsubscribe:** Navigate away from `LessonsScreen` and back. Confirm that only one Firestore listener is active (no duplicate subscription). Verified by checking Firestore usage in Firebase Console.
- [ ] **Offline lesson display:** When `isNetworkOnline = false`, `LessonsScreen` shows a `NetworkBanner` and the last-fetched lesson data is displayed from memory. No crash. No empty state shown erroneously.

---

## 🔲 Section V8 — FileSystem Live Traversal

- [ ] **Initial tree load (connected):** Navigate to `FileSystemScreen`. `initialize()` runs. Home directory is detected. Root folder contents are displayed. Skeleton loader shown during fetch.
- [ ] **Offline state:** When `connectionState !== 'connected'`, tree is hidden. Offline error message is displayed. No ghost tree structure from mock data.
- [ ] **Folder expansion:** Tap a folder. `pendingPaths.has(path) = true`. Expand chevron shows spinner. Server `ls` command fires. Children populate under the folder node. Spinner disappears. `isExpanded = true`.
- [ ] **Folder collapse and re-expand:** Collapse a previously expanded folder. Children are cached (not discarded). Re-expansion is instant — no network call fired.
- [ ] **Deep nesting (3 levels):** Navigate to `/home/student/projects/lesson1/` (3 levels deep). Indent guides are visible. Horizontal `ScrollView` scrolls to show deep-nested items.
- [ ] **`updateNodeInTree` recursion depth guard:** Verified: a tree with 11 nesting levels does not cause a stack overflow. Warning appears in dev logs instead.
- [ ] **File selection:** Tap a file. `selectedPath` updates. `SelectedFileRow` renders with active background. Breadcrumb updates.
- [ ] **"OPEN" button:** Tap "OPEN" with a file selected. `buildReadFileCommand` is sent to terminal. File content appears in `TerminalEditor` output. Navigation switches to `Terminal` tab.
- [ ] **"COPY PATH" button:** Tap "COPY PATH". `Clipboard.setString` fires. Brief visual feedback (e.g., button label flashes to `"COPIED"` for 1.5s).
- [ ] **Empty directory:** Expand a folder with no children. `children` is set to `[]`. No spinner. Folder chevron becomes static (not expandable). A subtle `TerminalText` `"empty"` placeholder is shown in the indented area.
- [ ] **Filesystem command sentinel filtering:** `FS_START:{id}` and `FS_END:{id}` lines are **not** displayed in `TerminalEditor` output. Verified: run a filesystem expand and confirm no `FS_START` strings appear in the terminal history UI.

---

## 🔲 Section V9 — Network & Offline Resilience

- [ ] **NetworkBanner appearance:** Disable WiFi/data. `NetworkBanner` slides in from top within 1 second. Text `"NO NETWORK CONNECTION"` in `Colors.text.inverse` on `Colors.semantic.warning` background. `pointerEvents='none'` confirmed — tap-through works.
- [ ] **NetworkBanner dismissal:** Re-enable WiFi/data. `NetworkBanner` slides out within 1.5 seconds (1-second delay + animation).
- [ ] **Auth screen offline:** Open `AuthScreen` in airplane mode. Google sign-in button tap shows `authError` with a network-related message. No crash.
- [ ] **Terminal screen offline mid-session:** Disable network while typing in terminal. Next `sendCommand` fails gracefully. `connectionState` transitions to `error`. No crash. `ConnectionBadge` shows red.
- [ ] **Settings ping offline:** Tap "Test Connection" in airplane mode. Ping `Promise` settles after `pingTimeoutMs` with `reachable: false`. Never hangs indefinitely.
- [ ] **Firestore offline:** Disable network. Open `LessonsScreen`. Cached Firestore data (from Firestore's offline persistence) is displayed if available. If no cache, empty state is shown gracefully. No crash.

---

## 🔲 Section V10 — TypeScript, Performance & Code Quality

- [ ] `tsc --noEmit` exits with 0 errors across all new and modified files.
- [ ] ESLint passes with 0 errors on all new `/src/services/`, `/src/context/`, `/src/types/` files.
- [ ] No `any` type used in service files without explicit justification comment.
- [ ] All `useEffect` hooks that subscribe to external resources (NetInfo, Firebase `onAuthStateChanged`, Firestore `onSnapshot`, WebSocket callbacks) have cleanup functions returning the `unsubscribe`/`disconnect` call.
- [ ] `React.memo` wrapping verified on `TerminalCodeLine` — confirmed via React DevTools "Highlight updates" that only new lines re-render on `outputLines` append.
- [ ] `StyleSheet.create` used for all static styles in new component files. No inline style objects created in render functions.
- [ ] `Animated.Value` instances initialized in `useRef`, not in component body or render.
- [ ] Memory usage on 5-inch device does not exceed 150MB heap after 10 minutes of active terminal session with 500-line output cap in place. Verified with Android Studio Memory Profiler.
- [ ] All `Promise`-returning service functions (`StorageService`, `PingService`, `LessonService`, `ProgressService`) have been verified to never `throw` — all errors are caught internally and returned as safe falsy values or `null`.
- [ ] `terminalSocket` singleton is verified to have only one active `WebSocket` instance at any time — no socket leak from multiple `connect()` calls. Verified with WebSocket debugger.

---

## 🔲 Section V11 — Final New File Count Verification

> Run `find ./src -name "*.ts" -o -name "*.tsx" | sort` and confirm all new paths are present.

**Config (2 files):**
- [ ] `/src/config/env.ts`
- [ ] `/src/config/index.ts`

**Types (4 files):**
- [ ] `/src/types/index.ts`
- [ ] `/src/types/terminal.ts`
- [ ] `/src/types/lessons.ts`
- [ ] `/src/types/filesystem.ts`

**Services — Storage (3 files):**
- [ ] `/src/services/storage/StorageKeys.ts`
- [ ] `/src/services/storage/StorageService.ts`
- [ ] `/src/services/storage/index.ts`

**Services — Validation (2 files):**
- [ ] `/src/services/validation/serverConfig.ts`
- [ ] `/src/services/validation/index.ts`

**Services — Terminal (5 files):**
- [ ] `/src/services/terminal/TerminalSocket.ts`
- [ ] `/src/services/terminal/PingService.ts`
- [ ] `/src/services/terminal/AnsiSequences.ts`
- [ ] `/src/services/terminal/TerminalOutputParser.ts`
- [ ] `/src/services/terminal/index.ts`

**Services — Firestore (2 files):**
- [ ] `/src/services/firestore/FirestoreSchema.ts`
- [ ] `/src/services/firestore/index.ts`

**Services — Lessons (3 files):**
- [ ] `/src/services/lessons/LessonService.ts`
- [ ] `/src/services/lessons/ProgressService.ts`
- [ ] `/src/services/lessons/index.ts`

**Services — FileSystem (3 files):**
- [ ] `/src/services/filesystem/FileSystemCommands.ts`
- [ ] `/src/services/filesystem/FileSystemParser.ts`
- [ ] `/src/services/filesystem/index.ts`

**Context (6 files):**
- [ ] `/src/context/AppContext.tsx`
- [ ] `/src/context/AuthContext.tsx`
- [ ] `/src/context/TerminalConnectionContext.tsx`
- [ ] `/src/context/LessonsContext.tsx`
- [ ] `/src/context/FileSystemContext.tsx`
- [ ] `/src/context/NetworkBanner.tsx`
- [ ] `/src/context/index.ts`

**Modified Screens (5 files — ♻️):**
- [ ] `/src/screens/SplashScreen.tsx` (animated boot flow)
- [ ] `/src/screens/AuthScreen.tsx` (live Firebase sign-in)
- [ ] `/src/screens/TerminalScreen.tsx` (live socket + lesson context)
- [ ] `/src/screens/LessonsScreen.tsx` (Firestore live data)
- [ ] `/src/screens/FileSystemScreen.tsx` (live tree traversal)
- [ ] `/src/screens/SettingsScreen.tsx` (persistence + ping + sign-out)

**Modified Components (8 files — ♻️):**
- [ ] `/src/components/settings/ServerConfigInput.tsx` (sshUser field)
- [ ] `/src/components/settings/ServerStatusSignal.tsx` (live ping state)
- [ ] `/src/components/terminal/TerminalEditor.tsx` (FlatList + auto-scroll)
- [ ] `/src/components/terminal/TerminalCodeLine.tsx` (React.memo + TerminalLine type)
- [ ] `/src/components/terminal/DeveloperKeyboardBar.tsx` (KeyDef ANSI map)
- [ ] `/src/components/terminal/VimStatusStrip.tsx` (VimMode type + cursor pos)
- [x] `/src/components/terminal/TerminalWorkspace.tsx` (live prop passthrough)
- [ ] `/src/components/terminal/TaskSheetActions.tsx` (isValidating prop)
- [ ] `/src/components/filesystem/FileSystemTree.tsx` (full node callback)
- [ ] `/src/components/filesystem/FolderRow.tsx` (isLoading spinner)

**Modified Navigation (1 file — ♻️):**
- [ ] `/src/navigation/RootNavigator.tsx` (Firebase auth guard)

**Modified App Entry (1 file — ♻️):**
- [ ] `/src/App.tsx` (full context provider tree)

**Root Config Files (3 files):**
- [ ] `/.env` (not committed)
- [ ] `/.env.example` (committed)
- [ ] *(verify `google-services.json` at `/android/app/google-services.json` — not committed)*

---

> **Total new files in Roadmap 2: 31 new files**
> **Total modified files in Roadmap 2: 17 modified files**
> **Grand cumulative project file count (Roadmap 1 + Roadmap 2): 141 tracked source files**
>
> All 31 new files must compile without TypeScript errors. All 17 modified files must preserve Roadmap 1 static UI contracts while adding Roadmap 2 dynamic behavior. All V1–V11 verification sections must pass before Roadmap 2 is considered complete.

---

*Roadmap 2 — ShellX Dynamic Backend Integration*
*Document Version: 1.0.0*
*Architecture: React Native CLI + TypeScript + Firebase + WebSocket PTY + Firestore*
*Verification Standard: Antigravity Dynamic Verification Protocol v2*
*Builds upon: Roadmap 1 v1.0.0 (110-file verified static baseline)*
