import React from 'react';
import { Map, Route, Activity, Wind, Clock, TrendingUp, MapPin, Mountain, Thermometer } from 'lucide-react';
import { formatTime, formatDistance, formatPace } from '../../utils/format';
import { getActivityColorClasses } from '../../utils/activity';
import { ActivityType } from '../../types';

interface TrackingStatsProps {
  time: number;
  distance: number;
  pace: number | null;
  elevation: number | null;
  elevationGain: number;
  activityType: ActivityType;
  terrainType: string;
  locationName: string | null;
  weatherCondition: string | null;
  isRecording: boolean;
}

const TrackingStats: React.FC<TrackingStatsProps> = ({
  time,
  distance,
  pace,
  elevation,
  elevationGain,
  activityType,
  terrainType,
  locationName,
  weatherCondition,
  isRecording
}) => {
  // Get appropriate activity icon
  const getActivityIcon = () => {
    const { icon } = getActivityColorClasses(activityType, true);
    
    switch(activityType) {
      case 'Run':
        return <Activity className={`h-6 w-6 ${icon} mr-2`} />;
      case 'Walk':
        return <Route className={`h-6 w-6 ${icon} mr-2`} />;
      case 'Play':
        return <Wind className={`h-6 w-6 ${icon} mr-2`} />;
      case 'Hike':
      default:
        return <Map className={`h-6 w-6 ${icon} mr-2`} />;
    }
  };
  
  // Get the weather icon based on condition string
  const getWeatherIcon = () => {
    if (!weatherCondition) return null;
    
    const condition = weatherCondition.toLowerCase();
    
    if (condition.includes('rain')) {
      return <CloudRain className="h-4 w-4 text-blue-400 mr-1" />;
    } else if (condition.includes('cloud')) {
      return <Cloud className="h-4 w-4 text-gray-400 mr-1" />;
    } else if (condition.includes('sun') || condition.includes('clear')) {
      return <Sun className="h-4 w-4 text-yellow-400 mr-1" />;
    }
    
    return <Thermometer className="h-4 w-4 text-red-400 mr-1" />;
  };

  return (
    <div className="space-y-4">
      {isRecording && (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {getActivityIcon()}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Recording {activityType}
              </h2>
            </div>
            <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-md shadow">
              <span className="font-mono text-xl font-bold text-emerald-600 dark:text-amber-500">
                {formatTime(time)}
              </span>
            </div>
          </div>
          
          {/* Activity Location */}
          {locationName && (
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg flex items-center">
              <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
              <p className="text-emerald-800 dark:text-emerald-300 font-medium">{locationName}</p>
            </div>
          )}
          
          {/* Live Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Distance</div>
              <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatDistance(distance)} <span className="text-xs">mi</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Pace</div>
              <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {pace ? Math.round(pace) : '--'} <span className="text-xs">min/mi</span>
              </div>
            </div>
            
            {elevation !== null && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Elevation</div>
                <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(elevation)} <span className="text-xs">ft</span>
                </div>
              </div>
            )}
            
            {elevationGain > 0 && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>Elevation Gain</span>
                  </div>
                </div>
                <div className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(elevationGain)} <span className="text-xs">ft</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Additional Stats Pills */}
          <div className="flex flex-wrap gap-2">
            {weatherCondition && (
              <div className="flex items-center space-x-1 text-sm bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 px-3 py-1.5 rounded-full">
                {getWeatherIcon()}
                <span>{weatherCondition}</span>
              </div>
            )}
            
            {terrainType !== 'Unknown' && (
              <div className="flex items-center space-x-1 text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-full">
                <Mountain className="h-4 w-4 mr-1" />
                <span>{terrainType} terrain</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1 text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full">
              {getActivityIcon()}
              <span>Detected {activityType}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrackingStats;