'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import withAuth from '@/components/hoc/withAuth';
import { Header } from '@/components/ui/Header';
import type { Event } from '@/types';
import { useAuthStore } from '@/lib/stores/authStore';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const userId = useAuthStore.getState().user?.id || 'defaultUserId';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/events?organizerId=${userId}`);
        setEvents(res.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch events");
        console.error(err);
      }
    };

    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  const handleDelete = async (eventId: string) => {
    if (confirm('Excluir este evento?')) {
      try {
        await api.delete(`/my-events/${eventId}`);
        const res = await api.get(`/my-events?organizerId=${userId}`);
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to delete event', err);
      }
    }
  };

  return (
    <>
      <Header />
      <Section className='pt-3'>
        <Card>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
              >
                {'<'}
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