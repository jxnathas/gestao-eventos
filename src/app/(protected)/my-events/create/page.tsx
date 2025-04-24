'use client';
import { Header } from '@/components/ui/Header';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import withAuth from '@/components/hoc/withAuth';
import { useAuthStore } from '@/lib/stores/authStore';
import { CreateEventForm } from '../components/Form/CreateEventForm';
import { useCreateEvent } from '../hooks/useCreateEvent';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

function CreateEventPage() {
  const userId = useAuthStore.getState().user?.id || 'defaultUserId';
  const {
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
  } = useCreateEvent(userId);

  return (
    <>
      <Header />
      <Container>
        <Card className="max-w-3/4 mx-auto mt-8 p-6 shadow-lg">
          <Section className="py-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/my-events">
                <Button variant="ghost">
                  <FaArrowLeft />
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold">Criar Evento</h1>
            </div>

            <CreateEventForm
              isSubmitting={isSubmitting}
              sectors={sectors}
              lotes={lotes}
              addSector={addSector}
              updateSector={updateSector}
              removeSector={removeSector}
              addLot={addLot}
              updateLot={updateLot}
              removeLot={removeLot}
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget as HTMLFormElement);
                handleSubmit(formData);
              }}
            />
          </Section>
        </Card>
      </Container>
    </>
  );
}

export default withAuth(CreateEventPage);