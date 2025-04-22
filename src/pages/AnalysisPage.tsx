import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import HikeDetailsCard from '../components/hike/HikeDetailsCard';
import HikeAnalysisCard from '../components/hike/HikeAnalysisCard';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { HikeRecord, Pet, HikeAnalysis } from '../types';
import { getPet } from '../utils/api';
import { HikeStorageService } from '../services/HikeStorageService';

// Mock data for simple pet info
const mockPets: Record<string, Pet> = {
  '1': {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 4,
    weight: 65,
    energyLevel: 'High',
    healthIssues: ['Mild Hip Dysplasia'],
    photo: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  '2': {
    id: '2',
    name: 'Luna',
    breed: 'Border Collie',
    age: 3,
    weight: 45,
    energyLevel: 'High',
    photo: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  }
};

const AnalysisPage: React.FC = () => {
  const { hikeId } = useParams<{ hikeId: string }>();
  const navigate = useNavigate();
  
  const [hike, setHike] = useState<HikeRecord | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [analysis, setAnalysis] = useState<HikeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate dynamic analysis based on the pet's breed, weight, and the hike details
  const generateCustomAnalysis = (hike: HikeRecord, pet: Pet): HikeAnalysis => {
    const breedSpecificInsight = pet.breed === 'Golden Retriever' 
      ? 'As a Golden Retriever, Buddy has a natural affinity for water and enjoyed the creek encounters.'
      : `As a ${pet.breed}, ${pet.name} performed well on this ${hike.terrain?.toLowerCase() || 'varied'} terrain.`;
    
    const healthInsight = pet.healthIssues?.includes('Mild Hip Dysplasia')
      ? `Given Buddy's mild hip dysplasia, the ${hike.terrain?.toLowerCase() || 'moderate'} terrain of ${hike.customTrailName} was a good choice. The soft forest floor likely provided some cushioning for his joints. Watch for any limping or discomfort in his back legs in the 24 hours following the hike. Consider a post-hike joint supplement to support recovery.`
      : `No specific health issues noted for ${pet.name}, but always monitor for signs of fatigue or discomfort after activities of this intensity.`;
    
    const caloriesPerPound = pet.energyLevel === 'High' ? 8 : (pet.energyLevel === 'Medium' ? 6 : 4);
    const estimatedCalories = Math.round(pet.weight * caloriesPerPound * (hike.distance / 3));
    
    const elevationInsight = hike.elevationGain && hike.elevationGain > 200
      ? `The significant elevation gain (${hike.elevationGain} ft) provided excellent cardiovascular exercise for ${pet.name}.`
      : `The relatively flat terrain was appropriate for ${pet.name}'s activity level.`;
    
    return {
      id: Date.now().toString(),
      hikeId: hike.id,
      petId: pet.id,
      overview: `${pet.name} had a great ${hike.duration}-minute ${hike.activityType?.toLowerCase() || 'hike'} covering ${hike.distance} miles on the ${hike.customTrailName} trail. The weather was ${hike.weatherConditions?.toLowerCase() || 'ideal'}, providing comfortable conditions for a ${pet.breed}. ${breedSpecificInsight} The pace was moderate at about ${Math.round(hike.duration / hike.distance)} minutes per mile, which is appropriate for a trail with ${hike.terrain === 'Flat' ? 'minimal' : 'some'} elevation changes.`,
      pawHealthInsights: healthInsight,
      restStopRecommendations: `For a ${pet.breed} like ${pet.name} on a trail of this length, ${Math.ceil(hike.distance/1.5)}-${Math.ceil(hike.distance)} rest stops would be ideal. Given the ${hike.weatherConditions?.includes('Sunny') ? 'sunny' : 'current'} conditions, ensure water breaks every 30 minutes to prevent dehydration. ${hike.notes?.includes('creek') ? 'The creek mentioned in your notes provided a perfect natural rest stop for cooling down.' : ''}`,
      futureSuggestions: `Based on ${pet.name}'s performance on this ${hike.difficulty || 'moderate'} ${hike.activityType?.toLowerCase() || 'hike'}, you could gradually increase distance to ${(hike.distance * 1.2).toFixed(1)}-${(hike.distance * 1.5).toFixed(1)} miles on similar terrain. ${pet.healthIssues?.length ? 'Considering the health issues, continue to favor trails with natural surfaces rather than paved paths.' : 'Mix up the terrain types to provide varied mental and physical stimulation.'}`,
      energyExpenditureEstimate: `This ${hike.activityType?.toLowerCase() || 'hike'} likely burned approximately ${estimatedCalories}-${estimatedCalories + 50} calories for ${pet.name}, which is about ${Math.round(estimatedCalories/(pet.weight * 30) * 100)}% of a ${pet.weight}lb ${pet.breed}'s daily energy needs. ${elevationInsight} ${pet.energyLevel === 'High' ? 'Given the high energy level, consider more challenging trails or longer distances in the future.' : 'This activity level seems well-matched to your pet\'s energy needs.'}`,
      timestamp: new Date().toISOString(),
    };
  };
  
  useEffect(() => {
    if (hikeId) {
      loadData();
    } else {
      // Display list of hikes if no ID is provided
      navigate('/history');
    }
  }, [hikeId, navigate]);
  
  const loadData = async () => {
    if (!hikeId) return;
    
    setIsLoading(true);
    try {
      // Load hike from local storage
      const hikeData = HikeStorageService.getHikeById(hikeId);
      
      if (hikeData) {
        setHike(hikeData);
        
        // For now, use mock pets data - in a real app we would fetch pet data from an API
        const petData = mockPets[hikeData.petId];
        if (petData) {
          setPet(petData);
        } else {
          toast.error('Pet data not found');
        }
      } else {
        toast.error('Hike not found');
        navigate('/history');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading hike data');
      navigate('/history');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRequestAnalysis = async (hikeId: string) => {
    setIsGenerating(true);
    try {
      // Generate a personalized analysis based on the pet's data and hike details
      if (hike && pet) {
        const customAnalysis = generateCustomAnalysis(hike, pet);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setAnalysis(customAnalysis);
        toast.success('Analysis generated successfully!');
      } else {
        toast.error('Missing hike or pet data');
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error('Failed to generate analysis. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleShare = () => {
    // In a real app, this would implement sharing functionality
    toast.info('Sharing functionality would be implemented here!');
  };

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <p>Loading hike data...</p>
      </div>
    );
  }

  if (!hike || !pet) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <p>Hike not found.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/history')}
        >
          Back to History
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader 
        title={`${hike.activityType || 'Hike'} Analysis`}
        showBackButton 
        backTo="/history"
      />
      
      <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
        <HikeDetailsCard
          hike={hike}
          pet={pet}
          onRequestAnalysis={handleRequestAnalysis}
          isLoading={isGenerating}
        />
        
        {analysis ? (
          <HikeAnalysisCard
            analysis={analysis}
            pet={pet}
            onShare={handleShare}
          />
        ) : null}
      </div>
    </div>
  );
};

export default AnalysisPage;