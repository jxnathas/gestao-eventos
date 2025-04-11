'use client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import api from '@/lib/api/api';
import { notFound } from 'next/navigation';
import router from 'next/router';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Event } from '@/types/events';
import React from 'react';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const { id } = React.use(params);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}?_embed=sectors`);
        setEvent(response.data);
      } catch (error) {
        console.error('Erro ao carregar evento:', error);
        notFound();
      }
    };

    fetchEvent();
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
            <Image
              src={event.bannerUrl || '/default-event.jpg'}
              alt={event.name}
              fill
              className="object-cover"
            />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
          <p className="text-gray-500 mb-4">
            📅 {new Date(event.date).toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-gray-500 mb-4">📍 {event.location}</p>
          
          <div className="prose max-w-none">
            <p>{event.description}</p>
          </div>
        </div>

        <Card className="p-6 self-start sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Ingressos</h2>
          
          <div className="space-y-4 mb-6">
            {event.sectors?.map((sector) => (
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
                  <span>R$ {sector.price.toFixed(2)}</span>
                </div>
                {selectedSector === sector.id && (
                  <div className="mt-3">
                    <label className="block text-sm mb-2">Quantidade:</label>
                    <select className="w-full p-2 border rounded">
                      {[...Array(10).keys()].map((num) => (
                        <option key={num} value={num + 1}>
                          {num + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button 
            variant="primary" 
            className="w-full"
            disabled={!selectedSector}
            onClick={() => router.push(`/checkout?event=${event.id}&sector=${selectedSector}`)}
          >
            Comprar Ingresso
          </Button>
        </Card>
      </div>
    </Container>
  );
}