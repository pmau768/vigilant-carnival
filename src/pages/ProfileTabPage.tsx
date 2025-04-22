import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Plus, ChevronRight, Award, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { Pet, HikeRecord } from '../types';
import { motion } from 'framer-motion';

const ProfileTabPage: React.FC = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [recentHikes, setRecentHikes] = useState<HikeRecord[]>([]);
  
  // Mock pets data
  const mockPets: Pet[] = [
    {
      id: '1',
      name: 'Max',
      breed: 'Belgian Malinois',
      age: 5,
      weight: 65,
      energyLevel: 'High',
      photo: 'https://images.pexels.com/photos/2853422/pexels-photo-2853422.jpeg?auto=compress&cs=tinysrgb&w=1600',
      totalDistance: 45,
      totalHikes: 12
    },
    {
      id: '2',
      name: 'Luna',
      breed: 'Border Collie',
      age: 3,
      weight: 45,
      energyLevel: 'High',
      photo: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      totalDistance: 32,
      totalHikes: 8
    }
  ];
  
  // Mock recent hikes
  const mockRecentHikes: HikeRecord[] = [
    {
      id: '1',
      petId: '1',
      customTrailName: 'Mountain View Trail',
      date: '2023-04-16',
      duration: 90,
      distance: 3.8,
      gpsData: [],
      weatherConditions: 'Sunny, 72°F',
    },
    {
      id: '2',
      petId: '2',
      customTrailName: 'Riverside Path',
      date: '2023-04-12',
      duration: 60,
      distance: 2.5,
      gpsData: [],
      weatherConditions: 'Cloudy, 65°F',
    }
  ];
  
  useEffect(() => {
    // In a real app, this would fetch the user's pets and recent hikes
    setPets(mockPets);
    setRecentHikes(mockRecentHikes);
  }, []);
  
  const getPetById = (id: string): Pet | undefined => {
    return pets.find(pet => pet.id === id);
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const headerRightContent = (
    <Button
      variant="ghost"
      size="sm"
      icon={<Plus className="h-4 w-4" />}
      onClick={() => navigate('/pets')}
    >
      Add Pet
    </Button>
  );
  
  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader title="My Pets" rightContent={headerRightContent} />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Pet Profiles */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Pet Profiles
          </h2>
          
          <div className="space-y-3">
            {pets.map((pet) => (
              <motion.div 
                key={pet.id}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/pet/${pet.id}`)}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center p-4">
                      {pet.photo ? (
                        <img
                          src={pet.photo}
                          alt={pet.name}
                          className="h-16 w-16 rounded-full object-cover border-2 border-emerald-100 dark:border-gray-700"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-gray-700 flex items-center justify-center">
                          <PawPrint className="h-8 w-8 text-emerald-600 dark:text-amber-500" />
                        </div>
                      )}
                      
                      <div className="ml-4 flex-grow">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{pet.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {pet.breed} • {pet.age} yr • {pet.energyLevel} Energy
                        </p>
                        
                        <div className="flex mt-1 space-x-3">
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-emerald-600 dark:text-amber-500">
                              {pet.totalDistance} mi
                            </span> total
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-emerald-600 dark:text-amber-500">
                              {pet.totalHikes}
                            </span> hikes
                          </div>
                        </div>
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              icon={<Plus className="h-5 w-5" />}
              onClick={() => navigate('/pets')}
            >
              Add Another Pet
            </Button>
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Activities
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
            >
              View All
            </Button>
          </div>
          
          {recentHikes.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <Award className="h-10 w-10 text-emerald-600 dark:text-amber-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Activities Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Record your first hike with your pet to see activity here.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/record')}
              >
                Record Hike
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentHikes.map((hike) => {
                const pet = getPetById(hike.petId);
                return (
                  <motion.div 
                    key={hike.id}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/analysis/${hike.id}`)}
                    >
                      <CardContent className="p-0">
                        <div className="flex p-4">
                          <div className="bg-emerald-100 dark:bg-gray-700 h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-600 dark:text-amber-500 font-semibold">
                              {formatDate(hike.date)}
                            </span>
                          </div>
                          
                          <div className="ml-4 flex-grow">
                            <div className="flex items-center">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {hike.customTrailName}
                              </h3>
                              {pet && (
                                <div className="ml-2 flex-shrink-0">
                                  {pet.photo ? (
                                    <img
                                      src={pet.photo}
                                      alt={pet.name}
                                      className="h-5 w-5 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full bg-emerald-200 dark:bg-gray-600 flex items-center justify-center">
                                      <PawPrint className="h-3 w-3 text-emerald-600 dark:text-amber-500" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex mt-1 space-x-3 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-emerald-600 dark:text-amber-500" />
                                <span>{hike.distance} mi</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1 text-emerald-600 dark:text-amber-500" />
                                <span>{Math.floor(hike.duration / 60)}h {hike.duration % 60}m</span>
                              </div>
                            </div>
                          </div>
                          
                          <ChevronRight className="h-5 w-5 text-gray-400 self-center" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/history')}
              >
                View All Activities
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileTabPage;