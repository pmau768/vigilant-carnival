import useSWR from 'swr';
import { getPets } from '../utils/api';
import { Pet } from '../models/Pet';

export function usePets() {
  const { data, error, mutate } = useSWR<Pet[]>('/pets', getPets);

  return {
    pets: data || [],
    isLoading: !data && !error,
    isError: !!error,
    refresh: mutate,
  };
} 