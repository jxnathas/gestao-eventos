'use client';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/Button';
import { useSearchParams } from 'next/navigation';
import { useCreateTickets } from '../hooks/useCreateTickets';
import { socket } from '@/lib/socket/socket';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { useLoadingStore } from '@/lib/stores/useLoadingStore';

export default function PixPaymentPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [paymentData, setPaymentData] = useState<{ qrCode: string; code: string } | null>(null);
  const [paid, setPaid] = useState(false);
  const { createTickets, isCreating, error } = useCreateTickets();
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    if (!orderId) {
      console.error('Order ID is missing in the query parameters.');
      return;
    }

    console.log('Order ID:', orderId);

    const generatePix = () => {
      const mockPaymentData = {
        qrCode: `https://example.com/pix/${orderId}`,
        code: `PIX-${orderId}`,
      };
      setPaymentData(mockPaymentData);
    };

    generatePix();
  }, [orderId]);

  useEffect(() => {
    if (!paymentData || !orderId || paid) return;

    const timer = setTimeout(() => {
      setPaid(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [paymentData, orderId, paid]);

  useEffect(() => {
    if (!orderId || !paid) return;

    const handlePaymentApproved = async () => {
      await createTickets(orderId);
    };

    socket.on('payment_approved', handlePaymentApproved);

    return () => {
      socket.off('payment_approved', handlePaymentApproved);
    };
  }, [orderId, createTickets, paid]);

  useEffect(() => {
    if (paid) {
      createTickets(orderId);
    }
  }, [paid, orderId, createTickets]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  }, [setLoading]);

  if (!orderId) {
    return (
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold text-red-600">Erro</h2>
        <p>O ID do pedido está ausente. Por favor, tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center">
      {paid ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-600">Pagamento Aprovado!</h2>
          <p>Seus ingressos foram reservados com sucesso.</p>
          {error && <p className="text-red-500">{error}</p>}
          <ButtonLink href="/customer/tickets" variant="primary" disabled={isCreating}>
            {isCreating ? 'Criando Ingressos...' : 'Ver Ingressos'}
          </ButtonLink>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Pagamento via PIX</h2>
          {paymentData ? (
            <>
              <div className="p-4 bg-white rounded-lg mb-4">
                <QRCode value={paymentData.qrCode} size={256} className="mx-auto" />
              </div>
              <div className="mb-6">
                <p className="font-medium mb-2">Ou copie o código:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="p-2 bg-gray-100 rounded">{paymentData.code}</code>
                  <Button
                    size="small"
                    onClick={() => navigator.clipboard.writeText(paymentData.code)}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p>Gerando QR Code do PIX...</p>
          )}
          <p className="text-sm text-gray-500">
            O ingresso será reservado por 30 minutos até a confirmação do pagamento.
          </p>
        </>
      )}
    </div>
  );
}