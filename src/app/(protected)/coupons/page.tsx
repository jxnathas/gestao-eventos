'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Section } from '@/components/ui/Section';
import withAuth from '@/components/hoc/withAuth';
import { Header } from '@/components/ui/Header';
import { useAuthStore } from '@/lib/stores/authStore';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/lib/api/couponsApi';
import type { Coupon } from '@/types';

function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = useAuthStore.getState().user?.id || 'defaultUserId';

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const fetchedCoupons = await fetchCoupons({ organizerId: userId });
        setCoupons(fetchedCoupons);
        setError(null);
      } catch (err) {
        setError('Failed to fetch coupons');
        console.error(err);
      }
    };

    if (userId) {
      loadCoupons();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = Object.fromEntries(formData) as unknown as Omit<Coupon, 'id' | 'createdAt'>;

    try {
      if (currentCoupon?.id) {
        await updateCoupon(currentCoupon.id, payload);
      } else {
        await createCoupon({ ...payload, organizerId: userId });
      }
      setIsModalOpen(false);
      const updatedCoupons = await fetchCoupons({ organizerId: userId });
      setCoupons(updatedCoupons);
    } catch (err) {
      console.error('Failed to save coupon', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir este cupom?')) {
      try {
        await deleteCoupon(id);
        const updatedCoupons = await fetchCoupons({ organizerId: userId });
        setCoupons(updatedCoupons);
      } catch (err) {
        console.error('Failed to delete coupon', err);
      }
    }
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
              type="text"
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
                  size="small"
                  onClick={() => {
                    setCurrentCoupon(coupon);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handleDelete(coupon.id)}
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