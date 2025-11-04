import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Service - Wrapper around AsyncStorage with TypeScript support
 */

const STORAGE_KEYS = {
  USER: '@donor_app:user',
  AUTH_TOKEN: '@donor_app:auth_token',
  PETS: '@donor_app:pets',
  APPOINTMENTS: '@donor_app:appointments',
  PREFERENCES: '@donor_app:preferences',
  ONBOARDING_COMPLETE: '@donor_app:onboarding_complete',
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;

class StorageService {
  /**
   * Save data to storage
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
      throw error;
    }
  }

  /**
   * Get data from storage
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get multiple items
   */
  async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};
      
      pairs.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error reading multiple items from storage:', error);
      return {};
    }
  }

  /**
   * Set multiple items
   */
  async multiSet(keyValuePairs: Array<[string, any]>): Promise<void> {
    try {
      const pairs: Array<[string, string]> = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error('Error saving multiple items to storage:', error);
      throw error;
    }
  }

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from storage:', error);
      return [];
    }
  }

  // Convenience methods for common operations
  
  async saveUser(user: any): Promise<void> {
    return this.setItem(STORAGE_KEYS.USER, user);
  }

  async getUser(): Promise<any | null> {
    return this.getItem(STORAGE_KEYS.USER);
  }

  async removeUser(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.USER);
  }

  async saveAuthToken(token: string): Promise<void> {
    return this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getAuthToken(): Promise<string | null> {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  async removeAuthToken(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  async setOnboardingComplete(complete: boolean): Promise<void> {
    return this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, complete);
  }

  async isOnboardingComplete(): Promise<boolean> {
    const result = await this.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return result ?? false;
  }
}

export const storageService = new StorageService();
export { STORAGE_KEYS };
