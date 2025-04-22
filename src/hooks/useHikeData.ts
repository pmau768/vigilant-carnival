import { useState, useEffect } from 'react';
import { HikeRecord } from '../types';
import { getHikes, getHike } from '../utils/api';

// Mock data for preview purposes
const mockHikes: HikeRecord[] = [
  {
    id: '1',
    petId: '1',
    customTrailName: 'Forest Park Loop',
    date: '2025-02-15',
    duration: 95, // in minutes
    distance: 3.2, // in miles
    gpsData: [],
    notes: 'Buddy loved the creek and forest smells! He seemed to have a lot of energy throughout the hike and was alert and attentive to surroundings.',
    weatherConditions: 'Sunny, 68°F',
    activityType: 'Hike',
    terrain: 'Hilly',
    elevationGain: 320,
    maxElevation: 890,
    minElevation: 570,
  },
  {
    id: '2',
    petId: '1',
    customTrailName: 'Waterfront Trail',
    date: '2025-02-10',
    duration: 30,
    distance: 1.2,
    gpsData: [],
    weatherConditions: 'Partly Cloudy, 55°F',
    activityType: 'Run',
    terrain: 'Flat',
  },
  {
    id: '3',
    petId: '2',
    customTrailName: 'Mountain View Trail',
    date: '2025-02-14',
    duration: 120,
    distance: 5.5,
    gpsData: [],
    notes: 'Luna did great on this challenging hike!',
    weatherConditions: 'Clear, 60°F',
    activityType: 'Hike',
    terrain: 'Mountainous',
    elevationGain: 850,
  },
  {
    id: '4',
    petId: '1',
    customTrailName: 'Neighborhood Walk',
    date: '2025-02-16',
    duration: 45,
    distance: 1.8,
    gpsData: [],
    weatherConditions: 'Cloudy, 62°F',
    activityType: 'Walk',
    terrain: 'Flat',
  },
  {
    id: '5',
    petId: '2',
    customTrailName: 'Dog Park Visit',
    date: '2025-02-13',
    duration: 60,
    distance: 0.5,
    gpsData: [],
    notes: 'Luna played with several other dogs and had a great time.',
    weatherConditions: 'Sunny, 65°F',
    activityType: 'Play',
    terrain: 'Flat',
  },
];

export function useAllHikes(petId?: string) {
  const [hikes, setHikes] = useState<HikeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHikes = async () => {
      try {
        // In a real app, this would fetch hikes from the API
        // const fetchedHikes = await getHikes(petId);
        // setHikes(fetchedHikes);
        
        // For demo purposes, use mock data filtered by petId if provided
        if (petId) {
          setHikes(mockHikes.filter(hike => hike.petId === petId));
        } else {
          setHikes(mockHikes);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading hikes:', err);
        setError('Failed to load hikes');
        
        // Use filtered mock data as fallback
        if (petId) {
          setHikes(mockHikes.filter(hike => hike.petId === petId));
        } else {
          setHikes(mockHikes);
        }
        
        setIsLoading(false);
      }
    };

    fetchHikes();
  }, [petId]);

  return { hikes, isLoading, error };
}

export function useHike(hikeId: string | undefined) {
  const [hike, setHike] = useState<HikeRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hikeId) {
      setIsLoading(false);
      return;
    }
    
    const fetchHike = async () => {
      try {
        // In a real app, this would fetch the hike from the API
        // const fetchedHike = await getHike(hikeId);
        // setHike(fetchedHike);
        
        // For demo purposes, find the hike in mock data
        const foundHike = mockHikes.find(h => h.id === hikeId);
        if (foundHike) {
          setHike(foundHike);
        } else {
          // If not found in mock data, use the first mock hike with the requested ID
          const mockHikeWithId = { ...mockHikes[0], id: hikeId };
          setHike(mockHikeWithId);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error(`Error loading hike ${hikeId}:`, err);
        setError('Failed to load hike');
        
        // Use mock data as fallback
        const mockHikeWithId = { ...mockHikes[0], id: hikeId };
        setHike(mockHikeWithId);
        setIsLoading(false);
      }
    };

    fetchHike();
  }, [hikeId]);

  return { hike, isLoading, error };
}