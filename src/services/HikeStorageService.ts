import { HikeRecord } from '../types';
import { LocalStorageService } from './LocalStorageService';

const HIKES_STORAGE_KEY = 'pawtrails_hikes';

export class HikeStorageService {
  /**
   * Save a new hike record
   */
  static saveHike(hike: Omit<HikeRecord, 'id'>): HikeRecord {
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
    LocalStorageService.save(HIKES_STORAGE_KEY, hikes);
    
    return newHike;
  }
  
  /**
   * Get all hikes
   */
  static getAllHikes(): HikeRecord[] {
    return LocalStorageService.get<HikeRecord[]>(HIKES_STORAGE_KEY, []);
  }
  
  /**
   * Get hikes for a specific pet
   */
  static getHikesForPet(petId: string): HikeRecord[] {
    const hikes = this.getAllHikes();
    return hikes.filter(hike => hike.petId === petId);
  }
  
  /**
   * Get a specific hike by ID
   */
  static getHikeById(hikeId: string): HikeRecord | undefined {
    const hikes = this.getAllHikes();
    return hikes.find(hike => hike.id === hikeId);
  }
  
  /**
   * Update an existing hike
   */
  static updateHike(hikeId: string, updates: Partial<HikeRecord>): HikeRecord | null {
    const hikes = this.getAllHikes();
    const hikeIndex = hikes.findIndex(hike => hike.id === hikeId);
    
    if (hikeIndex === -1) {
      return null;
    }
    
    // Update the hike
    const updatedHike = {
      ...hikes[hikeIndex],
      ...updates,
    };
    
    hikes[hikeIndex] = updatedHike;
    
    // Save back to storage
    LocalStorageService.save(HIKES_STORAGE_KEY, hikes);
    
    return updatedHike;
  }
  
  /**
   * Delete a hike
   */
  static deleteHike(hikeId: string): boolean {
    const hikes = this.getAllHikes();
    const filteredHikes = hikes.filter(hike => hike.id !== hikeId);
    
    // If nothing was filtered out, the hike wasn't found
    if (filteredHikes.length === hikes.length) {
      return false;
    }
    
    // Save back to storage
    LocalStorageService.save(HIKES_STORAGE_KEY, filteredHikes);
    
    return true;
  }
} 