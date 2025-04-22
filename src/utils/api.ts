import axios from 'axios';
import { Pet, TrailSuggestion, HikeRecord, HikeAnalysis } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Pet API functions
export const getPets = async (): Promise<Pet[]> => {
  const response = await api.get('/pets');
  return response.data;
};

export const getPet = async (id: string): Promise<Pet> => {
  const response = await api.get(`/pets/${id}`);
  return response.data;
};

export const createPet = async (pet: Omit<Pet, 'id'>): Promise<Pet> => {
  const response = await api.post('/pets', pet);
  return response.data;
};

export const updatePet = async (id: string, pet: Partial<Pet>): Promise<Pet> => {
  const response = await api.put(`/pets/${id}`, pet);
  return response.data;
};

export const deletePet = async (id: string): Promise<void> => {
  await api.delete(`/pets/${id}`);
};

// Trail API functions
export const suggestTrails = async (breed: string, location: string): Promise<TrailSuggestion[]> => {
  // In a real app, this would call your API
  // const response = await api.post('/trails/suggest', { breed, location });
  
  // For demo purposes, let's return mock data
  // This would be replaced with actual API call in production
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Riverfront Trail',
          location: location,
          difficulty: 'Easy',
          length: 2.5,
          description: `A gentle path along the river with plenty of shade and water access points for dogs to cool off. Perfect for a ${breed} that needs moderate exercise without too much strain.`,
          petFriendlyFeatures: ['Water Access', 'Shaded Areas', 'Flat Terrain', 'Dog-Friendly'],
          imageUrl: 'https://images.pexels.com/photos/3806750/pexels-photo-3806750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          rating: 4.2,
          reviews: 45
        },
        {
          id: '2',
          name: 'Forest Park Loop',
          location: location,
          difficulty: 'Moderate',
          length: 4.2,
          description: `This trail offers a mix of terrain with some elevation changes that will give your ${breed} a good workout. The forest environment offers mental stimulation with various scents and wildlife to observe.`,
          petFriendlyFeatures: ['Wildlife Viewing', 'Off-leash Areas', 'Natural Obstacles', 'Bird Watching'],
          imageUrl: 'https://images.pexels.com/photos/163703/woods-landscape-road-forest-163703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          rating: 4.5,
          reviews: 32
        },
        {
          id: '3',
          name: 'Mountain View Trail',
          location: location,
          difficulty: 'Hard',
          length: 3.0,
          description: `A more challenging trail with significant elevation gain that will help burn off your ${breed}'s energy. Multiple interconnected paths allow for varied routes and extended adventures.`,
          petFriendlyFeatures: ['Elevation Gain', 'Multiple Routes', 'Dog Waste Stations', 'Panoramic Views'],
          imageUrl: 'https://images.pexels.com/photos/163692/forest-trees-fog-eerie-163692.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          rating: 4.7,
          reviews: 28
        },
      ]);
    }, 1500);
  });
};

// Hike API functions
export const getHikes = async (petId?: string): Promise<HikeRecord[]> => {
  const params = petId ? { petId } : undefined;
  const response = await api.get('/hikes', { params });
  return response.data;
};

export const getHike = async (id: string): Promise<HikeRecord> => {
  const response = await api.get(`/hikes/${id}`);
  return response.data;
};

export const recordHike = async (hike: Omit<HikeRecord, 'id'>): Promise<HikeRecord> => {
  const response = await api.post('/hikes/record', hike);
  return response.data;
};

export const getHikeAnalysis = async (hikeId: string): Promise<HikeAnalysis> => {
  const response = await api.get(`/hikes/${hikeId}/analysis`);
  return response.data;
};

export const generateHikeAnalysis = async (hikeId: string): Promise<HikeAnalysis> => {
  // In a real app, this would call your API
  // const response = await api.post(`/hikes/${hikeId}/analysis`);
  // return response.data;
  
  // For demo purposes, let's simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        hikeId,
        petId: '1',
        overview: 'Your pet completed a moderate-intensity activity covering a good distance. The pace was steady and appropriate for their breed and energy level.',
        pawHealthInsights: 'Based on the terrain and distance, your pet\'s paws were exposed to varied surfaces. Check between pads for any debris or irritation. Consider a paw balm if the trail was particularly rough.',
        restStopRecommendations: 'For an activity of this duration and with this weather, your pet likely needed 2-3 water breaks. Ensure they have ample recovery time after the activity.',
        futureSuggestions: 'Given your pet\'s performance, you could gradually increase distance on similar terrain. Consider alternating between different types of activities to work different muscle groups.',
        energyExpenditureEstimate: 'This activity likely burned approximately 400-500 calories for your pet, which is about 20-25% of their daily energy needs based on breed and weight.',
        timestamp: new Date().toISOString(),
      });
    }, 2000);
  });
};

// Weather API mock
export const getCurrentWeather = async (latitude: number, longitude: number): Promise<string> => {
  // In a real app, this would call a weather API
  // For demo purposes, we'll return mock data
  const weatherConditions = [
    'Sunny, 72°F',
    'Partly Cloudy, 68°F',
    'Overcast, 65°F',
    'Light Rain, 62°F',
    'Clear, 70°F'
  ];
  
  return weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
};