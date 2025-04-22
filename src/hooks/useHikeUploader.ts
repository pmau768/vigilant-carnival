import { useState } from 'react';
import { recordHike } from '../utils/api';
import { GPSPoint } from './useHikeRecorder';
import { GpsPoint } from '../types';

export function useHikeUploader() {
  const [hikeId, setHikeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (petId: string, points: GPSPoint[]) => {
    try {
      setLoading(true);
      
      // Convert to the format expected by the API
      const gpsData: GpsPoint[] = points.map(point => ({
        timestamp: point.ts,
        latitude: point.lat,
        longitude: point.lon,
        elevation: 0 // Placeholder for elevation data
      }));
      
      // Create a hike record
      const newHike = await recordHike({
        petId,
        date: new Date().toISOString(),
        duration: Math.round((points[points.length - 1]?.ts - points[0]?.ts) || 0), // in minutes
        distance: calculateDistance(points), // calculate distance from GPS points
        gpsData,
        weatherConditions: 'Unknown', // This could be fetched with a weather API
        activityType: 'Hike'
      });
      
      setHikeId(newHike.id);
      setError(null);
      return newHike.id;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { hikeId, loading, error, upload };
}

// Helper function to calculate distance from GPS points
function calculateDistance(points: GPSPoint[]): number {
  if (points.length < 2) return 0;
  
  let distance = 0;
  for (let i = 1; i < points.length; i++) {
    distance += haversineDistance(
      points[i-1].lat, points[i-1].lon,
      points[i].lat, points[i].lon
    );
  }
  
  // Return distance in miles
  return distance;
}

// Calculate distance between two points using Haversine formula
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
} 