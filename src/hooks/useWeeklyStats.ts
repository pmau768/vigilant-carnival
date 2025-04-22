import useSWR from 'swr';
import { getHikes } from '../utils/api';

interface WeeklyStats {
  miles: number;
  hikes: number;
  paceAvg: number;
}

export function useWeeklyStats(petId: string | undefined) {
  const { data, error } = useSWR<WeeklyStats>(
    petId ? `/pets/${petId}/stats?period=week` : null,
    async () => {
      // Since we don't have a real API endpoint for stats yet, 
      // we'll compute them from the hikes data
      if (!petId) throw new Error('No pet ID provided');
      
      const hikes = await getHikes(petId);
      
      // Filter hikes from the last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weeklyHikes = hikes.filter(hike => 
        new Date(hike.date) >= weekAgo
      );
      
      // Calculate stats
      const miles = weeklyHikes.reduce((sum, hike) => sum + hike.distance, 0);
      const totalMinutes = weeklyHikes.reduce((sum, hike) => sum + hike.duration, 0);
      
      return {
        miles,
        hikes: weeklyHikes.length,
        paceAvg: miles > 0 && totalMinutes > 0 ? totalMinutes / miles : 0
      };
    }
  );

  return {
    stats: data,
    isLoading: !data && !error,
    isError: !!error,
  };
} 