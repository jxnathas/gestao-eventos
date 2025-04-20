'use client';
import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import withAuth from '@/components/hoc/withAuth';
import { Header } from '@/components/ui/Header';
import { Section } from '@/components/ui/Section';
import { useAuthStore } from '@/lib/stores/authStore';
import { fetchEvents, deleteEvent } from '@/lib/api/eventsApi';
import Link from 'next/link';
import type { Event } from '@/types';

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const userId = useAuthStore.getState().user?.id || 'defaultUserId';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents({ organizerId: userId });
        setEvents(fetchedEvents);
        setError(null);
      } catch (err) {
        setError('Failed to fetch events');
        console.error(err);
      }
    };

    if (userId) {
      loadEvents();
    }
  }, [userId]);

  const handleDelete = async (eventId: string) => {
    if (confirm('Excluir este evento?')) {
      try {
        await deleteEvent(eventId);
        const updatedEvents = await fetchEvents({ organizerId: userId });
        setEvents(updatedEvents);
      } catch (err) {
        console.error('Failed to delete event', err);
      }
    }
  };

  return (
    <>
      <Header />
      <Section className="pt-3">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
                className="flex items-center gap-2"
              >
                <FaArrowLeft />
              </Button>
              <h1 className="text-2xl font-semibold">Eventos</h1>
            </div>
          </div>

          <Link href="/my-events/create">
            <Button variant="primary" className="mb-4">
              Criar Evento
            </Button>
          </Link>

          <DataTable
            headers={['Nome', 'Data', 'Ações']}
            data={events.map((event) => [
              event.name,
              new Date(event.date).toLocaleString(),
              <div key={event.id} className="flex gap-2">
                <Link href={`/my-events/edit/${event.id}`}>
                  <Button variant="ghost" size="small">
                    Editar
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handleDelete(event.id)}
                >
                  Excluir
                </Button>
              </div>,
            ])}
          />
        </Card>
      </Section>
    </>
  );
}

export default withAuth(EventsPage);