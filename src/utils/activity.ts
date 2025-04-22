import { ActivityType } from '../types';
import { ACTIVITY_TYPES } from '../config/constants';

interface ActivityColorInfo {
  text: string;
  bg: string;
  icon: string;
}

// Get the appropriate colors for an activity type based on theme mode
export function getActivityColorClasses(activityType: ActivityType | undefined, isDark: boolean = false): ActivityColorInfo {
  const type = activityType || 'Hike';
  
  switch(type) {
    case 'Run':
      return {
        text: isDark ? 'text-red-400' : 'text-red-600',
        bg: isDark ? 'bg-red-900/20' : 'bg-red-50',
        icon: isDark ? 'text-red-400' : 'text-red-500'
      };
    case 'Walk':
      return {
        text: isDark ? 'text-blue-400' : 'text-blue-600',
        bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
        icon: isDark ? 'text-blue-400' : 'text-blue-500'
      };
    case 'Play':
      return {
        text: isDark ? 'text-purple-400' : 'text-purple-600',
        bg: isDark ? 'bg-purple-900/20' : 'bg-purple-50', 
        icon: isDark ? 'text-purple-400' : 'text-purple-500'
      };
    case 'Hike':
    default:
      return {
        text: isDark ? 'text-emerald-400' : 'text-emerald-600',
        bg: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50',
        icon: isDark ? 'text-emerald-400' : 'text-emerald-600'
      };
  }
}

// Calculate the calorie burn for a pet based on their weight, activity type, and distance
export function calculatePetCalorieBurn(
  petWeight: number,
  energyLevel: 'Low' | 'Medium' | 'High',
  distance: number,
  activityType: ActivityType
): { min: number; max: number } {
  // Base calories burned per pound per mile (varies by activity type)
  let caloriesPerPoundPerMile = 0;
  
  switch(activityType) {
    case 'Run':
      caloriesPerPoundPerMile = 0.8;
      break;
    case 'Hike':
      caloriesPerPoundPerMile = 0.6;
      break;
    case 'Walk':
      caloriesPerPoundPerMile = 0.4;
      break;
    case 'Play':
      caloriesPerPoundPerMile = 0.5;
      break;
    default:
      caloriesPerPoundPerMile = 0.5;
  }
  
  // Energy level multiplier
  const energyMultiplier = 
    energyLevel === 'High' ? 1.2 :
    energyLevel === 'Medium' ? 1.0 :
    0.8;
  
  const baseBurn = petWeight * caloriesPerPoundPerMile * distance * energyMultiplier;
  
  // Add some variability for the range
  const min = Math.round(baseBurn * 0.9);
  const max = Math.round(baseBurn * 1.1);
  
  return { min, max };
}

// Detect the activity type based on speed
export function detectActivityType(speedMph: number): ActivityType {
  if (speedMph < 0.1) return 'Play'; // Almost stationary
  if (speedMph < 2.5) return 'Walk';
  if (speedMph < 5) return 'Hike';
  return 'Run';
}