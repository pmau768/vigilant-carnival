import { useState, useEffect, useCallback } from 'react';
import { ActivityType } from '../types';

interface ActivityDetectionOptions {
  speed: number;          // Current speed in mph
  elevation?: number;     // Current elevation in feet
  elevationGain?: number; // Accumulated elevation gain in feet
}

export function useActivityDetection(options: ActivityDetectionOptions) {
  const [detectedActivity, setDetectedActivity] = useState<ActivityType>('Hike');
  const [terrainType, setTerrainType] = useState<string>('Unknown');
  
  // Detect activity type based on speed
  const detectActivityType = useCallback((speed: number): ActivityType => {
    if (speed < 0.1) return 'Play'; // Almost stationary
    if (speed < 2.5) return 'Walk';
    if (speed < 5) return 'Hike';
    return 'Run';
  }, []);
  
  // Update detected activity whenever speed changes
  useEffect(() => {
    const activity = detectActivityType(options.speed);
    setDetectedActivity(activity);
  }, [options.speed, detectActivityType]);
  
  // Update terrain type based on elevation gain data
  useEffect(() => {
    if (!options.elevationGain) return;
    
    if (options.elevationGain > 500) {
      setTerrainType('Mountainous');
    } else if (options.elevationGain > 200) {
      setTerrainType('Hilly');
    } else {
      setTerrainType('Flat');
    }
  }, [options.elevationGain]);
  
  return { detectedActivity, terrainType };
}