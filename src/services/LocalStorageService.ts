/**
 * Service to handle all localStorage operations
 */
export class LocalStorageService {
  /**
   * Check if localStorage is available in the current environment
   */
  static isAvailable(): boolean {
    try {
      const testKey = '_test_' + Date.now();
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.error('LocalStorage is not available:', error);
      return false;
    }
  }
  
  /**
   * Save data to localStorage
   */
  static save<T>(key: string, data: T): boolean {
    if (!this.isAvailable()) {
      console.error('Cannot save data: LocalStorage is not available');
      return false;
    }
    
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      
      // Verify the data was saved correctly
      const saved = localStorage.getItem(key);
      if (!saved) {
        console.error(`Data for key ${key} was not saved properly`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage (key: ${key}):`, error);
      
      // Check if this is a quota error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota exceeded. Try clearing some data.');
      } else if (error instanceof TypeError) {
        console.error('Data could not be serialized. Check for circular references or non-serializable values.');
      }
      
      return false;
    }
  }
  
  /**
   * Get data from localStorage
   */
  static get<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) {
      console.error('Cannot retrieve data: LocalStorage is not available');
      return defaultValue;
    }
    
    try {
      const data = localStorage.getItem(key);
      if (data === null) {
        return defaultValue;
      }
      
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return defaultValue;
    }
  }
  
  /**
   * Remove a key from localStorage
   */
  static remove(key: string): boolean {
    if (!this.isAvailable()) {
      console.error('Cannot remove data: LocalStorage is not available');
      return false;
    }
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
      return false;
    }
  }
  
  /**
   * Check if a key exists in localStorage
   */
  static exists(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }
    
    return localStorage.getItem(key) !== null;
  }
  
  /**
   * Clear all data from localStorage 
   */
  static clear(): boolean {
    if (!this.isAvailable()) {
      console.error('Cannot clear data: LocalStorage is not available');
      return false;
    }
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
}