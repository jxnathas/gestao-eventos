import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Coupon } from '@/types';
import { useCoupons } from './useCoupons';

export const useCouponHandlers = (userId: string) => {
  const { addCoupon, editCoupon, removeCoupon } = useCoupons(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null);

  const handleSubmit = async (couponData: {
    code: string;
    discount: number;
    validUntil: string;
    eventId: string;
    isGlobal: boolean;
  }) => {
    try {
      if (currentCoupon?.id) {
        await editCoupon(currentCoupon.id, {
          ...couponData,
        });
      } else {
        await addCoupon({
          ...couponData,
          organizerId: userId,
          createdAt: '',
          isActive: false
        });
      }

      setIsModalOpen(false);
      setCurrentCoupon(null);
    } catch (err) {
      console.error('Erro ao salvar cupom', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeCoupon(id);
      toast.success('Cupom deletado com sucesso!');
    } catch (err) {
      toast.error('Erro ao deletar cupom.');
      throw err;
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    currentCoupon,
    setCurrentCoupon,
    handleSubmit,
    handleDelete,
  };
};