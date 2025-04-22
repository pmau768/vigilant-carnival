import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrailSuggestionForm from '../components/trail/TrailSuggestionForm';
import TrailCard from '../components/trail/TrailCard';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { TrailSuggestion } from '../types';

const TrailsPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState<TrailSuggestion[]>([]);
  const [formVisible, setFormVisible] = useState(true);
  const navigate = useNavigate();

  const handleSuggestionsReceived = (trailSuggestions: TrailSuggestion[]) => {
    setSuggestions(trailSuggestions);
    setFormVisible(false);
  };

  const handleSelectTrail = (trail: TrailSuggestion) => {
    // In a real app, this would navigate to a trail details page
    console.log('Selected trail:', trail);
    alert(`Selected trail: ${trail.name}`);
  };

  const handleReset = () => {
    setSuggestions([]);
    setFormVisible(true);
  };

  // Mock data for preview purposes - would be replaced by API response
  const mockSuggestions: TrailSuggestion[] = [
    {
      id: '1',
      name: 'Riverfront Trail',
      location: 'Portland, OR',
      difficulty: 'Easy',
      length: 2.5,
      description: 'A gentle path along the Willamette River with plenty of shade and water access points for dogs to cool off. Perfect for a Border Collie that needs moderate exercise without too much strain.',
      petFriendlyFeatures: ['Water Access', 'Shaded Areas', 'Flat Terrain', 'Dog-Friendly'],
      imageUrl: 'https://images.pexels.com/photos/3806750/pexels-photo-3806750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '2',
      name: 'Forest Park Loop',
      location: 'Portland, OR',
      difficulty: 'Moderate',
      length: 4.2,
      description: 'This trail offers a mix of terrain with some elevation changes that will give your Border Collie a good workout. The forest environment offers mental stimulation with various scents and wildlife to observe.',
      petFriendlyFeatures: ['Wildlife Viewing', 'Off-leash Areas', 'Natural Obstacles', 'Bird Watching'],
      imageUrl: 'https://images.pexels.com/photos/163703/woods-landscape-road-forest-163703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '3',
      name: 'Mt. Tabor Summit',
      location: 'Portland, OR',
      difficulty: 'Hard',
      length: 3.0,
      description: 'A more challenging trail with significant elevation gain that will help burn off your Border Collie\'s abundant energy. Multiple interconnected paths allow for varied routes and extended adventures.',
      petFriendlyFeatures: ['Elevation Gain', 'Multiple Routes', 'Dog Waste Stations', 'Panoramic Views'],
      imageUrl: 'https://images.pexels.com/photos/163692/forest-trees-fog-eerie-163692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader 
        title="Find Trails" 
        showBackButton 
        backTo="/adventures"
        rightContent={
          !formVisible && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              New Search
            </Button>
          )
        }
      />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        {formVisible ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:border dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Find the Perfect Trail</h2>
            <TrailSuggestionForm onSuggestionsReceived={handleSuggestionsReceived} />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              We'll analyze your dog's breed characteristics and find trails that match their exercise
              needs, terrain preferences, and other factors.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Suggested Trails
            </h2>

            <div className="space-y-4">
              {/* For demo purposes, we'll use mock data instead of actual API data */}
              {(suggestions.length > 0 ? suggestions : mockSuggestions).map((trail) => (
                <TrailCard
                  key={trail.id}
                  trail={trail}
                  onSelectTrail={handleSelectTrail}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrailsPage;