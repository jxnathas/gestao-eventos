'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Section } from '@/components/ui/Section';
import api from '@/lib/api/api';
import { useEffect, useState } from 'react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events').then((res) => setEvents(res.data));
  }, []);

  const deleteEvent = (id: number) => {
    api.delete(`/events/${id}`).then(() => {
      setEvents(events.filter((event) => event.id !== id));
    });
  };

  return (
    <Section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Eventos</h1>
        <Button variant="primary" href="/events/create">
          Criar Evento
        </Button>
      </div>
      <Card>
        <DataTable
          headers={['Nome', 'Data', 'Ações']}
          data={events.map((event) => [
            event.name,
            new Date(event.date).toLocaleDateString(),
            <div key={event.id} className="flex gap-2">
              <Button variant="ghost" href={`/events/edit/${event.id}`}>
                Editar
              </Button>
              <Button variant="ghost" onClick={() => deleteEvent(event.id)}>
                Excluir
              </Button>
            </div>,
          ])}
        />
      </Card>
    </Section>
  );
}