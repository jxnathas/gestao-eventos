import React, { useState, useEffect } from 'react';
import { Form } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCoupons } from '../hooks/useCoupons';
import { Coupon } from '@/types';
import { Select } from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';

interface CouponFormProps {
  currentCoupon: Coupon | null;
  selectedEvent: { id: string; name: string } | null;
  onSubmit: (e: React.FormEvent) => void;
  userId: string;
  setSelectedEvent: (event: { id: string; name: string } | null) => void;
  setCurrentCoupon: (coupon: Coupon | null) => void;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  currentCoupon,
  selectedEvent,
  onSubmit,
  userId,
  setSelectedEvent,
  setCurrentCoupon,
}) => {
  const [code, setCode] = useState(currentCoupon?.code || '');
  const [discount, setDiscount] = useState(currentCoupon?.discount || 0);
  const [validUntil, setValidUntil] = useState(currentCoupon?.validUntil || '');
  const [isGlobal, setIsGlobal] = useState(false);
  const { coupons } = useCoupons(userId);

  useEffect(() => {
    setCode(currentCoupon?.code || '');
    setDiscount(currentCoupon?.discount || 0);
    setValidUntil(currentCoupon?.validUntil || '');
    setIsGlobal(currentCoupon?.eventId === 'global');
  }, [currentCoupon]);

  const events = coupons.map((coupon) => ({
    id: coupon.eventId || '',
    name: coupon.code,
  })).filter((event, index, self) =>
    event.id && self.findIndex((e) => e.id === event.id) === index
  );

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();

        if (!code || !discount || !validUntil || (!isGlobal && !selectedEvent?.id)) {
          alert('Preencha todos os campos obrigatórios antes de salvar o cupom.');
          return;
        }

        onSubmit({
          code,
          discount,
          validUntil,
          eventId: isGlobal ? 'global' : selectedEvent?.id || '',
          isGlobal,
        });
      }}
    >
      <Input
        label="Código do Cupom"
        name="code"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <Input
        label="Desconto (%)"
        name="discount"
        type="number"
        value={discount.toString()}
        onChange={(e) => setDiscount(Number(e.target.value))}
        required
      />
      <Input
        label="Validade"
        name="validUntil"
        type="datetime-local"
        value={validUntil}
        onChange={(e) => setValidUntil(e.target.value)}
        required
      />
      <Toggle
        checked={isGlobal}
        onChange={(checked) => {
          setIsGlobal(checked);
          if (checked) {
            setSelectedEvent(null);
          }
        }}
      />
      {!isGlobal && (
        <Select
          id="event"
          label="Evento"
          options={events}
          value={selectedEvent}
          onChange={(event) => setSelectedEvent(event)}
          placeholder="Selecione um evento"
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
        />
      )}
      <Button type="submit" variant="primary" className="mt-4">
        {currentCoupon ? 'Salvar' : 'Criar'}
      </Button>
    </Form>
  );
};