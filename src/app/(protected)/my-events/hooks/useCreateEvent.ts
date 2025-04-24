import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createEvent, uploadBanner } from '@/lib/api/eventsApi';
import { createSectors } from '@/lib/api/sectorsApi';
import { createLot } from '@/lib/api/lotsApi';
import { useDynamicFormItems } from '../hooks/useDynamicFormItems';
import { defaultSector, defaultLot } from '../components/Form/eventFormConfig';
import { EventLot } from '@/types/events';

export function useCreateEvent(userId: string) {
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

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const bannerFile = formData.get('banner') as File;
      let bannerUrl = '';

      if (bannerFile && bannerFile.size > 0) {
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

      const sectorPromises = sectors.map((sector) =>
        createSectors({
          ...sector,
          id: uuidv4(),
          eventId: createdEvent.id,
        })
      );

      await Promise.all(sectorPromises);

      const lotPromises = lotes.map((lot) =>
        createLot({
          ...lot,
          eventId: createdEvent.id,
          id: uuidv4(),
        } as EventLot)
      );

      await Promise.all(lotPromises);

      window.location.href = `/my-events`;
    } catch (err) {
      console.error('Failed to create event', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    sectors,
    lotes,
    addSector,
    updateSector,
    removeSector,
    addLot,
    updateLot,
    removeLot,
    handleSubmit,
  };
}