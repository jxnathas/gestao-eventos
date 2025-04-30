import { useState, useEffect } from 'react';
import { fetchEvents } from '@/lib/api/eventsApi';
import { Event } from '@/types/events';

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const [fetchedEvent] = await fetchEvents({ id: eventId });
        setEvent(fetchedEvent);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setError('Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  return { event, loading, error };
}