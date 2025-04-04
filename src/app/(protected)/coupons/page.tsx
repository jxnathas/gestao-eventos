'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Section } from '@/components/ui/Section';
import api from '@/lib/api/api';
import { useState, useEffect } from 'react';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    api.get('/coupons').then((res) => setCoupons(res.data));
  }, []);

  return (
    <Section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Cupons</h1>
        <Button variant="primary" href="/coupons/create">
          Criar Cupom
        </Button>
      </div>
      <Card>
        <DataTable
          headers={['Código', 'Desconto', 'Validade', 'Ações']}
          data={coupons.map((coupon) => [
            coupon.code,
            `${coupon.discount}%`,
            new Date(coupon.validUntil).toLocaleDateString(),
            <Button
              key={coupon.id}
              variant="ghost"
              size="sm"
              onClick={() => api.delete(`/coupons/${coupon.id}`).then(() => window.location.reload())}
            >
              Excluir
            </Button>,
          ])}
        />
      </Card>
    </Section>
  );
}