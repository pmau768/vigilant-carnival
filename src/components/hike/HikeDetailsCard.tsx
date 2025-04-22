import React from 'react';
import { format } from 'date-fns';
import { Map, CalendarDays, Clock, Route, Thermometer, PawPrint, Activity, Mountain } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { HikeRecord, Pet } from '../../types';

interface HikeDetailsCardProps {
  hike: HikeRecord;
  pet: Pet;
  onRequestAnalysis: (hikeId: string) => void;
  isLoading?: boolean;
}

const HikeDetailsCard: React.FC<HikeDetailsCardProps> = ({
  hike,
  pet,
  onRequestAnalysis,
  isLoading = false,
}) => {
  const formattedDate = format(new Date(hike.date), 'MMMM d, yyyy');
  const trailName = hike.customTrailName || (hike.trailId ? 'Trail #' + hike.trailId : 'Unknown Trail');
  const paceMinutesPerMile = hike.distance > 0 ? Math.round(hike.duration / hike.distance) : 0;

  // Get the appropriate icon for the activity type
  const getActivityIcon = () => {
    switch(hike.activityType) {
      case 'Run':
        return <Activity className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />;
      case 'Walk':
        return <Route className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />;
      case 'Play':
        return <Wind className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />;
      case 'Hike':
      default:
        return <Map className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />;
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getActivityIcon()}
            <CardTitle>{trailName}</CardTitle>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Date</span>
            <span className="font-medium text-sm dark:text-white">{formattedDate}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Duration</span>
            <span className="font-medium text-sm dark:text-white">{Math.floor(hike.duration / 60)}h {hike.duration % 60}m</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <Route className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Distance</span>
            <span className="font-medium text-sm dark:text-white">{hike.distance.toFixed(2)} miles</span>
          </div>
        </div>
        
        {/* Additional stats row */}
        {(hike.terrain || hike.elevationGain || hike.activityType) && (
          <div className="grid grid-cols-3 gap-2">
            {hike.terrain && (
              <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                <Mountain className="h-3 w-3" />
                <span>{hike.terrain} terrain</span>
              </div>
            )}
            
            {hike.elevationGain && (
              <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                <TrendingUp className="h-3 w-3" />
                <span>+{hike.elevationGain} ft</span>
              </div>
            )}
            
            {hike.activityType && (
              <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
                <Activity className="h-3 w-3" />
                <span>{hike.activityType}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {pet.photo ? (
              <img 
                src={pet.photo} 
                alt={pet.name} 
                className="h-12 w-12 rounded-full object-cover" 
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-gray-700 flex items-center justify-center">
                <PawPrint className="h-6 w-6 text-emerald-600 dark:text-amber-500" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium dark:text-white">{pet.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{pet.breed}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-300">
            Pace: {paceMinutesPerMile} min/mile
          </div>
          
          {hike.weatherConditions && (
            <div className="bg-sky-100 dark:bg-sky-900/30 rounded-full px-3 py-1 text-xs font-medium text-sky-800 dark:text-sky-400 flex items-center">
              <Thermometer className="h-3 w-3 mr-1" />
              {hike.weatherConditions}
            </div>
          )}
        </div>
        
        {hike.notes && (
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
            <h4 className="text-sm font-medium mb-1 dark:text-white">Notes</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">{hike.notes}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="primary" 
          className="w-full"
          onClick={() => onRequestAnalysis(hike.id)}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Generate Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HikeDetailsCard;