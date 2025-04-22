import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PawPrint } from 'lucide-react';
import Button from '../ui/Button';
import { Pet } from '../../types';

const formSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  breed: z.string().min(1, 'Breed is required'),
  age: z.coerce.number().min(0, 'Age must be a positive number'),
  weight: z.coerce.number().min(0, 'Weight must be a positive number'),
  energyLevel: z.enum(['Low', 'Medium', 'High']),
  healthIssues: z.string().optional(),
  photo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PetProfileFormProps {
  pet?: Pet;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const PetProfileForm: React.FC<PetProfileFormProps> = ({ pet, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pet?.name || '',
      breed: pet?.breed || '',
      age: pet?.age || 0,
      weight: pet?.weight || 0,
      energyLevel: pet?.energyLevel || 'Medium',
      healthIssues: pet?.healthIssues?.join(', ') || '',
      photo: pet?.photo || '',
    },
  });

  const handleFormSubmit = (data: FormData) => {
    // Convert comma-separated health issues to array
    const formattedData = {
      ...data,
      healthIssues: data.healthIssues ? data.healthIssues.split(',').map(issue => issue.trim()) : [],
    };
    onSubmit(formattedData);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <PawPrint className="h-6 w-6 text-emerald-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">
          {pet ? 'Edit Pet Profile' : 'Create Pet Profile'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Pet Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Buddy"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
              Breed
            </label>
            <input
              id="breed"
              type="text"
              {...register('breed')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Golden Retriever"
              disabled={isLoading}
            />
            {errors.breed && (
              <p className="mt-1 text-sm text-red-600">{errors.breed.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age (years)
            </label>
            <input
              id="age"
              type="number"
              step="0.1"
              {...register('age')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., 3.5"
              disabled={isLoading}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (lbs)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              {...register('weight')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., 45.5"
              disabled={isLoading}
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="energyLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Energy Level
          </label>
          <select
            id="energyLevel"
            {...register('energyLevel')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            disabled={isLoading}
          >
            <option value="Low">Low - Prefers relaxed, shorter walks</option>
            <option value="Medium">Medium - Enjoys regular activity</option>
            <option value="High">High - Needs lots of exercise</option>
          </select>
          {errors.energyLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.energyLevel.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="healthIssues" className="block text-sm font-medium text-gray-700 mb-1">
            Health Issues (Separate with commas)
          </label>
          <textarea
            id="healthIssues"
            {...register('healthIssues')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., Joint pain, Allergies"
            rows={2}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
            Photo URL
          </label>
          <input
            id="photo"
            type="text"
            {...register('photo')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="e.g., https://example.com/pet-photo.jpg"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" type="button" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            {pet ? 'Update Profile' : 'Create Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PetProfileForm;