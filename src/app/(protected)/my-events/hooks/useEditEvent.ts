import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchEvents, updateEvent, uploadBanner } from '@/lib/api/eventsApi';
import { fetchSectors, createSectors, updateSectors as updateSectorsApi } from '@/lib/api/sectorsApi';
import { fetchLots, createLot, updateLot as updateLotApi } from '@/lib/api/lotsApi';
import type { Event, Sector, EventLot } from '@/types';
import { useDynamicFormItems } from './useDynamicFormItems';

export function useEditEvent(userId: string) {
  const params = useParams();
  const eventId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<Event | null>(null);

  const {
    items: sectors,
    addItem: addSector,
    updateItem: updateSector,
    removeItem: removeSector,
    setItems: setSectors,
  } = useDynamicFormItems<Sector>([], { id: '', name: '', description: '' });

  const {
    items: lotes,
    addItem: addLot,
    updateItem: updateLot,
    removeItem: removeLot,
    setItems: setLotes,
  } = useDynamicFormItems<EventLot>([], { id: '', name: '', price: 0 });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const [event] = await fetchEvents({ id: eventId });
        setEventData(event);

        const [sectorsRes, lotsRes] = await Promise.all([
          fetchSectors({ eventId }),
          fetchLots({ eventId }),
        ]);

        setSectors(sectorsRes);
        setLotes(lotsRes);
      } catch (err) {
        console.error('Failed to fetch event data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, setSectors, setLotes]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const bannerFile = formData.get('banner') as File;
      let bannerUrl = eventData?.bannerUrl || '';

      if (bannerFile && bannerFile.size > 0) {
        bannerUrl = await uploadBanner(bannerFile);
      }

      const eventPayload = {
        name: formData.get('name'),
        date: formData.get('date'),
        location: formData.get('location'),
        description: formData.get('description'),
        bannerUrl,
        organizerId: userId,
      };

      await updateEvent(eventId, eventPayload);

      const sectorPromises = sectors.map((sector) =>
        sector.id
          ? updateSectorsApi(sector.id, sector)
          : createSectors({ ...sector, eventId })
      );
      await Promise.all(sectorPromises);

      const lotPromises = lotes.map((lot) =>
        lot.id
          ? updateLotApi(lot.id, lot)
          : createLot({ ...lot, eventId })
      );
      await Promise.all(lotPromises);

      window.location.href = `/my-events`;
    } catch (err) {
      console.error('Failed to update event', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLoading,
    isSubmitting,
    eventData,
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