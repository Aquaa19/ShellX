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