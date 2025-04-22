import { useState, useCallback } from 'react';
import { suggestTrails } from '../utils/api';
import { TrailSuggestion } from '../types';

/**
 * Extended Trail interface that maps from TrailSuggestion
 * but includes additional properties needed for the app
 */
export interface Trail {
  id: string;                   // From TrailSuggestion
  name: string;                 // From TrailSuggestion
  distanceMi: number;           // Maps to TrailSuggestion's length property
  terrain: string;              // Derived from petFriendlyFeatures
  difficulty: string;           // From TrailSuggestion
  
  // Optional properties that may come from TrailSuggestion
  location?: string;
  description?: string;
  petFriendlyFeatures?: string[];
  imageUrl?: string;
  rating?: number;
  reviews?: number;
}

/**
 * Map a TrailSuggestion to a Trail
 */
export const mapToTrail = (suggestion: TrailSuggestion): Trail => ({
  id: suggestion.id,
  name: suggestion.name,
  distanceMi: suggestion.length,
  terrain: suggestion.petFriendlyFeatures.find(f => 
    f.includes('Terrain') || f.includes('Mountain')
  ) || 'Mixed',
  difficulty: suggestion.difficulty,
  location: suggestion.location,
  description: suggestion.description,
  petFriendlyFeatures: suggestion.petFriendlyFeatures,
  imageUrl: suggestion.imageUrl,
  rating: suggestion.rating,
  reviews: suggestion.reviews
});

export function useTrails() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrails = useCallback(async (breed: string, location: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const suggestions = await suggestTrails(breed, location);
      
      // Convert TrailSuggestion[] to Trail[]
      const mappedTrails = suggestions.map(mapToTrail);
      
      setTrails(mappedTrails);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  return { trails, loading, error, fetchTrails };
} 