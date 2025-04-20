'use client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import api from '@/lib/api/api';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Event, Sector } from '@/types/events';
import React from 'react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { notFound } from 'next/navigation';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const { id } = React.use(params);
  const [selectedQuantity, setSelectedQuantity] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await api.get(`/events/${id}`);
        setEvent(eventResponse.data);

        const sectorsResponse = await api.get(`/sectors?eventId=${id}`);
        setSectors(sectorsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar evento:', error);
        notFound();
      }
    };

    fetchEventData();
  }, [id]);

  if (!event) {
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              window.location.href = '/';
            }}
            className="flex items-center gap-2"
          >
            <FaArrowLeft /> Voltar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
            <Image
              src={event.bannerUrl || '/default-event.jpg'}
              alt={event.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
          <p className="text-gray-500 mb-4 flex items-center gap-2">
            <FaCalendarAlt />{' '}
            {new Date(event.date).toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-gray-500 mb-4 flex items-center gap-2">
            <FaMapMarkerAlt /> {event.location}
          </p>

          <div className="prose max-w-none">
            <p>{event.description}</p>
          </div>
        </div>

        <Card className="p-6 self-start sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Ingressos</h2>

          <div className="space-y-4 mb-6">
            {sectors.map((sector) => (
              <div
                key={sector.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedSector === sector.id
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-primary'
                }`}
                onClick={() => setSelectedSector(sector.id)}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{sector.name}</h3>
                  <span>R$ {sector.price}</span>
                </div>
                {selectedSector === sector.id && (
                  <div className="mt-3">
                    <label className="block text-sm mb-2">Quantidade:</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          setSelectedQuantity((prev) => ({
                            ...prev,
                            [sector.id]: Math.max((prev[sector.id] || 1) - 1, 1),
                          }))
                        }
                        disabled={(selectedQuantity[sector.id] || 1) <= 1}
                      >
                        -
                      </Button>
                      <span className="text-lg">{selectedQuantity[sector.id] || 1}</span>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          setSelectedQuantity((prev) => ({
                            ...prev,
                            [sector.id]: Math.min(
                              (prev[sector.id] || 1) + 1,
                              sector.capacity - (sector.sold ?? 0)
                            ),
                          }))
                        }
                        disabled={
                          (selectedQuantity[sector.id] || 1) >=
                          (sector.capacity - (sector.sold ?? 0))
                        }
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Disponível: {sector.capacity - (sector.sold ?? 0)} ingressos
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <ButtonLink
            href={`/checkout?event=${event.id}&sectors=${encodeURIComponent(
              JSON.stringify(
                Object.entries(selectedQuantity)
                  .filter(([, quantity]) => quantity > 0)
                  .map(([sectorId, quantity]) => {
                    const sector = sectors.find((s) => s.id === sectorId);
                    return {
                      sectorId,
                      name: sector?.name || 'Setor Desconhecido',
                      quantity,
                    };
                  })
              )
            )}`}
            variant="primary"
            className="w-full"
            disabled={
              !selectedSector ||
              Object.values(selectedQuantity).every((quantity) => quantity === 0)
            }
          >
            Comprar Ingressos
          </ButtonLink>
        </Card>
      </div>
    </Container>
  );
}