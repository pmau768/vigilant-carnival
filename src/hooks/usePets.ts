import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services';
import { useSession } from '../context/AuthContext';

interface Pet {
  id: string;
  name: string;
  breed?: string;
  age?: number;
  avatar_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface CreatePetPayload {
  name: string;
  breed?: string;
  age?: number;
}

export const usePets = () => {
  const qc = useQueryClient();
  const { userId } = useSession();

  const list = useQuery({
    queryKey: ['pets', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Pet[];
    },
    enabled: !!userId
  });

  const create = useMutation({
    mutationFn: async (payload: CreatePetPayload) => {
      if (!userId) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('pets')
        .insert([
          { 
            ...payload,
            user_id: userId 
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      return data as Pet;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets'] })
  });

  return { ...list, create };
}; 