import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PetCard from '../components/pet/PetCard';
import PetProfileForm from '../components/pet/PetProfileForm';
import Button from '../components/ui/Button';
import PageHeader from '../components/layout/PageHeader';
import { Pet } from '../types';
import { getPets, createPet, updatePet, deletePet } from '../utils/api';

const PetsPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | undefined>(undefined);
  
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
    {
      id: '3',
      name: 'Max',
      breed: 'Labrador',
      age: 7,
      weight: 75,
      energyLevel: 'Medium',
      healthIssues: ['Arthritis', 'Allergies'],
      photo: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];
  
  useEffect(() => {
    // In a real app, this would fetch pets from the API
    // loadPets();
    setPets(mockPets);
  }, []);
  
  const loadPets = async () => {
    setIsLoading(true);
    try {
      const fetchedPets = await getPets();
      setPets(fetchedPets);
    } catch (error) {
      console.error('Error loading pets:', error);
      // Use mock data as fallback
      setPets(mockPets);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreatePet = async (data: any) => {
    setIsLoading(true);
    try {
      // In a real app, this would create a pet in the API
      // const newPet = await createPet(data);
      // setPets([...pets, newPet]);
      
      // For demo purposes, we'll just simulate it
      const newPet: Pet = {
        id: `${Date.now()}`,
        ...data,
      };
      setPets([...pets, newPet]);
      setShowForm(false);
      setSelectedPet(undefined);
    } catch (error) {
      console.error('Error creating pet:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdatePet = async (data: any) => {
    if (!selectedPet) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would update a pet in the API
      // const updatedPet = await updatePet(selectedPet.id, data);
      
      // For demo purposes, we'll just simulate it
      const updatedPet: Pet = {
        ...selectedPet,
        ...data,
      };
      
      setPets(pets.map(pet => pet.id === selectedPet.id ? updatedPet : pet));
      setShowForm(false);
      setSelectedPet(undefined);
    } catch (error) {
      console.error('Error updating pet:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeletePet = async (petId: string) => {
    if (confirm('Are you sure you want to delete this pet profile?')) {
      setIsLoading(true);
      try {
        // In a real app, this would delete a pet from the API
        // await deletePet(petId);
        
        // For demo purposes, we'll just simulate it
        setPets(pets.filter(pet => pet.id !== petId));
      } catch (error) {
        console.error('Error deleting pet:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setShowForm(true);
  };
  
  const handleSelectPet = (pet: Pet) => {
    alert(`Selected ${pet.name} for a hiking adventure!`);
  };
  
  const handleNewPet = () => {
    setSelectedPet(undefined);
    setShowForm(true);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setSelectedPet(undefined);
  };

  const headerRightContent = (
    !showForm && (
      <Button
        onClick={handleNewPet}
        icon={<Plus className="h-5 w-5" />}
        size="sm"
      >
        Add Pet
      </Button>
    )
  );

  return (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageHeader 
        title={showForm ? (selectedPet ? "Edit Pet" : "Add New Pet") : "Pet Profiles"} 
        showBackButton={showForm}
        rightContent={headerRightContent}
        backTo="/pets"
      />
      
      <div className="max-w-lg mx-auto px-4 py-4">
        {showForm ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 dark:border dark:border-gray-700">
            <PetProfileForm
              pet={selectedPet}
              onSubmit={selectedPet ? handleUpdatePet : handleCreatePet}
              isLoading={isLoading}
            />
            <div className="mt-4 text-center">
              <button
                onClick={handleCancel}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
              >
                Cancel and go back
              </button>
            </div>
          </div>
        ) : (
          <>
            {pets.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg dark:border dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Pets Added Yet</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add your first pet to get started with personalized trail recommendations.
                </p>
                <Button
                  onClick={handleNewPet}
                  icon={<Plus className="h-5 w-5" />}
                >
                  Add New Pet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {pets.map(pet => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    onEdit={handleEditPet}
                    onDelete={handleDeletePet}
                    onSelect={handleSelectPet}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PetsPage;