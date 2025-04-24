import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { MapPin, CalendarDays, Route, Clock, Heart, Award, ChevronLeft, Map, Activity, Wind, PawPrint, Edit, BarChart2, Calendar, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { Pet, HikeRecord } from '../types';
import { getPet, getHikes } from '../utils/api';
import { motion } from 'framer-motion';

const EnhancedPetProfilePage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [hikes, setHikes] = useState<HikeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'activities'>('profile');
  
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
      activityType: 'Hike',
      terrain: 'Hilly',
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
      activityType: 'Walk',
      terrain: 'Flat',
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
      activityType: 'Run',
      terrain: 'Mixed',
    },
  ];
  
  useEffect(() => {
    if (!petId) return;
    
    setIsLoading(true);
    // In a real app, we would fetch the pet and hikes data
    // For now, use mock data
    setPet(mockPet);
    setHikes(mockHikes);
    setIsLoading(false);
  }, [petId]);
  
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
  
  const getActivityStats = () => {
    if (hikes.length === 0) return null;
    
    // Calculate total distance, duration, and activities count
    const totalDistance = hikes.reduce((sum, hike) => sum + hike.distance, 0);
    const totalDuration = hikes.reduce((sum, hike) => sum + hike.duration, 0);
    
    const activityCounts: Record<string, number> = {};
    hikes.forEach(hike => {
      const type = hike.activityType || 'Hike';
      activityCounts[type] = (activityCounts[type] || 0) + 1;
    });
    
    // Get most common terrain
    const terrainCounts: Record<string, number> = {};
    hikes.forEach(hike => {
      if (hike.terrain) {
        terrainCounts[hike.terrain] = (terrainCounts[hike.terrain] || 0) + 1;
      }
    });
    
    let mostCommonTerrain = 'Unknown';
    let highestCount = 0;
    Object.entries(terrainCounts).forEach(([terrain, count]) => {
      if (count > highestCount) {
        mostCommonTerrain = terrain;
        highestCount = count;
      }
    });
    
    return {
      totalDistance,
      totalDuration,
      activityCounts,
      mostCommonTerrain
    };
  };
  
  if (isLoading || !pet) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  const activityStats = getActivityStats();
  
  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader 
        title={pet.name} 
        showBackButton 
        backTo="/pets"
        rightContent={
          <Button
            variant="ghost"
            size="sm"
            icon={<Edit className="h-4 w-4" />}
            onClick={() => navigate(`/pets?edit=${pet.id}`)}
          >
            Edit
          </Button>
        }
      />
      
      {/* Top Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-lg mx-auto">
          <div className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'profile'
                  ? 'border-emerald-500 dark:border-amber-500 text-emerald-600 dark:text-amber-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'activities'
                  ? 'border-emerald-500 dark:border-amber-500 text-emerald-600 dark:text-amber-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('activities')}
            >
              Activities
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {activeTab === 'profile' ? (
          <>
            {/* Profile header */}
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
              <div className="grid grid-cols-3 bg-emerald-800/60 dark:bg-gray-800/60">
                <div className="text-center py-3">
                  <div className="text-sm text-emerald-100 dark:text-gray-400">Distance</div>
                  <div className="text-xl font-bold text-white">{pet.totalDistance || 0} mi</div>
                </div>
                <div className="text-center py-3 border-l border-r border-emerald-700/50 dark:border-gray-700/50">
                  <div className="text-sm text-emerald-100 dark:text-gray-400">Activities</div>
                  <div className="text-xl font-bold text-white">{pet.totalHikes || 0}</div>
                </div>
                <div className="text-center py-3">
                  <div className="text-sm text-emerald-100 dark:text-gray-400">Level</div>
                  <div className="text-xl font-bold text-white">{Math.floor((pet.totalDistance || 0) / 10) + 1}</div>
                </div>
              </div>
            </div>
            
            {/* Pet details */}
            <Card className="shadow-sm dark:border dark:border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Pet Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Breed</div>
                    <div className="font-medium">{pet.breed}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Age</div>
                    <div className="font-medium">{pet.age} years old</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Weight</div>
                    <div className="font-medium">{pet.weight} lbs</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Energy Level</div>
                    <div className="font-medium">{pet.energyLevel}</div>
                  </div>
                </div>
                
                {pet.healthIssues && pet.healthIssues.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Health Considerations</div>
                    <ul className="list-disc list-inside space-y-1">
                      {pet.healthIssues.map((issue, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Activities Preview */}
            {hikes.length > 0 && (
              <Card className="shadow-sm dark:border dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Recent Activities</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab('activities')}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hikes.slice(0, 3).map((hike) => (
                      <motion.div 
                        key={hike.id}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className="cursor-pointer hover:shadow-md transition-shadow dark:border-gray-700"
                          onClick={() => navigate(`/analysis/${hike.id}`)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center">
                              <div className="bg-gray-100 dark:bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                                {getActivityIcon(hike.activityType)}
                              </div>
                              
                              <div className="flex-grow">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium text-gray-900 dark:text-white">
                                    {hike.customTrailName}
                                  </h3>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {format(new Date(hike.date), 'MMM d')}
                                  </span>
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
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Activities Tab */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{pet.name}'s Activities</h2>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => navigate('/trails-and-record')}
              >
                New Activity
              </Button>
            </div>
            
            {/* Activity Statistics */}
            {activityStats && (
              <Card className="shadow-sm dark:border dark:border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart2 className="h-5 w-5 text-emerald-600 dark:text-amber-500 mr-2" />
                    Activity Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Distance</div>
                      <div className="font-medium text-emerald-600 dark:text-amber-500">{activityStats.totalDistance.toFixed(1)} miles</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Time</div>
                      <div className="font-medium text-emerald-600 dark:text-amber-500">
                        {Math.floor(activityStats.totalDuration / 60)}h {activityStats.totalDuration % 60}m
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Favorite Activity</div>
                      <div className="font-medium">
                        {Object.entries(activityStats.activityCounts)
                          .sort((a, b) => b[1] - a[1])[0][0]}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Favorite Terrain</div>
                      <div className="font-medium">{activityStats.mostCommonTerrain}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Activities List */}
            <div className="space-y-4">
              {hikes.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No activities recorded yet.</p>
                  <Button
                    onClick={() => navigate('/trails-and-record')}
                  >
                    Record First Activity
                  </Button>
                </div>
              ) : (
                hikes.map((hike) => (
                  <motion.div 
                    key={hike.id}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow dark:border-gray-700"
                      onClick={() => navigate(`/analysis/${hike.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="bg-gray-100 dark:bg-gray-700 h-12 w-12 rounded-full flex items-center justify-center mr-3">
                            {getActivityIcon(hike.activityType)}
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {hike.customTrailName}
                              </h3>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {format(new Date(hike.date), 'MMM d, yyyy')}
                              </span>
                            </div>
                            
                            <div className="flex mt-1 space-x-3 text-sm text-gray-600 dark:text-gray-400">
                              <div>
                                {hike.activityType || 'Hike'}
                              </div>
                              {hike.terrain && (
                                <div>
                                  • {hike.terrain} terrain
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-3">
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
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedPetProfilePage; 