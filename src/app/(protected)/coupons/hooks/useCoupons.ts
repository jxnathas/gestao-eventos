import { useState, useEffect } from 'react';
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '@/lib/api/couponsApi';
import type { Coupon } from '@/types';

export const useCoupons = (organizerId: string) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!organizerId) return;

    let isMounted = true;
    const loadCoupons = async () => {
      setLoading(true);
      try {
        const fetchedCoupons = await fetchCoupons({ organizerId });
        if (isMounted) {
          setCoupons(fetchedCoupons);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch coupons');
        }
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCoupons();

    return () => {
      isMounted = false;
    };
  }, [organizerId]);

  const addCoupon = async (data: Omit<Coupon, 'id'>) => {
    try {
      await createCoupon({ ...data, organizerId });
      setError(null);
      const updatedCoupons = await fetchCoupons({ organizerId });
      setCoupons(updatedCoupons);
    } catch (err) {
      console.error('Failed to create coupon', err);
      setError('Failed to create coupon');
    }
  };

  const editCoupon = async (id: string, data: Partial<Coupon>) => {
    try {
      await updateCoupon(id, data);
      setError(null);
      const updatedCoupons = await fetchCoupons({ organizerId });
      setCoupons(updatedCoupons);
    } catch (err) {
      console.error('Failed to update coupon', err);
      setError('Failed to update coupon');
    }
  };

  const removeCoupon = async (id: string) => {
    try {
      await deleteCoupon(id);
      setError(null);
      const updatedCoupons = await fetchCoupons({ organizerId });
      setCoupons(updatedCoupons);
    } catch (err) {
      console.error('Failed to delete coupon', err);
      setError('Failed to delete coupon');
    }
  };

  return { coupons, error, loading, addCoupon, editCoupon, removeCoupon };
};
