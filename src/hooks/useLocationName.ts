import { useState, useEffect } from 'react';
import { MOCK_LOCATIONS } from '../config/constants';

export function useLocationName(latitude?: number, longitude?: number) {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) return;
    
    const fetchLocationName = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would call a reverse geocoding API
        // const response = await reverseGeocode(latitude, longitude);
        // setLocationName(response.locationName);
        
        // For demo purposes, generate a random location name
        const types = MOCK_LOCATIONS.TYPES;
        const adjectives = MOCK_LOCATIONS.ADJECTIVES;
        
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        setLocationName(`${randomAdjective} ${randomType}`);
      } catch (err) {
        console.error('Error fetching location name:', err);
        setError('Could not fetch location name');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLocationName();
  }, [latitude, longitude]);
  
  return { locationName, isLoading, error };
}