import { useEffect, useState } from 'react';
import { getHikeAnalysis, generateHikeAnalysis } from '../utils/api';
import { HikeAnalysis } from '../models/HikeAnalysis';

export function useHikeAnalysis(hikeId: string | undefined) {
  const [analysis, setAnalysis] = useState<HikeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hikeId) return;
    
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        
        // First try to get existing analysis
        try {
          const existingAnalysis = await getHikeAnalysis(hikeId);
          if (existingAnalysis) {
            setAnalysis(existingAnalysis);
            return;
          }
        } catch (e) {
          // Analysis doesn't exist yet, continue to generate one
        }
        
        // If no analysis exists, generate a new one
        const newAnalysis = await generateHikeAnalysis(hikeId);
        setAnalysis(newAnalysis);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [hikeId]);

  return { analysis, loading, error };
} 