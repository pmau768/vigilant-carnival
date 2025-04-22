import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { MapPin, CalendarDays, Route, Clock, Heart, Award, ChevronLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { Pet, HikeRecord } from '../types';
import { getPet, getHikes } from '../utils/api';
import { motion } from 'framer-motion';

const PetProfilePage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [hikes, setHikes] = useState<HikeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data
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
  
  const mockHikes: HikeRecord[] = [
    {
      id: '1',
      petId: '1',
      customTrailName: 'Riverside Trail',
      date: '2023-04-16',
      duration: 90,
      distance: 3.8,
      gpsData: [],
      weatherConditions: 'Sunny, 72°F',
    },
    {
      id: '2',
      petId: '1',
      customTrailName: 'Mountain View',
      date: '2023-04-10',
      duration: 60,
      distance: 2.5,
      gpsData: [],
      weatherConditions: 'Cloudy, 65°F',
    },
    {
      id: '3',
      petId: '1',
      customTrailName: 'Forest Loop',
      date: '2023-03-26',
      duration: 120,
      distance: 4.1,
      gpsData: [],
      weatherConditions: 'Partly Cloudy, 68°F',
    },
  ];
  
  useEffect(() => {
    setIsLoading(true);
    // In a real app, we would fetch the pet and hikes data
    // For now, use mock data
    setPet(mockPet);
    setHikes(mockHikes);
    setIsLoading(false);
  }, [petId]);
  
  if (isLoading || !pet) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader title={pet.name} showBackButton backTo="/pets" />
      
      {/* Profile header */}
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 dark:from-gray-800 dark:to-gray-900 dark:border dark:border-gray-700 rounded-xl overflow-hidden mb-6">
          <div className="pt-10 pb-6 px-6 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mx-auto mb-4 relative"
            >
              {pet.photo ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 mx-auto">
                  <img
                    src={pet.photo}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-emerald-500 dark:bg-amber-600 flex items-center justify-center mx-auto border-4 border-white dark:border-gray-700">
                  <span className="text-4xl font-bold text-white">{pet.name.charAt(0)}</span>
                </div>
              )}
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white">{pet.name}</h1>
            <p className="text-emerald-100 dark:text-gray-300">{pet.breed} • {pet.age} yr • {pet.weight} lbs</p>
            
            <div className="flex justify-center space-x-2 mt-4">
              <span className="px-3 py-1 bg-emerald-800/50 dark:bg-gray-700/50 text-emerald-100 dark:text-amber-400 rounded-full text-sm">
                {pet.energyLevel} Energy
              </span>
              {pet.healthIssues && pet.healthIssues.length > 0 && (
                <span className="px-3 py-1 bg-red-800/50 dark:bg-red-900/50 text-red-100 rounded-full text-sm">
                  Health Issues
                </span>
              )}
            </div>
          </div>
          
          {/* Stats summary */}
          <div className="grid grid-cols-2 bg-emerald-800/30 dark:bg-gray-900/50 p-4 border-t border-emerald-600/30 dark:border-gray-700">
            <div className="text-center">
              <div className="text-emerald-100 dark:text-gray-400 text-sm mb-1">Total Distance</div>
              <div className="text-white text-2xl font-bold">{pet.totalDistance} mi</div>
            </div>
            <div className="text-center">
              <div className="text-emerald-100 dark:text-gray-400 text-sm mb-1">Hikes Completed</div>
              <div className="text-white text-2xl font-bold">{pet.totalHikes}</div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button 
            variant="primary" 
            icon={<MapPin className="h-5 w-5" />}
            onClick={() => navigate('/trails')}
          >
            Find Trails
          </Button>
          <Button 
            variant="primary" 
            icon={<Route className="h-5 w-5" />}
            onClick={() => navigate('/record')}
          >
            Record Hike
          </Button>
          <Button 
            variant="outline" 
            icon={<Heart className="h-5 w-5" />}
          >
            Health Log
          </Button>
        </div>
        
        {/* Past hikes */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-emerald-600 dark:text-amber-500" />
            Past Hikes
          </h2>
          
          <div className="space-y-4">
            {hikes.map((hike) => (
              <Card 
                key={hike.id} 
                variant="outline" 
                className="overflow-hidden hover:shadow-md transition-shadow dark:border-gray-700"
                hover
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="bg-emerald-600 dark:bg-amber-700 text-white p-4 sm:w-32 flex flex-col items-center justify-center sm:rounded-l-lg rounded-t-lg sm:rounded-tr-none">
                      <CalendarDays className="h-6 w-6 mb-1" />
                      <span className="font-semibold">{format(parseISO(hike.date), 'MMM d')}</span>
                    </div>
                    
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{hike.customTrailName}</h3>
                      
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Route className="h-4 w-4 mr-1 text-emerald-600 dark:text-amber-500" />
                          <span>{hike.distance} mi</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1 text-emerald-600 dark:text-amber-500" />
                          <span>{Math.floor(hike.duration / 60)}h {hike.duration % 60}m</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-xs bg-emerald-100 dark:bg-gray-700 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                            {Math.round(hike.duration / hike.distance)} min/mi
                          </span>
                        </div>
                      </div>
                      
                      {hike.weatherConditions && (
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {hike.weatherConditions}
                        </div>
                      )}
                      
                      <div className="mt-3 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/analysis/${hike.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfilePage;