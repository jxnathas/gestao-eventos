"use client"
import React, { useEffect, useState } from 'react';
import { EventCard } from '@/components/features/events/EventCard';
import { Header } from '@/components/ui/Header';
import type { Event } from '@/types';
import { Container } from '@/components/ui/Container';
import api from '@/lib/api/api';
import Spinner from '@/components/ui/Spinner';

export default function Home() {
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
          <Spinner />
        </div>
      </Container>
    );
  }

  return (
    <>
    <Header isHome />
    <Container className="py-8 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8">Eventos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </Container>
    </>
  );
}
