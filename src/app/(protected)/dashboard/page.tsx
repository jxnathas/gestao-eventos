'use client';
import { useAuthStore } from '@/lib/stores/authStore';
import { useEffect, useState } from 'react';
import api from '@/lib/api/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import withAuth from '@/components/hoc/withAuth';
import { Header } from '@/components/ui/Header';
import { socket } from '@/lib/socket/socket';

type DashboardMetrics = {
  totalEvents: number;
  activeEvents: number;
  ticketsSold: number;
  revenue: number;
};

function DashboardPage() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleTicketSold = (data: any) => {
      setMetrics(prev => ({
        ...prev!,
        ticketsSold: (prev?.ticketsSold || 0) + data.quantity,
        revenue: (prev?.revenue || 0) + (data.quantity * data.price)
      }));
    };
  
    socket.on('ticket_sold', handleTicketSold);
  
    return () => {
      socket.off('ticket_sold', handleTicketSold);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header />
      <h1 className="text-2xl font-bold">Bem-vindo, {user?.name || 'Administrador'}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Eventos Totais" 
          value={metrics?.totalEvents || 0}
          icon="🎭"
        />
        <MetricCard
          title="Eventos Ativos"
          value={metrics?.activeEvents || 0}
          icon="🔛"
        />
        <MetricCard
          title="Ingressos Vendidos"
          value={metrics?.ticketsSold || 0}
          icon="🎟️"
        />
        <MetricCard
          title="Receita Total"
          value={`R$ ${(metrics?.revenue || 0).toLocaleString('pt-BR')}`}
          icon="💰"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <QuickActionsSection />
        <RecentEventsSection />
      </div>
    </div>
  );
}

const MetricCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </Card>
);

const QuickActionsSection = () => (
  <Card className="p-6">
    <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" href="/events/create" className="h-24">
        Criar Evento
      </Button>
      <Button variant="outline" href="/coupons/create" className="h-24">
        Gerar Cupom
      </Button>
      <Button variant="outline" href="/reports" className="h-24">
        Ver Relatórios
      </Button>
      <Button variant="outline" href="/settings" className="h-24">
        Configurações
      </Button>
    </div>
  </Card>
);

const RecentEventsSection = () => {
  const [events, setEvents] = useState<any[]>([]);
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
        <Button variant="ghost" href="/events" size="sm">
          Ver Todos
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 border-b">
              <div>
                <h3 className="font-medium">{event.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Button variant="ghost" size="sm" href={`/events/${event.id}`}>
                Detalhes
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default withAuth(DashboardPage);