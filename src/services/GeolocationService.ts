import { GpsPoint } from '../types';

/**
 * Service to handle geolocation operations
 */
export class GeolocationService {
  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Radius of the earth in miles
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in miles
    return distance;
  }
  
  /**
   * Convert degrees to radians
   */
  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  
  /**
   * Calculate total distance from an array of GPS points
   */
  static calculateTotalDistance(points: GpsPoint[]): number {
    let totalDistance = 0;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currPoint = points[i];
      
      totalDistance += this.calculateDistance(
        prevPoint.latitude,
        prevPoint.longitude,
        currPoint.latitude,
        currPoint.longitude
      );
    }
    
    return totalDistance;
  }
  
  /**
   * Calculate elevation gain from an array of GPS points
   */
  static calculateElevationGain(points: GpsPoint[]): number {
    let totalGain = 0;
    
    for (let i = 1; i < points.length; i++) {
      const prevElevation = points[i - 1].elevation || 0;
      const currElevation = points[i].elevation || 0;
      
      if (currElevation > prevElevation) {
        totalGain += (currElevation - prevElevation);
      }
    }
    
    return totalGain;
  }
  
  /**
   * Get max and min elevation from an array of GPS points
   */
  static getElevationBounds(points: GpsPoint[]): { min: number; max: number } {
    if (!points.length) return { min: 0, max: 0 };
    
    const elevations = points
      .map(point => point.elevation || 0)
      .filter(elevation => elevation > 0);
    
    if (!elevations.length) return { min: 0, max: 0 };
    
    return {
      min: Math.min(...elevations),
      max: Math.max(...elevations),
    };
  }
}