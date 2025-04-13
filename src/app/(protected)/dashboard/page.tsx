'use client';
import { useAuthStore } from '@/lib/stores/authStore';
import { useEffect, useState } from 'react';
import api from '@/lib/api/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import withAuth from '@/components/hoc/withAuth';
import { ButtonLink } from '@/components/ui/ButtonLink';
import Spinner from '@/components/ui/Spinner';
import { Event } from '@/types';

function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <Spinner className="flex items-center justify-center h-screen" />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bem-vindo, {user?.name || 'Administrador'}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <QuickActionsSection />
        <RecentEventsSection />
      </div>
    </div>
  );
}

const QuickActionsSection = () => (
  <Card className="p-6">
    <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
    <div className="grid grid-cols-2 gap-3">
      <Button variant="ghost" href="/events/create" className="h-24">
        Criar Evento
      </Button>
      <Button variant="ghost" href="/coupons/create" className="h-24">
        Gerar Cupom
      </Button>
      <Button variant="ghost" href="/reports" className="h-24">
        Ver Relatórios
      </Button>
      <Button variant="ghost" href="/settings" className="h-24">
        Configurações
      </Button>
    </div>
  </Card>
);

const RecentEventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events?_limit=3').then((res) => {
      setEvents(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Eventos Recentes</h2>
        <ButtonLink variant="ghost" href="/my-events" size="small">
          Ver Todos
        </ButtonLink>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {events
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border-b">
          <div>
            <h3 className="font-medium">{event.name}</h3>
            <p className="text-sm text-gray-500">
              {new Date(event.date).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <ButtonLink variant="ghost" size="small" href={`/event/${event.id}`}>
            Detalhes
          </ButtonLink>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
};

export default withAuth(DashboardPage);
