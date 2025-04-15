'use client';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api/api';

export default function PixPaymentPage({ searchParams }) {
  const [paymentData, setPaymentData] = useState(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const generatePix = async () => {
      const response = await api.post('/payments/pix', {
        orderId: searchParams.order,
        amount: 100.00
      });
      setPaymentData(response.data);
    };

    generatePix();
  }, [searchParams.order]);

  useEffect(() => {
    if (!paymentData) return;

    const timer = setTimeout(() => {
      setPaid(true);
      api.patch(`/orders/${searchParams.order}`, { status: 'paid' });
    }, 15000);

    return () => clearTimeout(timer);
  }, [paymentData]);

  return (
    <div className="max-w-md mx-auto text-center">
      {paid ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-600">Pagamento Aprovado!</h2>
          <p>Seus ingressos foram reservados com sucesso.</p>
          <Button href="/user/tickets" variant="primary">
            Ver Ingressos
          </Button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Pagamento via PIX</h2>
          {paymentData && (
            <>
              <div className="p-4 bg-white rounded-lg mb-4">
                <QRCode 
                  value={paymentData.qrCode} 
                  size={256} 
                  className="mx-auto"
                />
              </div>
              <div className="mb-6">
                <p className="font-medium mb-2">Ou copie o código:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="p-2 bg-gray-100 rounded">
                    {paymentData.code}
                  </code>
                  <Button 
                    size="sm" 
                    onClick={() => navigator.clipboard.writeText(paymentData.code)}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </>
          )}
          <p className="text-sm text-gray-500">
            O ingresso será reservado por 30 minutos até a confirmação do pagamento.
          </p>
        </>
      )}
    </div>
  );
}