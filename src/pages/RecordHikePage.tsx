import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HikeRecordingForm from '../components/hike/HikeRecordingForm';
import PageHeader from '../components/layout/PageHeader';
import { Pet, HikeRecord, GpsPoint } from '../types';
import { getPets, recordHike } from '../utils/api';

const RecordHikePage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Mock data for preview purposes
  const mockPets: Pet[] = [
    {
      id: '1',
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: 4,
      weight: 65,
      energyLevel: 'High',
      healthIssues: ['Mild Hip Dysplasia'],
      photo: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '2',
      name: 'Luna',
      breed: 'Border Collie',
      age: 3,
      weight: 45,
      energyLevel: 'High',
      photo: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '3',
      name: 'Max',
      breed: 'Labrador',
      age: 7,
      weight: 75,
      energyLevel: 'Medium',
      healthIssues: ['Arthritis', 'Allergies'],
      photo: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];
  
  useEffect(() => {
    // In a real app, this would fetch pets from the API
    // loadPets();
    setPets(mockPets);
  }, []);
  
  const loadPets = async () => {
    setIsLoading(true);
    try {
      const fetchedPets = await getPets();
      setPets(fetchedPets);
    } catch (error) {
      console.error('Error loading pets:', error);
      // Use mock data as fallback
      setPets(mockPets);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (data: any, gpsData: GpsPoint[]) => {
    setIsLoading(true);
    try {
      // Extract additional metrics
      const elevationPoints = gpsData.filter(point => point.elevation !== undefined);
      let elevationGain = 0;
      let minElevation = null;
      let maxElevation = null;
      
      if (elevationPoints.length > 1) {
        for (let i = 1; i < elevationPoints.length; i++) {
          const prev = elevationPoints[i-1].elevation || 0;
          const curr = elevationPoints[i].elevation || 0;
          if (curr > prev) {
            elevationGain += (curr - prev);
          }
        }
        
        const allElevations = elevationPoints.map(p => p.elevation || 0);
        minElevation = Math.min(...allElevations);
        maxElevation = Math.max(...allElevations);
      }
      
      // Construct enhanced hike data
      const hikeData: Omit<HikeRecord, 'id'> = {
        ...data,
        gpsData,
        elevationGain: elevationGain || undefined,
        minElevation: minElevation || undefined,
        maxElevation: maxElevation || undefined,
      };
      
      // In a real app, this would record a hike in the API
      // const newHike = await recordHike(hikeData);
      
      // For demo purposes, just simulate success
      console.log('Recording activity with data:', hikeData);
      
      toast.success(`${data.activityType || 'Activity'} recorded successfully!`);
      
      // After saving, redirect to history or analysis page
      const mockId = Date.now().toString();
      navigate(`/analysis/${mockId}`);
    } catch (error) {
      console.error('Error recording activity:', error);
      toast.error('Failed to record activity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader title="Track Activity" showBackButton backTo="/adventures" />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        {pets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center dark:border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Pets Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to create a pet profile before tracking an activity.
            </p>
            <button
              onClick={() => navigate('/pets')}
              className="bg-emerald-600 dark:bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 dark:hover:bg-amber-600 transition-colors"
            >
              Create Pet Profile
            </button>
          </div>
        ) : (
          <HikeRecordingForm
            pets={pets}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default RecordHikePage;