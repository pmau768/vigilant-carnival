import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, User, Award, Route, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { Pet } from '../types';

const ProfileTabPage: React.FC = () => {
  console.log('ProfileTabPage rendering');
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data
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
      weight: 42,
      energyLevel: 'High',
      photo: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=1600',
      totalDistance: 32,
      totalHikes: 8
    },
    {
      id: '3',
      name: 'Buddy',
      breed: 'Golden Retriever',
      age: 6,
      weight: 70,
      energyLevel: 'Medium',
      photo: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1600',
      totalDistance: 28,
      totalHikes: 7
    }
  ];
  
  useEffect(() => {
    console.log('ProfileTabPage useEffect running');
    setIsLoading(true);
    // In a real app, we would fetch pets data from API
    // For now, use mock data
    setPets(mockPets);
    setIsLoading(false);
  }, []);
  
  const handleAddPet = () => {
    console.log('Add pet clicked');
    alert('Add pet functionality would go here');
  };
  
  const handlePetSelect = (petId: string) => {
    console.log('Selected pet:', petId);
    navigate(`/pet/${petId}`);
  };
  
  // Simplified test version
  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader title="Pet Profiles" />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">Pet Profiles Page</h1>
        
        <Button onClick={handleAddPet} className="mb-4">
          Add New Pet
        </Button>
        
        <div className="space-y-4">
          {pets.map(pet => (
            <div 
              key={pet.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow cursor-pointer"
              onClick={() => handlePetSelect(pet.id)}
            >
              <div className="flex items-center">
                <img 
                  src={pet.photo} 
                  alt={pet.name} 
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold">{pet.name}</h3>
                  <p>{pet.breed} • {pet.age} years</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileTabPage;