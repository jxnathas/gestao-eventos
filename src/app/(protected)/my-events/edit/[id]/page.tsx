'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Header } from '@/components/ui/Header';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import withAuth from '@/components/hoc/withAuth';
import { useAuthStore } from '@/lib/stores/authStore';
import Link from 'next/link';
import type { Event, Sector, EventLot } from '@/types';
import api from '@/lib/api/api';
import { FormItemContainer } from '../../components/Form/FormItemContainer';
import { FormSection } from '../../components/Form/FormSection';
import { useDynamicFormItems } from '../../hooks/useDynamicFormItems';

import {
  eventFields,
  sectorFields,
  lotFields,
  defaultSector,
  defaultLot
} from '../../components/Form/eventFormConfig';


function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const userId = useAuthStore.getState().user?.id || 'defaultUserId';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<Event | null>(null);

  const {
    items: sectors,
    addItem: addSector,
    updateItem: updateSector,
    removeItem: removeSector,
    setItems: setSectors
  } = useDynamicFormItems<Sector>([], defaultSector);

  const {
    items: lotes,
    addItem: addLot,
    updateItem: updateLot,
    removeItem: removeLot,
    setItems: setLotes
  } = useDynamicFormItems<EventLot>([], defaultLot);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        setEventData(res.data);
        setSectors(res.data.sectors || []);
        setLotes(res.data.lotes || []);
      } catch (err) {
        console.error('Failed to fetch event', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, setSectors, setLotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const bannerFile = formData.get('banner') as File;
      let bannerUrl = eventData?.bannerUrl || '';
  
      if (bannerFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', bannerFile);
        const uploadResponse = await api.post('/upload', uploadFormData);
        bannerUrl = uploadResponse.data.url;
      }
  
      const eventPayload = {
        name: formData.get('name'),
        date: formData.get('date'),
        location: formData.get('location'),
        description: formData.get('description'),
        bannerUrl,
        organizerId: userId,
        sectors: sectors.map(s => ({
          id: s.id && typeof s.id === 'string' && s.id.startsWith('temp-') ? undefined : s.id,
          name: s.name,
          capacity: Number(s.capacity),
          price: Number(s.price),
          description: s.description,
        })),
        lotes: lotes.map(l => ({
          id: l.id && typeof l.id === 'string' && l.id.startsWith('temp-') ? undefined : l.id,
          name: l.name,
          startDate: l.startDate,
          endDate: l.endDate,
          discount: Number(l.discount),
          price: Number(l.price),
          isActive: Boolean(l.isActive),
        })),
      };
  
      await api.patch(`/events/${eventId}`, eventPayload);
      window.location.href = `/my-events`;
    } catch (err) {
      console.error('Failed to update event', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (
    field: { name: string; label: string; type: string; required?: boolean; step?: string },
    value: any,
    onChange: (value: any) => void,
    fullWidth = false
  ) => (
    <div className={fullWidth ? 'md:col-span-4' : ''}>
      <Input
        label={field.label}
        value={value}
        onChange={e => onChange(field.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        type={field.type as any}
        required={field.required}
        step={field.step} 
        name={field.name}      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Evento não encontrado</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <Card className="max-w-3/4 mx-auto mt-8 p-6 shadow-lg">
          <Section className="py-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/my-events">
                <Button variant="ghost">{'<'}</Button>
              </Link>
              <h1 className="text-2xl font-semibold">Editar Evento</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Section className="w-full">
                {eventFields.map(field => (
                  <Input
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.type as any}
                    required={field.required}
                    accept={field.type === 'file' ? 'image/*' : undefined}
                    defaultValue={
                      field.type === 'datetime-local' && eventData[field.name as keyof Event]
                        ? new Date(eventData[field.name as keyof Event] as string).toISOString().slice(0, 16)
                        : eventData[field.name as keyof Event]
                    }
                  />
                ))}
              </Section>

              <FormSection title="Setores" onAdd={() => addSector(defaultSector)}>
                {sectors.map((sector, index) => (
                  <FormItemContainer 
                    key={`sector-${sector.id || index}`}
                    onRemove={() => removeSector(index)}
                  >
                    {sectorFields.map(field => (
                      <div 
                        key={`sector-${sector.id}-${field.name}`}
                        className={field.name === 'description' ? 'md:col-span-4' : ''}
                      >
                        {renderField(
                          field,
                          sector[field.name as keyof Sector],
                          (value) => updateSector(index, field.name as keyof Sector, value),
                          field.name === 'description'
                        )}
                      </div>
                    ))}
                  </FormItemContainer>
                ))}
              </FormSection>

              <FormSection title="Lotes" onAdd={() => addLot(defaultLot)}>
                {lotes.map((lot, index) => (
                  <FormItemContainer 
                    key={`lot-${lot.id}-${index}`}
                    onRemove={() => removeLot(index)}
                  >
                    {lotFields.map(field => (
                      <div key={`lot-${lot.id}-${field.name}`}>
                        {renderField(
                          field,
                          lot[field.name as keyof EventLot],
                          (value) => updateLot(index, field.name as keyof EventLot, value)
                        )}
                      </div>
                    ))}
                  </FormItemContainer>
                ))}
              </FormSection>

              <Section className="flex gap-2">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Link href={`/my-events/${eventId}`}>
                  <Button type="button" variant="secondary">
                    Cancelar
                  </Button>
                </Link>
              </Section>
            </form>
          </Section>
        </Card>
      </Container>
    </>
  );
}

export default withAuth(EditEventPage);