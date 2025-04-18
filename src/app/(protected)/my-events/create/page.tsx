'use client';
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
import { useState } from 'react';
import { FormItemContainer } from '../components/Form/FormItemContainer';
import { FormSection } from '../components/Form/FormSection';
import { useDynamicFormItems } from '../hooks/useDynamicFormItems';
import { Button } from "../../../../components/ui/Button";

import {
  eventFields,
  sectorFields,
  lotFields,
  defaultSector,
  defaultLot
} from '../components/Form/eventFormConfig';


function CreateEventPage() {
  const userId = useAuthStore.getState().user?.id || 'defaultUserId';
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    items: sectors,
    addItem: addSector,
    updateItem: updateSector,
    removeItem: removeSector,
  } = useDynamicFormItems<Sector>([], defaultSector);

  const {
    items: lotes,
    addItem: addLot,
    updateItem: updateLot,
    removeItem: removeLot,
  } = useDynamicFormItems<EventLot>([], defaultLot);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const bannerFile = formData.get('banner') as File;
      let bannerUrl = '';
  
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
      };
  
      const eventResponse = await api.post('/events', eventPayload);
      const eventId = eventResponse.data.id;
  

      const sectorPromises = sectors.map((sector) =>
        api.post('/sectors', {
          ...sector,
          eventId,
        })
      );
      await Promise.all(sectorPromises);
  
      const lotPromises = lotes.map((lot) =>
        api.post('/lots', {
          ...lot,
          eventId,
        })
      );
      await Promise.all(lotPromises);
  
      window.location.href = `/my-events`;
    } catch (err) {
      console.error('Failed to create event', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderField = (
    field: { name: string; label: string; type: string; required?: boolean; step?: string },
    value: any,
    onChange: (value: any) => void,
    fullWidth = false
  ) => (
    <div key={field.name} className={fullWidth ? 'md:col-span-4' : ''}>
      <Input
        label={field.label}
        value={value}
        onChange={e => onChange(field.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        type={field.type as any}
        required={field.required}
        step={field.step}
        name={field.name}
      />
    </div>
  );

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
              <h1 className="text-2xl font-semibold">Criar Evento</h1>
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
                  />
                ))}
              </Section>

              <FormSection title="Setores" onAdd={addSector}>
                {sectors.map((sector, index) => (
                  <FormItemContainer key={sector.id} onRemove={() => removeSector(index)}>
                    {sectorFields.map(field =>
                      renderField(
                        field,
                        sector[field.name as keyof Sector],
                        (value) => updateSector(index, field.name as keyof Sector, value),
                        field.name === 'description'
                      )
                    )}
                  </FormItemContainer>
                ))}
              </FormSection>

              <FormSection title="Lotes" onAdd={addLot}>
                {lotes.map((lot, index) => (
                  <FormItemContainer key={lot.id} onRemove={() => removeLot(index)}>
                    {lotFields.map(field =>
                      renderField(
                        field,
                        lot[field.name as keyof EventLot],
                        (value) => updateLot(index, field.name as keyof EventLot, value)
                      )
                    )}
                  </FormItemContainer>
                ))}
              </FormSection>

              <Section className="flex gap-2">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Evento'}
                </Button>
                <Link href="/my-events">
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

export default withAuth(CreateEventPage);