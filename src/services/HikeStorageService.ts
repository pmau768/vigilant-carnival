import { HikeRecord } from '../types';
import { LocalStorageService } from './LocalStorageService';

const HIKES_STORAGE_KEY = 'pawtrails_hikes';

export class HikeStorageService {
  /**
   * Check if storage is available
   */
  static isStorageAvailable(): boolean {
    return LocalStorageService.isAvailable();
  }
  
  /**
   * Save a new hike record
   */
  static saveHike(hike: Omit<HikeRecord, 'id'>): HikeRecord {
    // Validate hike data
    if (!hike.petId) {
      throw new Error('Pet ID is required');
    }
    
    if (!hike.date) {
      hike.date = new Date().toISOString().split('T')[0];
    }
    
    if (!hike.customTrailName) {
      hike.customTrailName = `Activity on ${new Date().toLocaleDateString()}`;
    }
    
    if (typeof hike.distance !== 'number' || hike.distance <= 0) {
      throw new Error('Valid distance is required');
    }
    
    if (typeof hike.duration !== 'number' || hike.duration <= 0) {
      throw new Error('Valid duration is required');
    }
    
    // Get existing hikes
    const hikes = this.getAllHikes();
    
    // Create a new hike with an ID
    const newHike: HikeRecord = {
      ...hike,
      id: Date.now().toString(),
    };
    
    // Add it to the list
    hikes.push(newHike);
    
    // Save back to storage
    const saveSuccess = LocalStorageService.save(HIKES_STORAGE_KEY, hikes);
    if (!saveSuccess) {
      console.error('Failed to save hike to localStorage');
      throw new Error('Failed to save hike due to storage issues');
    }
    
    // Verify the save worked
    const verifyHikes = LocalStorageService.get<HikeRecord[]>(HIKES_STORAGE_KEY, []);
    const verifyHike = verifyHikes.find(h => h.id === newHike.id);
    if (!verifyHike) {
      console.error('Failed to verify saved hike');
      throw new Error('Hike was not properly saved to storage');
    }
    
    return newHike;
  }
  
  /**
   * Get all hikes
   */
  static getAllHikes(): HikeRecord[] {
    if (!this.isStorageAvailable()) {
      console.error('Cannot get hikes: localStorage is not available');
      return [];
    }
    
    return LocalStorageService.get<HikeRecord[]>(HIKES_STORAGE_KEY, []);
  }
  
  /**
   * Get hikes for a specific pet
   */
  static getHikesForPet(petId: string): HikeRecord[] {
    if (!petId) {
      console.error('Invalid pet ID provided');
      return [];
    }
    
    const hikes = this.getAllHikes();
    return hikes.filter(hike => hike.petId === petId);
  }
  
  /**
   * Get a specific hike by ID
   */
  static getHikeById(hikeId: string): HikeRecord | undefined {
    if (!hikeId) {
      console.error('Invalid hike ID provided');
      return undefined;
    }
    
    const hikes = this.getAllHikes();
    return hikes.find(hike => hike.id === hikeId);
  }
  
  /**
   * Update an existing hike
   */
  static updateHike(hikeId: string, updates: Partial<HikeRecord>): HikeRecord | null {
    if (!hikeId) {
      console.error('Invalid hike ID provided for update');
      return null;
    }
    
    const hikes = this.getAllHikes();
    const hikeIndex = hikes.findIndex(hike => hike.id === hikeId);
    
    if (hikeIndex === -1) {
      console.error(`Hike with ID ${hikeId} not found`);
      return null;
    }
    
    // Update the hike
    const updatedHike = {
      ...hikes[hikeIndex],
      ...updates,
    };
    
    hikes[hikeIndex] = updatedHike;
    
    // Save back to storage
    const saveSuccess = LocalStorageService.save(HIKES_STORAGE_KEY, hikes);
    if (!saveSuccess) {
      console.error('Failed to update hike to localStorage');
      return null;
    }
    
    return updatedHike;
  }
  
  /**
   * Delete a hike
   */
  static deleteHike(hikeId: string): boolean {
    if (!hikeId) {
      console.error('Invalid hike ID provided for deletion');
      return false;
    }
    
    const hikes = this.getAllHikes();
    const filteredHikes = hikes.filter(hike => hike.id !== hikeId);
    
    // If nothing was filtered out, the hike wasn't found
    if (filteredHikes.length === hikes.length) {
      console.error(`Hike with ID ${hikeId} not found for deletion`);
      return false;
    }
    
    // Save back to storage
    return LocalStorageService.save(HIKES_STORAGE_KEY, filteredHikes);
  }
  
  /**
   * Clear all hikes data (useful for testing/debugging)
   */
  static clearAllHikes(): boolean {
    return LocalStorageService.remove(HIKES_STORAGE_KEY);
  }
} 