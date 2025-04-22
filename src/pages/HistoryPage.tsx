import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Search, Filter, Activity, Map, Route, Wind } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { HikeRecord, Pet } from '../types';
import { getPets } from '../utils/api';
import { HikeStorageService } from '../services/HikeStorageService';

const HistoryPage: React.FC = () => {
  const [hikes, setHikes] = useState<HikeRecord[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState<string>('');
  
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
  ];
  
  useEffect(() => {
    // Load data from storage
    loadData();
  }, []);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Get pets (mock for now)
      setPets(mockPets);
      
      // Get hikes from storage
      const storedHikes = HikeStorageService.getAllHikes();
      
      // If no stored hikes exist, add some mock data for demo purposes
      if (storedHikes.length === 0) {
        const mockHikes: HikeRecord[] = [
          {
            id: '1',
            petId: '1',
            customTrailName: 'Forest Park Loop',
            date: '2025-02-15',
            duration: 95, // in minutes
            distance: 3.2, // in miles
            gpsData: [],
            notes: 'Buddy loved the creek and forest smells!',
            weatherConditions: 'Sunny, 68°F',
            activityType: 'Hike',
            terrain: 'Hilly',
            elevationGain: 320,
          },
          {
            id: '2',
            petId: '1',
            customTrailName: 'Waterfront Trail',
            date: '2025-02-10',
            duration: 30,
            distance: 1.2,
            gpsData: [],
            weatherConditions: 'Partly Cloudy, 55°F',
            activityType: 'Run',
            terrain: 'Flat',
          },
          {
            id: '3',
            petId: '2',
            customTrailName: 'Mountain View Trail',
            date: '2025-02-14',
            duration: 120,
            distance: 5.5,
            gpsData: [],
            notes: 'Luna did great on this challenging hike!',
            weatherConditions: 'Clear, 60°F',
            activityType: 'Hike',
            terrain: 'Mountainous',
            elevationGain: 850,
          },
          {
            id: '4',
            petId: '1',
            customTrailName: 'Neighborhood Walk',
            date: '2025-02-16',
            duration: 45,
            distance: 1.8,
            gpsData: [],
            weatherConditions: 'Cloudy, 62°F',
            activityType: 'Walk',
            terrain: 'Flat',
          },
          {
            id: '5',
            petId: '2',
            customTrailName: 'Dog Park Visit',
            date: '2025-02-13',
            duration: 60,
            distance: 0.5,
            gpsData: [],
            notes: 'Luna played with several other dogs and had a great time.',
            weatherConditions: 'Sunny, 65°F',
            activityType: 'Play',
            terrain: 'Flat',
          },
        ];
        
        // Add each mock hike to storage
        mockHikes.forEach(hike => {
          const hikeWithoutId = { ...hike };
          // Create a new object without the id property instead of using delete
          const { id, ...hikeData } = hikeWithoutId;
          HikeStorageService.saveHike(hikeData);
        });
        
        // Get all hikes again (now including mock data)
        setHikes(HikeStorageService.getAllHikes());
      } else {
        setHikes(storedHikes);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPetById = (id: string): Pet | undefined => {
    return pets.find(pet => pet.id === id);
  };
  
  const filteredHikes = hikes
    .filter(hike => {
      // Filter by pet if selected
      if (selectedPetId && hike.petId !== selectedPetId) {
        return false;
      }
      
      // Filter by activity type
      if (activityFilter && hike.activityType !== activityFilter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const pet = getPetById(hike.petId);
        const searchLower = searchTerm.toLowerCase();
        return (
          hike.customTrailName?.toLowerCase().includes(searchLower) ||
          pet?.name.toLowerCase().includes(searchLower) ||
          hike.weatherConditions?.toLowerCase().includes(searchLower) ||
          hike.notes?.toLowerCase().includes(searchLower) ||
          hike.activityType?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date, newest first

  const headerRightContent = (
    <div className="flex items-center">
      <Button 
        variant="primary" 
        size="sm"
        onClick={() => window.location.href = '/record'}
      >
        Record Activity
      </Button>
    </div>
  );

  // Get activity icon based on type
  const getActivityIcon = (type?: string) => {
    switch(type) {
      case 'Run':
        return <Activity className="h-5 w-5 text-red-500 dark:text-red-400" />;
      case 'Walk':
        return <Route className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
      case 'Play':
        return <Wind className="h-5 w-5 text-purple-500 dark:text-purple-400" />;
      case 'Hike':
      default:
        return <Map className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader title="Activity History" rightContent={headerRightContent} />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 dark:border dark:border-gray-700">
          <div className="flex flex-col space-y-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 focus:border-emerald-500 dark:focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activityFilter === '' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setActivityFilter('')}
              >
                All
              </Button>
              <Button 
                variant={activityFilter === 'Hike' ? 'primary' : 'outline'} 
                size="sm"
                icon={<Map className="h-4 w-4" />}
                onClick={() => setActivityFilter('Hike')}
              >
                Hikes
              </Button>
              <Button 
                variant={activityFilter === 'Walk' ? 'primary' : 'outline'} 
                size="sm"
                icon={<Route className="h-4 w-4" />}
                onClick={() => setActivityFilter('Walk')}
              >
                Walks
              </Button>
              <Button 
                variant={activityFilter === 'Run' ? 'primary' : 'outline'} 
                size="sm"
                icon={<Activity className="h-4 w-4" />}
                onClick={() => setActivityFilter('Run')}
              >
                Runs
              </Button>
              <Button 
                variant={activityFilter === 'Play' ? 'primary' : 'outline'} 
                size="sm"
                icon={<Wind className="h-4 w-4" />}
                onClick={() => setActivityFilter('Play')}
              >
                Play
              </Button>
            </div>
            
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Filter by pet:</span>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 focus:border-emerald-500 dark:focus:border-amber-500 dark:bg-gray-700 dark:text-white flex-grow"
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
              >
                <option value="">All Pets</option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredHikes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg dark:border dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Activities Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedPetId || activityFilter
                ? 'No activities match your current filters.'
                : 'You haven\'t recorded any activities yet.'}
            </p>
            {searchTerm || selectedPetId || activityFilter ? (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPetId('');
                  setActivityFilter('');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => window.location.href = '/record'}>
                Record an Activity
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHikes.map(hike => {
              const pet = getPetById(hike.petId);
              return (
                <Card key={hike.id} variant="elevated" className="hover:shadow-lg transition-shadow dark:border dark:border-gray-700">
                  <CardContent className="p-0">
                    <div className="flex flex-col">
                      <div className="bg-emerald-600 dark:bg-amber-600 text-white p-4 flex flex-row items-center justify-between rounded-t-lg">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span className="text-lg font-semibold">
                            {format(new Date(hike.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {pet && (
                            <div className="flex items-center">
                              {pet.photo ? (
                                <img
                                  src={pet.photo}
                                  alt={pet.name}
                                  className="h-6 w-6 rounded-full object-cover mr-2"
                                />
                              ) : null}
                              <span className="text-sm mr-2">
                                {pet.name}
                              </span>
                            </div>
                          )}
                          
                          {/* Activity type badge */}
                          <div className="flex items-center bg-white/20 rounded-full px-2 py-0.5">
                            {getActivityIcon(hike.activityType)}
                            <span className="text-xs ml-1">{hike.activityType || 'Hike'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                          {hike.customTrailName || 'Unnamed Trail'}
                        </h3>
                        
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Distance</div>
                            <div className="font-semibold text-emerald-700 dark:text-amber-400">{hike.distance} miles</div>
                          </div>
                          
                          <div className="text-center p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                            <div className="font-semibold text-emerald-700 dark:text-amber-400">
                              {Math.floor(hike.duration / 60)}h {hike.duration % 60}m
                            </div>
                          </div>
                          
                          <div className="text-center p-2 bg-emerald-50 dark:bg-gray-700 rounded-lg">
                            <div className="text-xs text-gray-500 dark:text-gray-400">Pace</div>
                            <div className="font-semibold text-emerald-700 dark:text-amber-400">
                              {Math.round(hike.duration / hike.distance)} min/mi
                            </div>
                          </div>
                        </div>
                        
                        {/* Show terrain if available */}
                        {hike.terrain && (
                          <div className="flex items-center mb-2">
                            <div className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full flex items-center">
                              <Mountain className="h-3 w-3 mr-1" />
                              {hike.terrain} terrain
                              {hike.elevationGain && (
                                <span className="ml-1">• {hike.elevationGain}ft gain</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {hike.notes && (
                          <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                            <p>{hike.notes}</p>
                          </div>
                        )}
                        
                        <div className="mt-4 flex justify-between items-center">
                          {hike.weatherConditions ? (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {hike.weatherConditions}
                            </span>
                          ) : (
                            <span></span>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/analysis/${hike.id}`}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;