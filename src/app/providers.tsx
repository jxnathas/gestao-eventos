'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthProvider>
        <Toaster 
          position="top-center"
          toastOptions={{
            className: '!bg-white !text-gray-800 !border !border-gray-200 !shadow-lg',
          }}
        />
        {children}
      </AuthProvider>
    </>
  );
}