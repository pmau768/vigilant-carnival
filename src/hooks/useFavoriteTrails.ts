import useSWR from 'swr';
import { suggestTrails } from '../utils/api';
import { Trail, mapToTrail } from './useTrails';

// Mock favorite trails data - would be replaced by API calls
const mockFavoriteTrails: Record<string, string[]> = {
  '1': ['1', '3'], // Pet 1 has trails 1 and 3 as favorites
  '2': ['2'],      // Pet 2 has trail 2 as favorite
  '3': []          // Pet 3 has no favorites
};

export function useFavoriteTrails(petId: string | undefined) {
  const { data, error, mutate } = useSWR<Trail[]>(
    petId ? `/pets/${petId}/favorite-trails` : null,
    async () => {
      if (!petId) return [];
      
      // In a real app, this would call the API
      // return api.get(`/pets/${petId}/favorite-trails`).then(r => r.data);
      
      // For demo purposes, simulate API call with mock data
      // Get the list of favorite trail IDs for this pet
      const favoriteIds = mockFavoriteTrails[petId] || [];
      
      if (favoriteIds.length === 0) return [];
      
      // Fetch all trails (in a real app, you'd have an endpoint to fetch by IDs)
      const allTrails = await suggestTrails('mixed', 'Portland, OR');
      
      // Filter to just the favorites and map to Trail type
      return allTrails
        .filter(trail => favoriteIds.includes(trail.id))
        .map(mapToTrail);
    }
  );

  const add = async (trailId: string) => {
    if (!petId) return;
    
    // In a real app, this would call the API
    // await api.post(`/pets/${petId}/favorite-trails`, { trailId });
    
    // For demo purposes, simulate API call
    if (!mockFavoriteTrails[petId]) {
      mockFavoriteTrails[petId] = [];
    }
    if (!mockFavoriteTrails[petId].includes(trailId)) {
      mockFavoriteTrails[petId].push(trailId);
    }
    
    mutate(); // Revalidate the data
  };

  const remove = async (trailId: string) => {
    if (!petId) return;
    
    // In a real app, this would call the API
    // await api.delete(`/pets/${petId}/favorite-trails/${trailId}`);
    
    // For demo purposes, simulate API call
    if (mockFavoriteTrails[petId]) {
      mockFavoriteTrails[petId] = mockFavoriteTrails[petId].filter(
        id => id !== trailId
      );
    }
    
    mutate(); // Revalidate the data
  };

  return {
    favorites: data || [],
    isLoading: !data && !error,
    isError: !!error,
    add,
    remove,
  };
} 