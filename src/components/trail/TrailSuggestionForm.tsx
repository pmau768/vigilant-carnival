import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Loader } from 'lucide-react';
import Button from '../ui/Button';
import { suggestTrails } from '../../utils/api';
import { TrailSuggestion } from '../../types';
import { useAllPets } from '../../hooks/usePetData';

const formSchema = z.object({
  petId: z.string().min(1, 'Pet selection is required'),
  location: z.string().min(1, 'Location is required'),
});

type FormData = z.infer<typeof formSchema>;

interface TrailSuggestionFormProps {
  onSuggestionsReceived: (suggestions: TrailSuggestion[]) => void;
}

const TrailSuggestionForm: React.FC<TrailSuggestionFormProps> = ({ onSuggestionsReceived }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { pets } = useAllPets();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petId: '',
      location: '',
    },
  });

  const selectedPetId = watch('petId');
  const selectedPet = pets.find(pet => pet.id === selectedPetId);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!selectedPet) {
        throw new Error('Selected pet not found');
      }
      
      const suggestions = await suggestTrails(selectedPet.breed, data.location);
      onSuggestionsReceived(suggestions);
    } catch (err) {
      console.error('Error fetching trail suggestions:', err);
      setError('Unable to fetch trail suggestions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="petId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Your Pet
        </label>
        <select
          id="petId"
          {...register('petId')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 focus:border-emerald-500 dark:focus:border-amber-500 dark:bg-gray-700 dark:text-white"
          disabled={isLoading}
        >
          <option value="">Select a pet</option>
          {pets.map(pet => (
            <option key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</option>
          ))}
        </select>
        {errors.petId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.petId.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Location
        </label>
        <div className="relative">
          <input
            id="location"
            type="text"
            {...register('location')}
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-amber-500 focus:border-emerald-500 dark:focus:border-amber-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Portland, OR or Yosemite National Park"
            disabled={isLoading}
          />
          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        {errors.location && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.message}</p>
        )}
      </div>
      
      {/* Selected pet info */}
      {selectedPet && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-100 dark:border-emerald-900">
          <div className="flex items-center">
            {selectedPet.photo ? (
              <img
                src={selectedPet.photo}
                alt={selectedPet.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 mr-3"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-emerald-200 dark:bg-emerald-700 flex items-center justify-center mr-3">
                <PawPrint className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              </div>
            )}
            <div>
              <p className="font-medium text-emerald-800 dark:text-emerald-300">{selectedPet.name}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Finding trails perfect for a {selectedPet.breed} with {selectedPet.energyLevel.toLowerCase()} energy
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">{error}</div>
      )}
      
      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Finding Trails...' : 'Find Trails'}
      </Button>
    </form>
  );
};

export default TrailSuggestionForm;