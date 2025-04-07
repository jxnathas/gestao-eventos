'use client';
import "@/styles/globals.css";
import { Providers } from "./providers";
import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const { isLoading } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html lang="pt-BR">
      <body>
        {!isMounted ? null : isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary" />
          </div>
        ) : (
          <Providers>
            {children}
          </Providers>
        )}
      </body>
    </html>
  );
}