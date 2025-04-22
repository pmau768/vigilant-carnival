import { useState, useEffect, useCallback } from 'react';
import { GpsPoint } from '../types';
import { GPS_UPDATE_INTERVAL, MAX_GPS_POINTS } from '../config/constants';

interface GeolocationState {
  isLoading: boolean;
  error: string | null;
  currentLocation: { latitude: number; longitude: number } | null;
  elevation: number | null;
  gpsData: GpsPoint[];
  isRecording: boolean;
  distance: number;
  elevationGain: number;
  maxElevation: number | null;
  minElevation: number | null;
  startTime: number | null;
  elapsedTime: number;
  currentSpeed: number;
}

interface GeolocationActions {
  startRecording: () => void;
  stopRecording: () => void;
  resetTracking: () => void;
}

export function useGeolocation(): [GeolocationState, GeolocationActions] {
  const [state, setState] = useState<GeolocationState>({
    isLoading: false,
    error: null,
    currentLocation: null,
    elevation: null,
    gpsData: [],
    isRecording: false,
    distance: 0,
    elevationGain: 0,
    maxElevation: null,
    minElevation: null,
    startTime: null,
    elapsedTime: 0,
    currentSpeed: 0,
  });

  const [watchId, setWatchId] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Haversine formula to calculate distance between two coordinates
  const getDistanceFromLatLonInMiles = useCallback((
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const deg2rad = (deg: number): number => deg * (Math.PI / 180);
    
    const R = 3959; // Radius of the earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in miles
    return distance;
  }, []);

  // Calculate distance between all recorded GPS points
  const calculateTotalDistance = useCallback((points: GpsPoint[]): number => {
    let totalDistance = 0;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currPoint = points[i];
      
      totalDistance += getDistanceFromLatLonInMiles(
        prevPoint.latitude,
        prevPoint.longitude,
        currPoint.latitude,
        currPoint.longitude
      );
    }
    
    return totalDistance;
  }, [getDistanceFromLatLonInMiles]);

  // Get current position once on load
  useEffect(() => {
    if (navigator.geolocation && !state.currentLocation && !state.isLoading && !state.error) {
      setState(prev => ({ ...prev, isLoading: true }));
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState(prev => ({
            ...prev,
            isLoading: false,
            currentLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            elevation: position.coords.altitude !== null ? position.coords.altitude : null,
          }));
        },
        (error) => {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: `Error getting location: ${error.message}`,
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    }
  }, [state.currentLocation, state.isLoading, state.error]);

  // Start the timer when recording
  useEffect(() => {
    if (state.isRecording && state.startTime !== null) {
      const interval = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - (prev.startTime || 0)) / 1000),
        }));
      }, 1000);
      
      setTimerInterval(interval);
      
      return () => {
        if (interval) window.clearInterval(interval);
      };
    }
  }, [state.isRecording, state.startTime]);

  // Handle recording actions
  const startRecording = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }
    
    if (state.isRecording) return;
    
    setState(prev => ({
      ...prev,
      isRecording: true,
      startTime: Date.now(),
      gpsData: [],
      distance: 0,
      elevationGain: 0,
      maxElevation: null,
      minElevation: null,
      elapsedTime: 0,
      currentSpeed: 0,
      error: null,
    }));
    
    // Start watching position
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        
        const newPoint: GpsPoint = {
          timestamp: now,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          elevation: position.coords.altitude || 0,
        };
        
        setState(prev => {
          const updatedGpsData = [...prev.gpsData, newPoint].slice(-MAX_GPS_POINTS);
          const lastPoint = prev.gpsData[prev.gpsData.length - 1];
          
          // Calculate new distance
          let newDistance = prev.distance;
          let newSpeed = prev.currentSpeed;
          
          if (lastPoint) {
            const segmentDistance = getDistanceFromLatLonInMiles(
              lastPoint.latitude, 
              lastPoint.longitude,
              position.coords.latitude,
              position.coords.longitude
            );
            
            newDistance += segmentDistance;
            
            // Calculate current speed (miles per hour)
            const timeDiffHours = (now - lastPoint.timestamp) / 3600000; // Convert ms to hours
            if (timeDiffHours > 0) {
              newSpeed = segmentDistance / timeDiffHours;
            }
          } else {
            // First point
            newDistance = 0;
            newSpeed = 0;
          }
          
          // Update elevation stats
          let newElevationGain = prev.elevationGain;
          let newMaxElevation = prev.maxElevation;
          let newMinElevation = prev.minElevation;
          
          if (position.coords.altitude !== null) {
            const newElevation = position.coords.altitude;
            
            // Initial values if this is our first elevation reading
            if (newMaxElevation === null) newMaxElevation = newElevation;
            if (newMinElevation === null) newMinElevation = newElevation;
            
            // Update min/max values
            if (newElevation > newMaxElevation) newMaxElevation = newElevation;
            if (newElevation < newMinElevation) newMinElevation = newElevation;
            
            // Calculate elevation gain
            if (lastPoint && lastPoint.elevation && newElevation > lastPoint.elevation) {
              newElevationGain += (newElevation - lastPoint.elevation);
            }
          }
          
          return {
            ...prev,
            currentLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            elevation: position.coords.altitude !== null ? position.coords.altitude : prev.elevation,
            gpsData: updatedGpsData,
            distance: newDistance,
            currentSpeed: newSpeed,
            elevationGain: newElevationGain,
            maxElevation: newMaxElevation,
            minElevation: newMinElevation,
          };
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: `Error tracking location: ${error.message}`,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
    
    setWatchId(id);
  }, [state.isRecording, getDistanceFromLatLonInMiles]);

  const stopRecording = useCallback(() => {
    // Clear the watch
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    
    // Clear the timer
    if (timerInterval !== null) {
      window.clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setState(prev => ({
      ...prev,
      isRecording: false,
    }));
  }, [watchId, timerInterval]);

  const resetTracking = useCallback(() => {
    stopRecording();
    
    setState(prev => ({
      ...prev,
      gpsData: [],
      distance: 0,
      elevationGain: 0,
      maxElevation: null,
      minElevation: null,
      startTime: null,
      elapsedTime: 0,
      currentSpeed: 0,
    }));
  }, [stopRecording]);

  return [
    state,
    { startRecording, stopRecording, resetTracking }
  ];
}