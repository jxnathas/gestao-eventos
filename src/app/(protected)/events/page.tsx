'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Section } from '@/components/ui/Section';
import withAuth from '@/components/hoc/withAuth';

type Event = {
  id?: number;
  name: string;
  date: string;
  description: string;
  lotes: Array<{
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    discount: number;
  }>;
};

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  useEffect(() => {
    api.get('/events').then((res) => setEvents(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = Object.fromEntries(formData);

    if (currentEvent?.id) {
      await api.patch(`/events/${currentEvent.id}`, payload);
    } else {
      await api.post('/events', payload);
    }
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <Section>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEvent ? 'Editar Evento' : 'Criar Evento'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" label="Nome" defaultValue={currentEvent?.name} required />
          <Input
            name="date"
            type="datetime-local"
            label="Data e Hora"
            defaultValue={currentEvent?.date}
            required
          />
          <Input
            name="description"
            label="Descrição"
            as="textarea"
            defaultValue={currentEvent?.description}
          />
          <Button type="submit" variant="primary" className="w-full">
            Salvar
          </Button>
        </form>
      </Modal>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Eventos</h1>
        <Button
          variant="primary"
          onClick={() => {
            setCurrentEvent(null);
            setIsModalOpen(true);
          }}
        >
          Criar Evento
        </Button>
      </div>

      <Card>
        <DataTable
          headers={['Nome', 'Data', 'Ações']}
          data={events.map((event) => [
            event.name,
            new Date(event.date).toLocaleString(),
            <div key={event.id} className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentEvent(event);
                  setIsModalOpen(true);
                }}
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Excluir este evento?')) {
                    api.delete(`/events/${event.id}`).then(() => window.location.reload());
                  }
                }}
              >
                Excluir
              </Button>
            </div>,
          ])}
        />
      </Card>
    </Section>
  );
}

export default withAuth(EventsPage);