'use client';
import { Header } from '@/components/ui/Header';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import withAuth from '@/components/hoc/withAuth';
import { useAuthStore } from '@/lib/stores/authStore';
import { EditEventForm } from '../../components/Form/EditEventForm';
import { eventFields, sectorFields, lotFields } from '../../components/Form/eventFormConfig';
import { useEditEvent } from '../../hooks/useEditEvent';

function EditEventPage() {
  const userId = useAuthStore.getState().user?.id || '';
  const {
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
  } = useEditEvent(userId);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!eventData) {
    return <div>Evento não encontrado</div>;
  }

  return (
    <>
      <Header />
      <Container>
        <Card>
          <EditEventForm
            eventFields={eventFields}
            sectorFields={sectorFields}
            lotFields={lotFields}
            eventData={eventData}
            sectors={sectors}
            lotes={lotes}
            addSector={addSector}
            updateSector={updateSector}
            removeSector={removeSector}
            addLot={addLot}
            updateLot={updateLot}
            removeLot={removeLot}
            isSubmitting={isSubmitting}
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget as HTMLFormElement);
              handleSubmit(formData);
            }}
          />
        </Card>
      </Container>
    </>
  );
}

export default withAuth(EditEventPage);