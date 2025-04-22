import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HikeRecord, GpsPoint, Pet } from '../types';
import HikeRecordingForm from '../components/hike/HikeRecordingForm';
import PageHeader from '../components/layout/PageHeader';
import { HikeStorageService } from '../services/HikeStorageService';

// Sample pet data for testing
const testPets: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 3,
    weight: 65,
    energyLevel: 'High',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=162&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Border Collie',
    age: 2,
    weight: 45,
    energyLevel: 'High'
  }
];

const TrackingTestPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [savedActivity, setSavedActivity] = useState<HikeRecord | null>(null);
  const navigate = useNavigate();
  
  const handleSubmit = async (data: { petId: string, notes?: string }, gpsData: GpsPoint[]) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Create a new HikeRecord from the data
      const hikeData: Omit<HikeRecord, 'id'> = {
        petId: data.petId,
        date: new Date().toISOString().split('T')[0],
        duration: 30, // mock duration
        distance: 2.5, // mock distance
        customTrailName: `Test Activity on ${new Date().toLocaleDateString()}`,
        notes: data.notes,
        weatherConditions: 'Sunny, 72°F',
        activityType: 'Hike',
        terrain: 'Flat',
        gpsData: gpsData,
      };
      
      // Save to storage service
      const newHike = HikeStorageService.saveHike(hikeData);
      
      console.log('Saved test activity:', newHike);
      setSavedActivity(newHike);
    } catch (error) {
      console.error('Error saving test activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const handleRecordAnother = () => {
    setSavedActivity(null);
  };

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader 
        title="Activity Tracking Test" 
        showBackButton
        backTo="/trails"
      />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        {savedActivity ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-emerald-600 dark:text-amber-400">Activity Saved!</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Distance</div>
                <div className="font-medium">{savedActivity.distance} miles</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
                <div className="font-medium">{savedActivity.duration} minutes</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Activity Type</div>
                <div className="font-medium">{savedActivity.activityType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Terrain</div>
                <div className="font-medium">{savedActivity.terrain}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Trail Name</div>
              <div className="font-medium">{savedActivity.customTrailName}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Weather</div>
              <div className="font-medium">{savedActivity.weatherConditions || 'No data'}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">GPS Data Points</div>
              <div className="font-medium">{savedActivity.gpsData.length} points</div>
            </div>
            
            <div className="flex flex-col space-y-3 mt-4">
              <button 
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                onClick={handleRecordAnother}
              >
                Record Another Activity
              </button>
              <button 
                className="py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition-colors"
                onClick={handleViewHistory}
              >
                View Activity History
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 mb-6 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <p>This is a test page for tracking functionality. Activities recorded here will be saved to your history.</p>
            </div>
            
            <HikeRecordingForm
              pets={testPets}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingTestPage; 