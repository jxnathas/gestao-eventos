'use client';
import api from '@/lib/api/api';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import type { Event } from '@/types';

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

const EventCard = ({ event }: { event: Event }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <div className="relative h-48">
      <Image
        src={event.bannerUrl || '/default-event.jpg'}
        alt={event.name}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
      <p className="text-gray-500 mb-1">
        📅 {new Date(event.date).toLocaleDateString('pt-BR')}
      </p>
      <p className="text-gray-500 mb-3">📍 {event.location}</p>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Setores:</h3>
        <div className="space-y-2">
          {event.sectors?.map((sector) => (
            <div key={sector.id} className="flex justify-between">
              <span>{sector.name}</span>
              <span>R$ {sector.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        href={`/event/${event.id}`}
        variant="primary"
        className="w-full"
      >
        Ver Detalhes
      </Button>
    </div>
  </Card>
);