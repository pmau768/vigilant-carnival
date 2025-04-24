import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapPin } from 'lucide-react';
import HikeRecordingForm from '../components/hike/HikeRecordingForm';
import PageHeader from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Pet, HikeRecord, GpsPoint } from '../types';
import { getPets } from '../utils/api';
import { HikeStorageService } from '../services/HikeStorageService';
import { LocalStorageService } from '../services/LocalStorageService';

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '_test_key_';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const RecordHikePage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse URL search params
  const searchParams = new URLSearchParams(location.search);
  const trailId = searchParams.get('trailId');
  const trailName = searchParams.get('trailName');
  
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
    // Check localStorage availability
    setStorageAvailable(isLocalStorageAvailable());
    
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
    
    if (!storageAvailable) {
      toast.error('LocalStorage is not available. Activity cannot be saved.');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Starting activity recording process...');
      
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
      
      // Validate form data
      if (!data.petId) {
        throw new Error('Pet selection is required');
      }
      
      // Construct enhanced hike data
      const hikeData: Omit<HikeRecord, 'id'> = {
        ...data,
        gpsData: gpsData || [],
        trailId: trailId || undefined,
        customTrailName: trailName || data.customTrailName,
        elevationGain: elevationGain || undefined,
        minElevation: minElevation || undefined,
        maxElevation: maxElevation || undefined,
        date: new Date().toISOString().split('T')[0], // Ensure date is set
      };
      
      console.log('Prepared hike data for saving:', hikeData);
      
      // Check existing data
      const existingHikes = HikeStorageService.getAllHikes();
      console.log('Current stored hikes count:', existingHikes.length);
      
      // Save the hike using our storage service
      const newHike = HikeStorageService.saveHike(hikeData);
      console.log('Recorded activity with data:', newHike);
      
      // Verify the save worked by trying to retrieve it
      const savedHike = HikeStorageService.getHikeById(newHike.id);
      if (!savedHike) {
        console.error('Failed to verify saved hike - could not retrieve by ID');
        throw new Error('Activity was not properly saved to storage');
      }
      
      console.log('Successfully verified saved hike:', savedHike);
      
      toast.success(`${data.activityType || 'Activity'} recorded successfully!`);
      
      // After saving, redirect to history or analysis page
      navigate(`/analysis/${newHike.id}`);
    } catch (error) {
      console.error('Error recording activity:', error);
      toast.error(`Failed to record activity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader title="Track Activity" showBackButton backTo="/trails" />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        {!storageAvailable && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p><strong>Warning:</strong> LocalStorage is not available in your browser. Activities cannot be saved.</p>
            <p className="text-sm mt-1">This could be due to privacy settings, private browsing mode, or storage quota limits.</p>
          </div>
        )}
      
        {trailName && (
          <Card className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-emerald-900 dark:text-emerald-300">
                  {trailName}
                </h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-400">
                  Recording activity on this trail
                </p>
              </div>
            </div>
          </Card>
        )}
        
        {pets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center dark:border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Pets Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to create a pet profile before tracking an activity.
            </p>
            <button
              onClick={() => navigate('/profile')}
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
            defaultTrailName={trailName || undefined}
          />
        )}
      </div>
    </div>
  );
};

export default RecordHikePage;