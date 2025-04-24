import { useState } from 'react';
import { useSession } from '../../context/AuthContext';
import { usePets } from '../../hooks/usePets';

export const PetFormWithQuery = () => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const { userId } = useSession();
  
  // Use our React Query hook
  const { 
    data: pets = [], 
    isLoading, 
    isError, 
    create, 
    refetch 
  } = usePets();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !name) return;
    
    try {
      await create.mutateAsync({ 
        name,
        breed: breed || undefined,
        age: age || undefined
      });
      
      // Reset form
      setName('');
      setBreed('');
      setAge('');
      
    } catch (error: any) {
      console.error('Error adding pet:', error.message);
    }
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Add a New Pet</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Pet Name*</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700">Breed</label>
          <input
            id="breed"
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            min="0"
          />
        </div>
        <button
          type="submit"
          disabled={create.isPending || !name || !userId}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {create.isPending ? 'Adding...' : 'Add Pet'}
        </button>
        {create.isError && (
          <p className="mt-4 text-sm text-red-600">
            Error adding pet: {create.error?.message || 'Unknown error'}
          </p>
        )}
        {create.isSuccess && (
          <p className="mt-4 text-sm text-green-600">Pet added successfully!</p>
        )}
      </form>
      
      <div className="p-4 border rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Pets</h2>
          <button 
            onClick={() => refetch()}
            disabled={isLoading}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
        
        {isLoading ? (
          <p className="text-gray-500">Loading pets...</p>
        ) : isError ? (
          <p className="text-red-500">Error loading pets</p>
        ) : pets.length === 0 ? (
          <p className="text-gray-500">No pets yet. Add your first pet above!</p>
        ) : (
          <ul className="space-y-2">
            {pets.map(pet => (
              <li key={pet.id} className="p-3 bg-gray-50 rounded-md">
                <div className="font-medium">{pet.name}</div>
                {pet.breed && <div className="text-sm text-gray-600">Breed: {pet.breed}</div>}
                {pet.age && <div className="text-sm text-gray-600">Age: {pet.age} years</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}; 