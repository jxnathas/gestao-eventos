'use client';
import { Input } from '@/components/ui/Input';
import { Header } from '@/components/ui/Header';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import withAuth from '@/components/hoc/withAuth';
import { useAuthStore } from '@/lib/stores/authStore';
import Link from 'next/link';
import { useState } from 'react';
import { FormItemContainer } from '../components/Form/FormItemContainer';
import { FormSection } from '../components/Form/FormSection';
import { useDynamicFormItems } from '../hooks/useDynamicFormItems';
import { Button } from "../../../../components/ui/Button";
import { FaArrowLeft } from "react-icons/fa";
import { createEvent, uploadBanner } from '@/lib/api/eventsApi';
import { createSectors } from '@/lib/api/sectorsApi';
import { createLot } from '@/lib/api/lotsApi';
import {
  eventFields,
  sectorFields,
  lotFields,
  defaultSector,
  defaultLot
} from '../components/Form/eventFormConfig';
import { v4 as uuidv4 } from 'uuid';
import { EventLot } from '@/types/events';


function CreateEventPage() {
  const userId = useAuthStore.getState().user?.id || 'defaultUserId';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    items: sectors,
    addItem: addSector,
    updateItem: updateSector,
    removeItem: removeSector,
  } = useDynamicFormItems([], defaultSector);

  const {
    items: lotes,
    addItem: addLot,
    updateItem: updateLot,
    removeItem: removeLot,
  } = useDynamicFormItems([], defaultLot);

  console.log('Sectors:', sectors);
  console.log('Lotes:', lotes);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const bannerFile = formData.get('banner') as File;
      let bannerUrl = '';

      if (bannerFile.size > 0) {
        bannerUrl = await uploadBanner(bannerFile);
      }

      const eventPayload = {
        id: uuidv4(),
        name: formData.get('name') as string,
        date: formData.get('date') as string,
        location: formData.get('location') as string,
        description: formData.get('description') as string,
        bannerUrl,
        organizerId: userId,
        createdAt: new Date().toISOString(),
      };

      const createdEvent = await createEvent(eventPayload);

      const sectorPromises = sectors.map((sector) => {
        console.log('Creating sector:', sector);
        return createSectors({
          ...sector,
          id: uuidv4(),
          eventId: createdEvent.id,
        });
      });

      try {
        await Promise.all(sectorPromises);
      } catch (error) {
        alert('Failed to create sectors. Please try again.');
      }

      const lotPromises = lotes.map(async (lot) => {
        console.log('Creating lot:', lot);
        const response = await createLot({
          ...lot,
          eventId: createdEvent.id,
          id: uuidv4(),
        } as EventLot);
        return response;
      });

      try {
        await Promise.all(lotPromises);
      } catch (error) {
        alert('Failed to create lots. Please try again.');
      }

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
                <Button variant="ghost"><FaArrowLeft/></Button>
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
                        sector[field.name as keyof typeof sector],
                        (value) => updateSector(index, field.name as keyof typeof sector, value),
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
                        lot[field.name as keyof typeof lot],
                        (value) => updateLot(index, field.name as keyof typeof lot, value)
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