'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api/api';

interface CheckoutSector {
  sectorId: string;
  name: string;
  quantity: number;
  price?: number;
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [event, setEvent] = useState<{ id: string; name: string } | null>(null);
  const [sectors, setSectors] = useState<CheckoutSector[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    const eventId = searchParams.get('event');
    const sectorsParam = searchParams.get('sectors');

    if (!eventId || !sectorsParam) {
      console.error('Missing event or sectors data in query params.');
      return;
    }

    try {
      const parsedSectors: CheckoutSector[] = JSON.parse(decodeURIComponent(sectorsParam));

      const fetchEventAndSectors = async () => {
        try {
          const eventResponse = await api.get(`/events/${eventId}`);
          setEvent(eventResponse.data);

          const updatedSectors = await Promise.all(
            parsedSectors.map(async (sector) => {
              const sectorResponse = await api.get(`/sectors/${sector.sectorId}`);
              return {
                ...sector,
                name: sectorResponse.data.name,
                price: sectorResponse.data.price,
              };
            })
          );

          setSectors(updatedSectors);

          const total = updatedSectors.reduce(
            (sum, sector) => sum + (sector.price || 0) * sector.quantity,
            0
          );
          setTotalPrice(total);

          const existingOrderResponse = await api.get(`/orders`, {
            params: { eventId, sectors: JSON.stringify(parsedSectors) },
          });

          if (existingOrderResponse.data.length > 0) {
            const existingOrder = existingOrderResponse.data[0];
            setOrderId(existingOrder.id);
            setOrderStatus(existingOrder.status);
          }
        } catch (error) {
          console.error('Failed to fetch event, sector, or order data:', error);
        }
      };

      fetchEventAndSectors();
    } catch (error) {
      console.error('Failed to parse sectors data:', error);
    }
  }, [searchParams]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Por favor, insira um código de cupom');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const response = await api.post('/coupons', {
        couponCode,
        eventId: event?.id,
        totalPrice
      });

      if (response.data.valid) {
        const discountAmount = response.data.discountAmount;
        const newTotal = totalPrice - discountAmount;
        
        setDiscountedPrice(newTotal);
        setCouponSuccess(`Cupom aplicado! Desconto de R$ ${discountAmount.toFixed(2)}`);
      } else {
        setCouponError(response.data.message || 'Cupom inválido ou expirado');
      }
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      setCouponError('Erro ao aplicar cupom. Tente novamente.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setDiscountedPrice(null);
    setCouponCode('');
    setCouponError(null);
    setCouponSuccess(null);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Por favor, selecione um método de pagamento.');
      return;
    }

    try {
      let currentOrderId = orderId;

      if (!currentOrderId) {
        console.log('Creating order...');
        const orderResponse = await api.post('/orders', {
          eventId: event?.id,
          sectors,
          totalPrice: discountedPrice || totalPrice,
          couponCode: couponSuccess ? couponCode : null
        });

        console.log('Order Response:', orderResponse.data);
        currentOrderId = orderResponse.data.id;
        setOrderId(currentOrderId);

        if (!currentOrderId) {
          throw new Error('Order ID is missing in the response.');
        }
      }

      if (selectedPaymentMethod === 'pix') {
        console.log('Initiating PIX payment...');
        window.location.href = `/checkout/pix?order=${currentOrderId}`;
      } else {
        alert('Método de pagamento ainda não implementado.');
      }
    } catch (error) {
      console.error('Failed to process order or payment:', error);
      alert('Ocorreu um erro ao processar o pagamento. Tente novamente.');
    }
  };

  if (!event || sectors.length === 0) {
    return (
      <Container className="py-12">
        <div className="text-center">
          <p>Carregando informações do checkout...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-6">Resumo da Compra</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{event.name}</h2>
        <ul className="space-y-4">
          {sectors.map((sector) => (
            <li key={sector.sectorId} className="flex justify-between">
              <span>{sector.name} (x{sector.quantity})</span>
              <span>R$ {(sector.quantity * (sector.price || 0)).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
          <span>Total:</span>
          <span>R$ {totalPrice.toFixed(2)}</span>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cupom de Desconto</h2>
        <div className="flex gap-2 mb-2">
          <Input
            type="text"
            placeholder="Insira seu cupom"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1" label={''} name={''}          />
          <Button
            onClick={applyCoupon}
            disabled={isApplyingCoupon || !couponCode.trim()}
          >
            {isApplyingCoupon ? 'Aplicando...' : 'Aplicar'}
          </Button>
        </div>
        {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
        {couponSuccess && (
          <div className="flex justify-between items-center mt-2">
            <p className="text-green-500 text-sm">{couponSuccess}</p>
            <Button variant="ghost" size="small" onClick={removeCoupon}>
              Remover
            </Button>
          </div>
        )}
      </Card>

      {discountedPrice !== null && (
        <Card className="p-6 mb-6 bg-green-50">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total com desconto:</span>
            <div className="text-right">
              <span className="line-through text-gray-500 mr-2">R$ {totalPrice.toFixed(2)}</span>
              <span className="text-green-600 font-bold text-xl">R$ {discountedPrice.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>
        <div className="space-y-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedPaymentMethod === 'pix'
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-primary'
            }`}
            onClick={() => setSelectedPaymentMethod('pix')}
          >
            <span className="font-medium">PIX</span>
          </div>
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedPaymentMethod === 'credit-card'
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-primary'
            }`}
            onClick={() => setSelectedPaymentMethod('credit-card')}
          >
            <span className="font-medium">Cartão de Crédito (Em breve)</span>
          </div>
        </div>
      </Card>

      <Button
        variant="primary"
        className="w-full"
        onClick={handlePayment}
        disabled={!selectedPaymentMethod}
      >
        Confirmar Pagamento
      </Button>
    </Container>
  );
}