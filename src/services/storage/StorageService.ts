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
      const allKeys = await AsyncStorage.getAllKeys();
      const shellxKeys = allKeys.filter(k => k.startsWith('@shellx/'));
      await AsyncStorage.removeMany(shellxKeys);
      return true;
    } catch (error) {
      console.warn('[StorageService] clearAll error:', error);
      return false;
    }
  },

  async multiGet<T>(keys: StorageKey[]): Promise<Partial<Record<StorageKey, T>>> {
    try {
      const record = await AsyncStorage.getMany(keys);
      const acc: Partial<Record<StorageKey, T>> = {};
      for (const key of keys) {
        const value = record[key];
        if (value !== null && value !== undefined) {
          try {
            acc[key] = JSON.parse(value) as T;
          } catch {
            // skip malformed values
          }
        }
      }
      return acc;
    } catch (error) {
      console.warn('[StorageService] multiGet error:', error);
      return {};
    }
  },
};