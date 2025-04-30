import { useState, useEffect } from 'react';
import { fetchSectors } from '@/lib/api/sectorsApi';
import { Sector } from '@/types/sector';

export function useSectors(eventId: string) {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSectors = async () => {
      try {
        setLoading(true);
        const fetchedSectors = await fetchSectors({ eventId });
        setSectors(fetchedSectors);
      } catch (err) {
        console.error('Failed to fetch sectors:', err);
        setError('Failed to fetch sectors');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadSectors();
    }
  }, [eventId]);


  return { sectors, loading, error };
}