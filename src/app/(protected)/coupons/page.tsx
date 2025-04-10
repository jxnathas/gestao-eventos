'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Section } from '@/components/ui/Section';
import withAuth from '@/components/hoc/withAuth';
import { Header } from '@/components/ui/Header';

type Coupon = {
  id?: number;
  code: string;
  discount: number;
  validUntil: string;
};

function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    api.get('/coupons').then((res) => setCoupons(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = Object.fromEntries(formData);

    if (currentCoupon?.id) {
      await api.patch(`/coupons/${currentCoupon.id}`, payload);
    } else {
      await api.post('/coupons', payload);
    }
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <>
      <Header />
      <Section className="pt-3">
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={currentCoupon ? 'Editar Cupom' : 'Criar Cupom'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="code" label="Código" defaultValue={currentCoupon?.code} required />
            <Input
              name="discount"
              type="number"
              label="Desconto (%)"
              defaultValue={currentCoupon?.discount}
              required
            />
            <Input
              name="validUntil"
              type="date"
              label="Válido até"
              defaultValue={currentCoupon?.validUntil}
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Salvar
            </Button>
          </form>
        </Modal>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
              >
                {'<'}
              </Button>
              <h1 className="text-2xl font-semibold">Cupons</h1>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              setCurrentCoupon(null);
              setIsModalOpen(true);
            }}
          >
            Criar Cupom
          </Button>

          <DataTable
            headers={['Código', 'Desconto', 'Validade', 'Ações']}
            data={coupons.map((coupon) => [
              coupon.code,
              `${coupon.discount}%`,
              new Date(coupon.validUntil).toLocaleDateString(),
              <div key={coupon.id} className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentCoupon(coupon);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm('Excluir este cupom?')) {
                      api.delete(`/coupons/${coupon.id}`).then(() => window.location.reload());
                    }
                  }}
                >
                  Excluir
                </Button>
              </div>,
            ])}
          />
        </Card>
      </Section>
    </>
  );
}

export default withAuth(CouponsPage);