'use client';
import api from '@/lib/api/api';
import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import type { Event } from '@/types';
import { EventCard } from '@/components/features/events/EventCard';

export default function PublicEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events?_embed=sectors');
        setEvents(response.data);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Container className="py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Eventos Disponíveis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </Container>
  );
}