import { useState } from 'react';
import { supabase } from '../../services';
import { useSession } from '../../context/AuthContext';

interface Pet {
  id: string;
  name: string;
  breed?: string;
  age?: number;
  avatar_url?: string;
}

export const PetForm = () => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const { userId } = useSession();
  
  const loadPets = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setPets(data || []);
    } catch (error: any) {
      setMessage(`Error loading pets: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setMessage('You must be logged in to add a pet');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase
        .from('pets')
        .insert([
          { 
            name,
            breed: breed || null,
            age: age || null,
            user_id: userId
          }
        ]);
        
      if (error) throw error;
      
      setMessage('Pet added successfully!');
      setName('');
      setBreed('');
      setAge('');
      
      // Reload pets
      loadPets();
    } catch (error: any) {
      setMessage(`Error adding pet: ${error.message}`);
    } finally {
      setIsLoading(false);
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
          disabled={isLoading || !name || !userId}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Pet'}
        </button>
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </form>
      
      <div className="p-4 border rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Pets</h2>
          <button 
            onClick={loadPets}
            disabled={isLoading || !userId}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
        
        {pets.length === 0 ? (
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