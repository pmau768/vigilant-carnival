import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pet, HikeRecord, TrailSuggestion } from '../types';

// Define the type for our app state
interface AppStateContextType {
  // User preferences
  isMobile: boolean;
  // App data
  selectedPet: Pet | null;
  recentHikes: HikeRecord[];
  favoriteTrails: TrailSuggestion[];
  // Action functions
  setSelectedPet: (pet: Pet | null) => void;
  addFavoriteTrail: (trail: TrailSuggestion) => void;
  removeFavoriteTrail: (trailId: string) => void;
}

// Create the context
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Provider component
export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [recentHikes, setRecentHikes] = useState<HikeRecord[]>([]);
  const [favoriteTrails, setFavoriteTrails] = useState<TrailSuggestion[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addFavoriteTrail = (trail: TrailSuggestion) => {
    setFavoriteTrails(prev => {
      // Check if already exists
      if (prev.some(t => t.id === trail.id)) return prev;
      return [...prev, trail];
    });
  };

  const removeFavoriteTrail = (trailId: string) => {
    setFavoriteTrails(prev => prev.filter(trail => trail.id !== trailId));
  };

  // In a real app, we would fetch this data from an API or local storage
  useEffect(() => {
    // This would be where we'd initialize data from localStorage or API
    const initializeAppState = async () => {
      // For now, we're not doing anything here
    };
    
    initializeAppState();
  }, []);

  return (
    <AppStateContext.Provider 
      value={{ 
        isMobile, 
        selectedPet, 
        recentHikes, 
        favoriteTrails,
        setSelectedPet,
        addFavoriteTrail,
        removeFavoriteTrail
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

// Hook for easy context use
export function useAppState() {
  const context = useContext(AppStateContext);
  
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  
  return context;
}