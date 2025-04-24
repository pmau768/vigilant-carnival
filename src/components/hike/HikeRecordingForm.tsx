import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Map, AlertTriangle, PawPrint, MapPin } from 'lucide-react';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { Pet, GpsPoint, ActivityType } from '../../types';

// Import custom hooks
import { useGeolocation } from '../../hooks/useGeolocation';
import { useActivityDetection } from '../../hooks/useActivityDetection';
import { useWeather } from '../../hooks/useWeather';
import { useLocationName } from '../../hooks/useLocationName';
import TrackingStats from './TrackingStats';

const formSchema = z.object({
  petId: z.string().min(1, 'Pet is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface HikeRecordingFormProps {
  pets: Pet[];
  onSubmit: (data: FormData, gpsData: GpsPoint[]) => void;
  isLoading: boolean;
  defaultTrailName?: string;
}

const HikeRecordingForm: React.FC<HikeRecordingFormProps> = ({ pets, onSubmit, isLoading, defaultTrailName }) => {
  // Use the geolocation hook to handle location tracking
  const [
    {
      isLoading: isLoadingLocation,
      error: locationError,
      currentLocation,
      elevation,
      gpsData,
      isRecording,
      distance,
      elevationGain,
      maxElevation,
      minElevation,
      elapsedTime,
      currentSpeed,
    },
    { startRecording, stopRecording, resetTracking }
  ] = useGeolocation();
  
  // Calculate pace (minutes per mile)
  const [averagePace, setAveragePace] = useState<number | null>(null);
  
  // Use weather hook to get current weather
  const { weather: currentWeather } = useWeather(
    currentLocation?.latitude,
    currentLocation?.longitude
  );
  
  // Use location name hook to get location name
  const { locationName } = useLocationName(
    currentLocation?.latitude,
    currentLocation?.longitude
  );
  
  // Use activity detection hook
  const { detectedActivity, terrainType } = useActivityDetection({
    speed: currentSpeed,
    elevation: elevation || undefined,
    elevationGain: elevationGain,
  });
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petId: '',
      notes: '',
    },
  });

  const selectedPetId = watch('petId');
  const selectedPet = pets.find(pet => pet.id === selectedPetId);
  
  // Calculate average pace whenever distance or time updates
  useEffect(() => {
    if (distance > 0 && elapsedTime > 0) {
      const paceMinutes = (elapsedTime / 60) / distance; // minutes per mile
      setAveragePace(paceMinutes);
    }
  }, [distance, elapsedTime]);
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (!selectedPetId) {
        alert('Please select a pet before starting recording');
        return;
      }
      resetTracking();
      startRecording();
    }
  };
  
  const handleFormSubmit = (data: FormData) => {
    // Automatically generate activity data
    const hikeData = {
      petId: data.petId,
      date: new Date().toISOString().split('T')[0],
      duration: Math.floor(elapsedTime / 60), // convert seconds to minutes
      distance: parseFloat(distance.toFixed(2)),
      customTrailName: defaultTrailName || locationName || `Activity on ${new Date().toLocaleDateString()}`,
      notes: data.notes || '',
      weatherConditions: currentWeather || undefined,
      activityType: detectedActivity,
      terrain: terrainType as any,
      elevationGain: elevationGain > 0 ? Math.round(elevationGain) : undefined,
      maxElevation: maxElevation ? Math.round(maxElevation) : undefined,
      minElevation: minElevation ? Math.round(minElevation) : undefined,
    };
    
    onSubmit(hikeData, gpsData);
    resetTracking();
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Pet Selection Card */}
      <Card className="p-6 dark:border dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <PawPrint className="h-6 w-6 text-emerald-600 dark:text-amber-500 mr-2" />
          Choose Your Pet
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="petId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Which pet are you taking?
            </label>
            <select
              id="petId"
              {...register('petId')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 focus:border-emerald-500 dark:focus:border-amber-500 dark:bg-gray-700 dark:text-white text-lg"
              disabled={isRecording || isLoading}
            >
              <option value="">Select a pet</option>
              {pets.map(pet => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.breed})
                </option>
              ))}
            </select>
            {errors.petId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.petId.message}</p>
            )}
          </div>
          
          {selectedPet && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 dark:border dark:border-blue-800 mt-3">
              <div className="flex items-center">
                {selectedPet.photo ? (
                  <img 
                    src={selectedPet.photo} 
                    alt={selectedPet.name}
                    className="w-12 h-12 rounded-full mr-3 object-cover" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <PawPrint className="h-6 w-6 text-emerald-600 dark:text-amber-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300">{selectedPet.name}</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {selectedPet.breed} • {selectedPet.age} yr • {selectedPet.energyLevel} Energy
                  </p>
                </div>
              </div>
              {currentLocation && (
                <div className="mt-3 text-sm text-blue-700 dark:text-blue-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Location ready for tracking</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
      
      {/* Recording Card */}
      <Card className="p-6 dark:border dark:border-gray-700">
        {isRecording ? (
          <div className="space-y-6">
            <TrackingStats
              time={elapsedTime}
              distance={distance}
              pace={averagePace}
              elevation={elevation}
              elevationGain={elevationGain}
              activityType={detectedActivity}
              terrainType={terrainType}
              locationName={locationName}
              weatherCondition={currentWeather}
              isRecording={isRecording}
            />
            
            {/* Notes field */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Add Notes (Optional)
              </label>
              <textarea
                id="notes"
                {...register('notes')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 focus:border-emerald-500 dark:focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                placeholder="How is your pet doing? Any observations?"
                rows={2}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-6">
            <div className="mb-4">
              {isLoadingLocation ? (
                <div className="animate-pulse flex flex-col items-center">
                  <MapPin className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Getting Your Location...</h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    We're preparing to track your activity
                  </p>
                </div>
              ) : selectedPetId ? (
                <>
                  <Map className="h-16 w-16 text-emerald-600 dark:text-amber-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Ready to Start</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Press the button below to begin tracking your activity with {selectedPet?.name}
                  </p>
                </>
              ) : (
                <>
                  <PawPrint className="h-16 w-16 text-emerald-600 dark:text-amber-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Select Your Pet</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose which pet you're taking with you before starting your activity
                  </p>
                </>
              )}
            </div>
            
            {locationError && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4 w-full flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{locationError}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 flex flex-col">
          <Button
            type="button"
            variant={isRecording ? 'outline' : 'primary'}
            size="lg"
            onClick={toggleRecording}
            className={`${isRecording ? 'border-red-500 text-red-600 dark:border-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' : ''} py-4`}
            disabled={!selectedPetId || isLoading || isLoadingLocation}
          >
            {isRecording ? 'Stop Recording' : 'Start Tracking'}
          </Button>
          
          {isRecording && (
            <Button 
              onClick={handleSubmit(handleFormSubmit)}
              variant="primary"
              className="mt-4"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading || elapsedTime < 10}
            >
              Save Activity
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HikeRecordingForm;