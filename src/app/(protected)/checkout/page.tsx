'use client';

import withAuth from "@/components/hoc/withAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api/api";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(null);
  const [sector, setSector] = useState(null);

  useEffect(() => {
    const eventId = params.get('eventId');
    const sectorId = params.get('sectorId');
    
    if (eventId && sectorId) {
      api.get(`/events/${eventId}`).then(res => {
        setEvent(res.data);
        setSector(res.data.sectors.find(s => s.id === sectorId));
      });
    }
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await api.post('/tickets', {
        eventId: event.id,
        sectorId: sector.id,
        status: 'paid'
      });
      
      await api.patch(`/events/${event.id}/sectors/${sector.id}`, {
        sold: sector.sold + 1
      });

      router.push(`/checkout/success?ticketId=${new Date().getTime()}`);
    } finally {
      setLoading(false);
    }
  };

  if (!event || !sector) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="max-w-md mx-auto p-6 mt-8">
      <h1 className="text-xl font-bold mb-4">Resumo da Compra</h1>
      
      <div className="space-y-2 mb-6">
        <p><strong>Evento:</strong> {event.name}</p>
        <p><strong>Setor:</strong> {sector.name}</p>
        <p><strong>Valor:</strong> R$ {sector.price.toFixed(2)}</p>
      </div>

      <Button 
        onClick={handlePayment}
        loading={loading}
        className="w-full"
      >
        Confirmar Pagamento
      </Button>
    </Card>
  );
}

export default withAuth(CheckoutPage);