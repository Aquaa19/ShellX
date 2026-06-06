import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { StorageService, StorageKeys } from '../services/storage';
import { validateServerConfig, ServerConfigSchema } from '../services/validation';

export interface ServerConfig extends ServerConfigSchema {}

interface AppContextState {
  isAppReady:       boolean;
  serverConfig:     ServerConfig;
  setServerConfig:  (config: ServerConfig) => Promise<void>;
  isNetworkOnline:  boolean;
  saveServerConfig: (config: ServerConfig) => Promise<boolean>;
  loadServerConfig: () => Promise<void>;
}

const AppContext = createContext<AppContextState | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isNetworkOnline, setIsNetworkOnline] = useState(true);
  const [serverConfig, setServerConfigState] = useState<ServerConfig>({
    ip: '18.232.76.157',
    port: '8080',
    sshUser: 'student',
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsNetworkOnline(state.isConnected ?? true);
    });
    loadServerConfig().finally(() => setIsAppReady(true));
    return () => unsubscribe();
  }, []);

  const loadServerConfig = async () => {
    const data = await StorageService.multiGet<string>([
      StorageKeys.SERVER_IP,
      StorageKeys.SERVER_PORT,
      StorageKeys.SERVER_SSH_USER,
    ]);
    setServerConfigState({
      ip: data[StorageKeys.SERVER_IP] || '18.232.76.157',
      port: data[StorageKeys.SERVER_PORT] || '8080',
      sshUser: data[StorageKeys.SERVER_SSH_USER] || 'student',
    });
  };

  const saveServerConfig = async (config: ServerConfig): Promise<boolean> => {
    const { valid } = validateServerConfig(config);
    if (!valid) return false;

    const okIp = await StorageService.set(StorageKeys.SERVER_IP, config.ip);
    const okPort = await StorageService.set(StorageKeys.SERVER_PORT, config.port);
    const okUser = await StorageService.set(StorageKeys.SERVER_SSH_USER, config.sshUser);

    if (okIp && okPort && okUser) {
      setServerConfigState(config);
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        isAppReady,
        serverConfig,
        setServerConfig: async (cfg) => setServerConfigState(cfg),
        isNetworkOnline,
        saveServerConfig,
        loadServerConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext(): AppContextState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('[useAppContext] Must be used within <AppContextProvider>.');
  return ctx;
}