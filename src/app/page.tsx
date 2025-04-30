"use client"
import React, { useEffect, useState } from 'react';
import { EventCard } from '@/components/features/events/EventCard';
import { Header } from '@/components/ui/Header';
import type { Event } from '@/types';
import { Container } from '@/components/ui/Container';
import Spinner from '@/components/ui/Spinner';
import { fetchEvents } from '@/lib/api/eventsApi';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await fetchEvents({});
        setEvents(eventsData);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <>
      <Header isHome />
      <Container className="py-8 bg-white">
        <h1 className="text-3xl font-bold text-center mb-8">Eventos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center">
              <Spinner />
            </div>
          ) : events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              Nenhum evento encontrado.
            </div>
          )}
        </div>
      </Container>
    </>
  );
}