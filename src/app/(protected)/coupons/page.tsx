'use client';
import { useState } from 'react';
import { useCoupons } from './hooks/useCoupons';
import { useCouponHandlers } from './hooks/useCouponHandlers';
import { CouponForm } from './components/CouponForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Section } from '@/components/ui/Section';
import { Header } from '@/components/ui/Header';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuthStore } from '@/lib/stores/authStore';
import { useNavigation } from '@/lib/utils/navigation';
import withAuth from '@/components/hoc/withAuth';
import { Coupon } from '@/types';
import toast from 'react-hot-toast';

function CouponsPage() {
  const userId = useAuthStore.getState().user?.id || 'defaultUserId';
  const [selectedEvent, setSelectedEvent] = useState<{ id: string; name: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  const {
    isModalOpen,
    setIsModalOpen,
    currentCoupon,
    setCurrentCoupon,
    handleSubmit,
    handleDelete,
  } = useCouponHandlers(userId);

  const { coupons } = useCoupons(userId);
  const { navigateTo } = useNavigation();

  const handleOpenModal = (coupon: any = null) => {
    setCurrentCoupon(coupon || null);
    setSelectedEvent(
      coupon
        ? { id: coupon.eventId || '', name: coupon.eventName || 'Nenhum evento' }
        : { id: '', name: 'Nenhum evento' }
    );
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!couponToDelete) return;
    try {
      await handleDelete(couponToDelete.id);
      toast.success('Cupom deletado com sucesso!');
    } catch (err) {
      toast.error('Erro ao deletar cupom.');
    } finally {
      setIsDeleteModalOpen(false);
      setCouponToDelete(null);
    }
  };

  const confirmDeleteCoupon = (coupon: Coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <Header />
      <Section className="pt-3">
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentCoupon(null);
            setSelectedEvent(null);
          }}
          title={currentCoupon ? 'Editar Cupom' : 'Criar Cupom'}
        >
          <CouponForm
            currentCoupon={currentCoupon}
            selectedEvent={selectedEvent}
            onSubmit={(couponData) => handleSubmit(couponData)}
            userId={userId}
            setSelectedEvent={setSelectedEvent}
            setCurrentCoupon={setCurrentCoupon}
          />
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCouponToDelete(null);
          }}
          title="Confirmar exclusão"
        >
          <p className="mb-4">Tem certeza que deseja excluir o cupom <strong>{couponToDelete?.code}</strong>?</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Confirmar
            </Button>
          </div>
        </Modal>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigateTo('/dashboard')}
                className="flex items-center gap-2"
              >
                <FaArrowLeft />
              </Button>
              <h1 className="text-2xl font-semibold">Cupons</h1>
            </div>
          </div>

          <div className="mb-4 flex justify-start">
            <Button
              variant="primary"
              onClick={() => handleOpenModal()}
            >
              Criar Cupom
            </Button>
          </div>

          <DataTable
            headers={['Código', 'Desconto', 'Validade', 'Ações']}
            data={coupons.map((coupon) => ({
              code: coupon.code,
              discount: `${coupon.discount}%`,
              validity: new Date(coupon.validUntil).toLocaleDateString(),
              actions: (
                <div key={coupon.id} className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleOpenModal(coupon)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => confirmDeleteCoupon(coupon)}
                  >
                    Excluir
                  </Button>
                </div>
              ),
            }))}
          />
        </Card>
      </Section>
    </>
  );
}

export default withAuth(CouponsPage);