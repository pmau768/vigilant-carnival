import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Compass, PawPrint, Map, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import TrailCard from '../components/trail/TrailCard';
import { Pet, TrailSuggestion } from '../types';
import { motion } from 'framer-motion';

const AdventuresPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [suggestedTrails, setSuggestedTrails] = useState<TrailSuggestion[]>([]);
  const [nearbyTrails, setNearbyTrails] = useState<TrailSuggestion[]>([]);
  
  // Mock pet data
  const mockPet: Pet = {
    id: '1',
    name: 'Max',
    breed: 'Belgian Malinois',
    age: 5,
    weight: 65,
    energyLevel: 'High',
    photo: 'https://images.pexels.com/photos/2853422/pexels-photo-2853422.jpeg?auto=compress&cs=tinysrgb&w=1600',
    totalDistance: 45,
    totalHikes: 12
  };
  
  // Mock trail suggestions
  const mockTrailSuggestions: TrailSuggestion[] = [
    {
      id: '1',
      name: 'Canyon Edge Trail',
      location: 'Mountain National Park',
      difficulty: 'Hard',
      length: 4.8,
      description: 'Perfect for high-energy dogs like Belgian Malinois. This challenging trail offers varying terrain with steep sections that will help burn off excess energy. The trail is less crowded, giving your dog space to explore safely.',
      petFriendlyFeatures: ['Off-Leash Areas', 'Water Access', 'Challenging Terrain', 'Less Crowded'],
      imageUrl: 'https://images.pexels.com/photos/235725/pexels-photo-235725.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.8,
      reviews: 32
    },
    {
      id: '2',
      name: 'River Valley Loop',
      location: 'Riverside Park',
      difficulty: 'Moderate',
      length: 3.2,
      description: 'This trail follows a scenic river with multiple access points for your Belgian Malinois to cool off. The varied terrain includes forest and open meadows, providing mental stimulation and physical exercise.',
      petFriendlyFeatures: ['Swimming Spots', 'Varied Terrain', 'Wildlife Viewing', 'Waste Stations'],
      imageUrl: 'https://images.pexels.com/photos/910307/pexels-photo-910307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.5,
      reviews: 28
    }
  ];
  
  // Mock nearby trails
  const mockNearbyTrails: TrailSuggestion[] = [
    {
      id: '3',
      name: 'Lakeside Path',
      location: '1.5 miles away',
      difficulty: 'Easy',
      length: 2.2,
      description: 'A gentle path around the lake with multiple access points for dogs to cool off. Mostly flat terrain makes this suitable for all dogs.',
      petFriendlyFeatures: ['Water Access', 'Gentle Terrain', 'Dog-Friendly'],
      imageUrl: 'https://images.pexels.com/photos/1578749/pexels-photo-1578749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.2,
      reviews: 45
    },
    {
      id: '4',
      name: 'Forest Trail',
      location: '2.3 miles away',
      difficulty: 'Moderate',
      length: 3.5,
      description: 'Winding through dense forest with varied terrain. Several creek crossings provide water for dogs along the way.',
      petFriendlyFeatures: ['Shaded', 'Water Crossings', 'Wildlife'],
      imageUrl: 'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4.4,
      reviews: 37
    }
  ];
  
  useEffect(() => {
    // In a real app, this would fetch the current pet and suggest trails based on its breed
    setCurrentPet(mockPet);
    setSuggestedTrails(mockTrailSuggestions);
    setNearbyTrails(mockNearbyTrails);
  }, []);
  
  const handleTrailSelect = (trail: TrailSuggestion) => {
    // In a real app, this would navigate to the trail details page
    console.log('Selected trail:', trail);
    alert(`Selected trail: ${trail.name}`);
  };
  
  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <PageHeader title="Adventures" />
      
      {/* Quick Actions - Move these above the hero section */}
      <div className="max-w-lg mx-auto px-4 pt-4 pb-2">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => navigate('/trails')}
            className="bg-white dark:bg-gray-800 shadow-md text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            icon={<MapPin className="h-5 w-5 text-emerald-600 dark:text-amber-500" />}
          >
            Find Trails
          </Button>
          <Button 
            onClick={() => navigate('/record')}
            className="bg-white dark:bg-gray-800 shadow-md text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            icon={<Map className="h-5 w-5 text-emerald-600 dark:text-amber-500" />}
          >
            Record Activity
          </Button>
        </div>
      </div>
      
      {/* Hero Section - Reduced height and moved below quick actions */}
      <div className="relative h-32 bg-emerald-700 dark:bg-gray-800 mt-2">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <img
            src="https://images.pexels.com/photos/1790393/pexels-photo-1790393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Dog on a trail"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative flex flex-col items-center justify-center h-full text-white p-4">
          <Compass className="h-8 w-8 mb-1" />
          <p className="text-sm text-center mt-1">Discover the perfect trails for you and your pet</p>
        </div>
      </div>
      
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Current Pet Section */}
        {currentPet && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Recommended for {currentPet.name}
            </h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-md dark:border dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    {currentPet.photo ? (
                      <img 
                        src={currentPet.photo}
                        alt={currentPet.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-emerald-100 dark:border-gray-700"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-gray-700 flex items-center justify-center">
                        <PawPrint className="h-6 w-6 text-emerald-600 dark:text-amber-500" />
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{currentPet.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{currentPet.breed} • {currentPet.energyLevel} Energy</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Based on {currentPet.name}'s breed and energy level, we recommend these trails:
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/pet/' + currentPet.id)}
                    >
                      View Full Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
        
        {/* Breed-Specific Recommendations */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Perfect for {currentPet?.breed || 'Your Dog'}
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              icon={<ArrowUpRight className="h-4 w-4" />}
              onClick={() => navigate('/trails')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {suggestedTrails.map(trail => (
              <TrailCard 
                key={trail.id} 
                trail={trail} 
                onSelectTrail={handleTrailSelect}
              />
            ))}
          </div>
        </div>
        
        {/* Nearby Trails */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Nearby Trails
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              icon={<ArrowUpRight className="h-4 w-4" />}
              onClick={() => navigate('/trails')}
            >
              View Map
            </Button>
          </div>
          <div className="space-y-4">
            {nearbyTrails.map(trail => (
              <TrailCard 
                key={trail.id} 
                trail={trail} 
                onSelectTrail={handleTrailSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventuresPage;