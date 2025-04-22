import { useState, useEffect } from 'react';
import { Pet } from '../types';
import { getPets, getPet } from '../utils/api';

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
    totalDistance: 36.7,
    totalHikes: 12,
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Border Collie',
    age: 3,
    weight: 45,
    energyLevel: 'High',
    photo: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    totalDistance: 42.5,
    totalHikes: 14,
  },
  {
    id: '3',
    name: 'Max',
    breed: 'Belgian Malinois',
    age: 5,
    weight: 65,
    energyLevel: 'High',
    healthIssues: [],
    photo: 'https://images.pexels.com/photos/2853422/pexels-photo-2853422.jpeg?auto=compress&cs=tinysrgb&w=1600',
    totalDistance: 45,
    totalHikes: 12,
  },
];

export function useAllPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // In a real app, this would fetch pets from the API
        // const fetchedPets = await getPets();
        // setPets(fetchedPets);
        
        // For demo purposes, use mock data
        setPets(mockPets);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading pets:', err);
        setError('Failed to load pets');
        // Use mock data as fallback
        setPets(mockPets);
        setIsLoading(false);
      }
    };

    fetchPets();
  }, []);

  return { pets, isLoading, error };
}

export function usePet(petId: string | undefined) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) {
      setIsLoading(false);
      return;
    }
    
    const fetchPet = async () => {
      try {
        // In a real app, this would fetch the pet from the API
        // const fetchedPet = await getPet(petId);
        // setPet(fetchedPet);
        
        // For demo purposes, find the pet in mock data
        const foundPet = mockPets.find(p => p.id === petId);
        if (foundPet) {
          setPet(foundPet);
        } else {
          setError('Pet not found');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error(`Error loading pet ${petId}:`, err);
        setError('Failed to load pet');
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  return { pet, isLoading, error };
}