'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';

export default function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const { user, isInitialized } = useAuthStore();

    useEffect(() => {
      if (isInitialized && !user) {
        router.push('/login');
      }
    }, [user, isInitialized, router]);

    if (!isInitialized) {
      return (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      );
    }

    return user ? <Component {...props} /> : null;
  };
}