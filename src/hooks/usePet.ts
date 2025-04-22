import useSWR from 'swr';
import { getPet, updatePet as apiUpdatePet } from '../utils/api';
import { Pet } from '../models/Pet';

export function usePetSWR(id: string | undefined) {
  const { data, error, mutate } = useSWR<Pet>(
    id ? `/pets/${id}` : null, 
    id ? () => getPet(id) : null
  );

  const updatePet = async (updates: Partial<Pet>) => {
    if (!id) return;
    await apiUpdatePet(id, updates);
    mutate();
  };

  return {
    pet: data,
    isLoading: !data && !error,
    isError: !!error,
    updatePet,
  };
}

// Keep the original name for backward compatibility
export const usePet = usePetSWR; 