import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Search, Filter, Activity, Map, Route, Wind, ChevronDown, ChevronUp, MapPin, Clock, Mountain, PawPrint } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { HikeRecord, Pet, HikeAnalysis } from '../types';
import { getHikes, getPets, getHikeAnalysis, generateHikeAnalysis } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const IntegratedHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [hikes, setHikes] = useState<HikeRecord[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [expandedHikeId, setExpandedHikeId] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<Record<string, HikeAnalysis | null>>({});
  const [generatingAnalysisId, setGeneratingAnalysisId] = useState<string | null>(null);
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
  
  // Mock hike data for preview
  const mockHikes: HikeRecord[] = [
    {
      id: '1',
      petId: '1',
      customTrailName: 'Mountain View Trail',
      date: '2023-04-16',
      duration: 90, // minutes
      distance: 3.8, // miles
      gpsData: [],
      activityType: 'Hike',
      terrain: 'Mountainous',
      elevationGain: 450,
      weatherConditions: 'Sunny, 72°F',
      notes: 'Buddy was very energetic and loved the views from the top!'
    },
    {
      id: '2',
      petId: '2',
      customTrailName: 'Riverside Path',
      date: '2023-04-12',
      duration: 60,
      distance: 2.5,
      gpsData: [],
      activityType: 'Walk',
      terrain: 'Flat',
      weatherConditions: 'Cloudy, 65°F',
      notes: 'Luna enjoyed watching the ducks in the river.'
    },
    {
      id: '3',
      petId: '1',
      customTrailName: 'City Park Loop',
      date: '2023-04-05',
      duration: 45,
      distance: 1.5,
      gpsData: [],
      activityType: 'Play',
      terrain: 'Flat',
      weatherConditions: 'Sunny, 68°F',
      notes: 'Mostly playing fetch at the dog park.'
    },
  ];
  
  // Mock analysis generation function
  const generateCustomAnalysis = (hike: HikeRecord, pet: Pet | undefined): HikeAnalysis => {
    if (!pet) {
      throw new Error('Pet not found');
    }
    
    // Calculate some "insights" based on the hike data
    const pace = hike.duration / hike.distance; // minutes per mile
    const estimatedCalories = Math.round(pet.weight * 0.8 * hike.distance);
    const elevationInsight = hike.elevationGain 
      ? `The ${hike.elevationGain}ft of elevation gain provided good cardiovascular exercise.` 
      : 'The relatively flat terrain was easy on the joints.';
      
    let pawHealthNote = '';
    if (pet.healthIssues && pet.healthIssues.length > 0) {
      if (pet.healthIssues.some(issue => issue.toLowerCase().includes('hip') || issue.toLowerCase().includes('joint'))) {
        pawHealthNote = `Given ${pet.name}'s joint issues, the ${hike.terrain?.toLowerCase() || 'varied'} terrain was ${hike.terrain === 'Flat' ? 'well-suited' : 'somewhat challenging'}.`;
      }
    }
    
    return {
      id: `analysis-${hike.id}`,
      hikeId: hike.id,
      petId: pet.id,
      overview: `This ${hike.distance} mile ${hike.activityType?.toLowerCase() || 'activity'} was a ${pace < 20 ? 'brisk' : 'moderate'} workout for ${pet.name}. The ${hike.terrain?.toLowerCase() || 'varied'} terrain and ${hike.weatherConditions?.split(',')[0].toLowerCase() || 'current'} weather created ${pace < 20 ? 'ideal' : 'good'} conditions for a ${pet.breed}.`,
      pawHealthInsights: `${pawHealthNote} The activity had a ${hike.duration < 60 ? 'low' : 'moderate'} impact on paw health. ${pet.name} moved at a pace of ${Math.round(pace)} minutes per mile, which is ${pace < 20 ? 'energetic' : 'comfortable'} for a ${pet.breed}.`,
      restStopRecommendations: `For similar ${hike.activityType?.toLowerCase() || 'activities'}, we recommend water breaks every ${Math.round(hike.distance * 0.8)} miles, especially in ${hike.weatherConditions?.includes('Sunny') ? 'sunny' : 'similar'} conditions.`,
      futureSuggestions: `Based on ${pet.name}'s ${pet.energyLevel.toLowerCase()} energy level, consider ${pet.energyLevel === 'High' ? 'increasing the distance to 5+ miles' : 'maintaining a similar distance but varying the terrain'} for future outings.`,
      energyExpenditureEstimate: `This ${hike.activityType?.toLowerCase() || 'hike'} likely burned approximately ${estimatedCalories}-${estimatedCalories + 50} calories for ${pet.name}, which is about ${Math.round(estimatedCalories/(pet.weight * 30) * 100)}% of a ${pet.weight}lb ${pet.breed}'s daily energy needs. ${elevationInsight} ${pet.energyLevel === 'High' ? 'Given the high energy level, consider more challenging trails or longer distances in the future.' : 'This activity level seems well-matched to your pet\'s energy needs.'}`,
      timestamp: new Date().toISOString(),
    };
  };
  
  useEffect(() => {
    // In a real app, this would fetch data from the API
    // loadData();
    
    // For demo purposes, use mock data
    setPets(mockPets);
    setHikes(mockHikes);
  }, []);
  
  const toggleExpandHike = (hikeId: string) => {
    if (expandedHikeId === hikeId) {
      setExpandedHikeId(null);
    } else {
      setExpandedHikeId(hikeId);
      // If we don't have the analysis yet, try to load it
      if (!analyses[hikeId]) {
        loadAnalysis(hikeId);
      }
    }
  };
  
  const loadAnalysis = async (hikeId: string) => {
    // In a real app, this would try to fetch existing analysis first
    // Try { 
    //   const analysis = await getHikeAnalysis(hikeId);
    //   setAnalyses(prev => ({ ...prev, [hikeId]: analysis }));
    // } catch (error) {
    //   // No existing analysis, that's fine
    //   setAnalyses(prev => ({ ...prev, [hikeId]: null }));
    // }
    
    // For demo, just set it to null to show the generate button
    setAnalyses(prev => ({ ...prev, [hikeId]: null }));
  };
  
  const handleGenerateAnalysis = async (hikeId: string) => {
    setGeneratingAnalysisId(hikeId);
    try {
      // In a real app, this would call the API
      // const analysis = await generateHikeAnalysis(hikeId);
      
      // For demo purposes, generate synthetic analysis
      const hike = hikes.find(h => h.id === hikeId);
      const pet = pets.find(p => p.id === hike?.petId);
      
      if (!hike) {
        throw new Error('Hike not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysis = generateCustomAnalysis(hike, pet);
      setAnalyses(prev => ({ ...prev, [hikeId]: analysis }));
      toast.success('Analysis generated successfully!');
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error('Failed to generate analysis');
    } finally {
      setGeneratingAnalysisId(null);
    }
  };
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedPets, fetchedHikes] = await Promise.all([
        getPets(),
        getHikes(),
      ]);
      setPets(fetchedPets);
      setHikes(fetchedHikes);
    } catch (error) {
      console.error('Error loading data:', error);
      // Use mock data as fallback
      setPets(mockPets);
      setHikes(mockHikes);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPetById = (id: string): Pet | undefined => {
    return pets.find(pet => pet.id === id);
  };
  
  // Get activity icon based on type
  const getActivityIcon = (type?: string, className: string = 'h-5 w-5') => {
    switch(type) {
      case 'Run':
        return <Activity className={`${className} text-red-500 dark:text-red-400`} />;
      case 'Walk':
        return <Route className={`${className} text-blue-500 dark:text-blue-400`} />;
      case 'Play':
        return <Wind className={`${className} text-purple-500 dark:text-purple-400`} />;
      case 'Hike':
      default:
        return <Map className={`${className} text-emerald-500 dark:text-emerald-400`} />;
    }
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
        onClick={() => navigate('/trails-and-record')}
      >
        Record Activity
      </Button>
    </div>
  );

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
            
            {pets.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <div className="text-sm text-gray-700 dark:text-gray-300 mr-2 pt-1">
                  Filter by pet:
                </div>
                <Button 
                  variant={selectedPetId === '' ? 'primary' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedPetId('')}
                >
                  All Pets
                </Button>
                {pets.map(pet => (
                  <Button 
                    key={pet.id}
                    variant={selectedPetId === pet.id ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedPetId(pet.id)}
                  >
                    {pet.name}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">Loading activities...</p>
          </div>
        ) : filteredHikes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No activities found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setActivityFilter('');
                setSelectedPetId('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHikes.map(hike => {
              const pet = getPetById(hike.petId);
              const isExpanded = expandedHikeId === hike.id;
              const hikeAnalysis = analyses[hike.id];
              const isGenerating = generatingAnalysisId === hike.id;
              
              return (
                <Card key={hike.id} className="shadow-sm dark:border dark:border-gray-700 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="cursor-pointer" onClick={() => toggleExpandHike(hike.id)}>
                      <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="bg-gray-100 dark:bg-gray-700 h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0">
                          {getActivityIcon(hike.activityType, 'h-6 w-6')}
                        </div>
                        
                        <div className="ml-4 flex-grow">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {hike.customTrailName}
                            </h3>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center mt-1 text-sm">
                            <div className="text-gray-500 dark:text-gray-400 mr-3">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {format(new Date(hike.date), 'MMM d, yyyy')}
                            </div>
                            {pet && (
                              <div className="text-gray-500 dark:text-gray-400 flex items-center mr-3">
                                <PawPrint className="h-3 w-3 mr-1" />
                                {pet.name}
                              </div>
                            )}
                            <div className="text-gray-500 dark:text-gray-400">
                              {hike.activityType}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
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
                        
                        {hike.notes && !isExpanded && (
                          <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                            <p>{hike.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Expanded analysis section */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                            {hike.notes && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</h4>
                                <p className="text-gray-600 dark:text-gray-400">{hike.notes}</p>
                              </div>
                            )}
                            
                            {hikeAnalysis ? (
                              <div className="space-y-4">
                                <h4 className="text-lg font-medium text-gray-800 dark:text-white">Activity Analysis</h4>
                                
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Overview</h5>
                                    <p className="text-gray-600 dark:text-gray-400">{hikeAnalysis.overview}</p>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Health Insights</h5>
                                    <p className="text-gray-600 dark:text-gray-400">{hikeAnalysis.pawHealthInsights}</p>
                                  </div>
                                  
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recommendations</h5>
                                    <p className="text-gray-600 dark:text-gray-400">{hikeAnalysis.futureSuggestions}</p>
                                  </div>
                                </div>
                                
                                <div className="flex justify-end">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/analysis/${hike.id}`)}
                                  >
                                    View Full Analysis
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-4">
                                <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                                  Generate an AI-powered analysis to get insights for your pet's {hike.activityType?.toLowerCase() || 'activity'}.
                                </p>
                                <Button
                                  onClick={() => handleGenerateAnalysis(hike.id)}
                                  isLoading={isGenerating}
                                  disabled={isGenerating}
                                >
                                  Generate Analysis
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

export default IntegratedHistoryPage; 