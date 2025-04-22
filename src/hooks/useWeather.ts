import { useState, useEffect } from 'react';
import { getCurrentWeather } from '../utils/api';
import { MOCK_WEATHER_CONDITIONS } from '../config/constants';

export function useWeather(latitude?: number, longitude?: number) {
  const [weather, setWeather] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) return;
    
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would call the actual API
        // const weatherData = await getCurrentWeather(latitude, longitude);
        // setWeather(weatherData);
        
        // For demo purposes, generate a random weather condition
        const randomIndex = Math.floor(Math.random() * MOCK_WEATHER_CONDITIONS.length);
        const randomWeather = MOCK_WEATHER_CONDITIONS[randomIndex];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setWeather(randomWeather);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Could not fetch weather data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWeather();
  }, [latitude, longitude]);
  
  return { weather, isLoading, error };
}