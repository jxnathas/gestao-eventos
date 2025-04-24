import { useState, useEffect } from 'react';
import { fetchEvents, deleteEvent } from '@/lib/api/eventsApi';
import type { Event } from '@/types';

export function useEvents(organizerId: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents({ organizerId });
        setEvents(fetchedEvents);
        setError(null);
      } catch (err) {
        setError('Failed to fetch events');
        console.error(err);
      }
    };

    if (organizerId) {
      loadEvents();
    }
  }, [organizerId]);

  const handleDelete = async (eventId: string) => {
    if (confirm('Excluir este evento?')) {
      try {
        await deleteEvent(eventId);
        const updatedEvents = await fetchEvents({ organizerId });
        setEvents(updatedEvents);
      } catch (err) {
        console.error('Failed to delete event', err);
      }
    }
  };

  return { events, error, handleDelete };
}