/**
 * Centralized exports for all hooks
 * This allows importing from 'hooks' instead of individual files
 */

// Activity related hooks
export { useActivityDetection } from './useActivityDetection';
export { useGeolocation } from './useGeolocation';
export { useLocationName } from './useLocationName';
export { useWeather } from './useWeather';

// Hike related hooks
export { useHikeData } from './useHikeData';
export { useHikeRecorder } from './useHikeRecorder';
export { useHikeAnalysis } from './useHikeAnalysis';
export { useHikeUploader } from './useHikeUploader';
export { useWeeklyStats } from './useWeeklyStats';

// Pet related hooks
export { usePet } from './usePet';
export { usePets } from './usePets';
export { usePetData } from './usePetData';

// Trail related hooks
export { useTrails } from './useTrails';
export { useFavoriteTrails } from './useFavoriteTrails';

// Storage related hooks
export { useLocalStorage } from './useLocalStorage'; 