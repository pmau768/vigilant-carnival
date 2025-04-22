/**
 * Service to handle all localStorage operations
 */
export class LocalStorageService {
  /**
   * Save data to localStorage
   */
  static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (key: ${key}):`, error);
    }
  }
  
  /**
   * Get data from localStorage
   */
  static get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return defaultValue;
    }
  }
  
  /**
   * Remove a key from localStorage
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  }
  
  /**
   * Check if a key exists in localStorage
   */
  static exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}