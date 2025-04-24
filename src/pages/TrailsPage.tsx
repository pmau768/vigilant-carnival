import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Activity, Filter, Search } from 'lucide-react';
import { toast } from 'react-toastify';

import TrailCard from '../components/trail/TrailCard';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TrailSuggestion } from '../types';

const TrailsPage: React.FC = () => {
  const [trails, setTrails] = useState<TrailSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTrails, setFilteredTrails] = useState<TrailSuggestion[]>([]);
  const navigate = useNavigate();

  const handleSelectTrail = (trail: TrailSuggestion) => {
    // In a real app, this would navigate to a trail details page
    console.log('Selected trail:', trail);
    // Navigate to recording page for this trail
    navigate(`/record?trailId=${trail.id}&trailName=${encodeURIComponent(trail.name)}`);
  };

  const handleStartActivity = () => {
    navigate('/record');
  };

  useEffect(() => {
    // In a real app, this would fetch trails from the API
    // For now, we use mock data
    setTrails(mockTrails);
  }, []);

  useEffect(() => {
    // Filter trails based on search query
    if (searchQuery.trim() === '') {
      setFilteredTrails(trails);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = trails.filter(trail => 
        trail.name.toLowerCase().includes(query) || 
        trail.location.toLowerCase().includes(query) ||
        trail.description.toLowerCase().includes(query)
      );
      setFilteredTrails(filtered);
    }
  }, [searchQuery, trails]);

  // Mock data for preview purposes - would be replaced by API response
  const mockTrails: TrailSuggestion[] = [
    {
      id: '1',
      name: 'Riverfront Trail',
      location: 'Portland, OR',
      difficulty: 'Easy',
      length: 2.5,
      description: 'A gentle path along the Willamette River with plenty of shade and water access points for dogs to cool off.',
      petFriendlyFeatures: ['Water Access', 'Shaded Areas', 'Flat Terrain', 'Dog-Friendly'],
      imageUrl: 'https://images.pexels.com/photos/3806750/pexels-photo-3806750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '2',
      name: 'Forest Park Loop',
      location: 'Portland, OR',
      difficulty: 'Moderate',
      length: 4.2,
      description: 'This trail offers a mix of terrain with some elevation changes. The forest environment offers mental stimulation with various scents and wildlife to observe.',
      petFriendlyFeatures: ['Wildlife Viewing', 'Off-leash Areas', 'Natural Obstacles', 'Bird Watching'],
      imageUrl: 'https://images.pexels.com/photos/163703/woods-landscape-road-forest-163703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '3',
      name: 'Mt. Tabor Summit',
      location: 'Portland, OR',
      difficulty: 'Hard',
      length: 3.0,
      description: 'A more challenging trail with significant elevation gain. Multiple interconnected paths allow for varied routes and extended adventures.',
      petFriendlyFeatures: ['Elevation Gain', 'Multiple Routes', 'Dog Waste Stations', 'Panoramic Views'],
      imageUrl: 'https://images.pexels.com/photos/163692/forest-trees-fog-eerie-163692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '4',
      name: 'Waterfront Dog Park Trail',
      location: 'Seattle, WA',
      difficulty: 'Easy',
      length: 1.8,
      description: 'A popular trail connecting several dog parks along the waterfront. Perfect for social dogs who enjoy meeting new friends.',
      petFriendlyFeatures: ['Dog Parks', 'Water Fountains', 'Waste Stations', 'Benches'],
      imageUrl: 'https://images.pexels.com/photos/1578750/pexels-photo-1578750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: '5',
      name: 'Mountain Vista Trail',
      location: 'Boulder, CO',
      difficulty: 'Hard',
      length: 5.6,
      description: 'A challenging mountain trail with spectacular views. Best for athletic dogs and experienced hikers.',
      petFriendlyFeatures: ['Wildlife', 'Scenic Views', 'Technical Terrain'],
      imageUrl: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader title="Trails" />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        <Card className="p-4 mb-6 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300 mb-2">
            Track Your Adventure
          </h2>
          <p className="text-sm text-emerald-800 dark:text-emerald-400 mb-3">
            Record your hike, run, or walk with your pet on any trail.
          </p>
          <Button
            className="w-full"
            onClick={handleStartActivity}
          >
            <Activity className="h-4 w-4 mr-2" />
            Start New Activity
          </Button>
        </Card>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search trails by name or location..."
            className="pl-10 w-full h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Local Trails
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
        </div>

        <div className="space-y-4">
          {filteredTrails.length > 0 ? (
            filteredTrails.map((trail) => (
              <TrailCard
                key={trail.id}
                trail={trail}
                onSelectTrail={handleSelectTrail}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No trails match your search' : 'No trails available'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailsPage;