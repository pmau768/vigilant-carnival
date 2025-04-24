import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Map, ChevronRight, PawPrint, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import TrailSuggestionForm from '../components/trail/TrailSuggestionForm';
import TrailCard from '../components/trail/TrailCard';
import HikeRecordingForm from '../components/hike/HikeRecordingForm';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';

import { TrailSuggestion, GpsPoint, Pet, HikeRecord } from '../types';
import { getPets } from '../utils/api';

enum Step {
  FIND_TRAIL,
  SELECT_TRAIL,
  RECORD_ACTIVITY
}

const IntegratedTrailsAndRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(Step.FIND_TRAIL);
  const [suggestions, setSuggestions] = useState<TrailSuggestion[]>([]);
  const [selectedTrail, setSelectedTrail] = useState<TrailSuggestion | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock pets data for testing
  const mockPets: Pet[] = [
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
  
  useEffect(() => {
    // In a real app, this would fetch pets from the API
    // const loadPets = async () => {
    //   try {
    //     const data = await getPets();
    //     setPets(data);
    //   } catch (error) {
    //     console.error('Error loading pets:', error);
    //     setPets(mockPets);
    //   }
    // };
    // loadPets();
    
    // For demo, just use mock data
    setPets(mockPets);
  }, []);
  
  const handleSuggestionsReceived = (trailSuggestions: TrailSuggestion[]) => {
    setSuggestions(trailSuggestions);
    setCurrentStep(Step.SELECT_TRAIL);
  };
  
  const handleSelectTrail = (trail: TrailSuggestion) => {
    setSelectedTrail(trail);
    setCurrentStep(Step.RECORD_ACTIVITY);
  };
  
  const handleBack = () => {
    if (currentStep === Step.SELECT_TRAIL) {
      setCurrentStep(Step.FIND_TRAIL);
    } else if (currentStep === Step.RECORD_ACTIVITY) {
      setCurrentStep(Step.SELECT_TRAIL);
    }
  };
  
  const handleRecordSubmit = async (data: any, gpsData: GpsPoint[]) => {
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
      
      // Construct enhanced hike data with trail info
      const hikeData: Omit<HikeRecord, 'id'> = {
        ...data,
        gpsData,
        elevationGain: elevationGain || undefined,
        minElevation: minElevation || undefined,
        maxElevation: maxElevation || undefined,
        trailId: selectedTrail?.id,
        customTrailName: selectedTrail?.name || data.customTrailName,
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

  const getPageTitle = () => {
    switch (currentStep) {
      case Step.FIND_TRAIL:
        return 'Find Trails';
      case Step.SELECT_TRAIL:
        return 'Suggested Trails';
      case Step.RECORD_ACTIVITY:
        return `Record Activity at ${selectedTrail?.name || 'Trail'}`;
      default:
        return 'Record Activity';
    }
  };

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader 
        title={getPageTitle()} 
        showBackButton={currentStep !== Step.FIND_TRAIL}
        onBack={handleBack}
      />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        {currentStep === Step.FIND_TRAIL && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:border dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Find the Perfect Trail</h2>
            <TrailSuggestionForm onSuggestionsReceived={handleSuggestionsReceived} />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              We'll analyze your dog's breed characteristics and find trails that match their exercise
              needs, terrain preferences, and other factors.
            </p>
          </div>
        )}
        
        {currentStep === Step.SELECT_TRAIL && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Suggested Trails
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
              >
                New Search
              </Button>
            </div>

            <div className="space-y-4">
              {suggestions.map((trail) => (
                <motion.div 
                  key={trail.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TrailCard
                    trail={trail}
                    onSelectTrail={handleSelectTrail}
                  />
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(Step.RECORD_ACTIVITY)}
              >
                Skip Trail Selection
              </Button>
            </div>
          </>
        )}
        
        {currentStep === Step.RECORD_ACTIVITY && (
          <>
            {selectedTrail && (
              <Card className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-emerald-900 dark:text-emerald-300">
                      {selectedTrail.name}
                    </h3>
                    <p className="text-sm text-emerald-800 dark:text-emerald-400">
                      {selectedTrail.difficulty} • {selectedTrail.length} miles • {selectedTrail.location}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          
            <HikeRecordingForm
              pets={pets}
              onSubmit={handleRecordSubmit}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default IntegratedTrailsAndRecordPage; 