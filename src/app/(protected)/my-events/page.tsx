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
import { Header } from '@/components/ui/Header';
import type { Event } from '@/types';
import { useAuthStore } from '@/lib/stores/authStore';

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
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
    const updatedEvents = await api.get(`/events?organizerId=${userId}`);
    setEvents(updatedEvents.data);
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <Section className='pt-3'>
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
              required />
            <Input
              name="description"
              label="Descrição"
              type="textarea"
              defaultValue={currentEvent?.description} />
            <Input
              name="location"
              label="Localização"
              defaultValue={currentEvent?.location} />
            <Input
              name="organizerId"
              type="hidden"
              label=''
              defaultValue={userId} />
            <Button type="submit" variant="primary" className="w-full">
              Salvar
            </Button>
            </form>
        </Modal>

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

          <Button
              variant="primary"
              onClick={() => {
            setCurrentEvent(null);
            setIsModalOpen(true);
              } }
            >
              Criar Evento
            </Button>

          <DataTable
            headers={['Nome', 'Data', 'Ações']}
            data={events.map((event) => [
              event.name,
              new Date(event.date).toLocaleString(),
              <div key={event.id} className="flex gap-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    setCurrentEvent(event);
                    setIsModalOpen(true);
                  } }
                >
                  Editar
                </Button>

                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    if (confirm('Excluir este evento?')) {
                      api.delete(`/events/${event.id}`).then(() => window.location.reload());
                    }
                  } }
                >
                  Excluir
                </Button>
              </div>,
            ])} />
        </Card>
      </Section>
    </>
  );
}

export default withAuth(EventsPage);