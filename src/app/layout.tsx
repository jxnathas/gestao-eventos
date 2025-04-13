'use client';
import "@/styles/globals.css";
import { Providers } from "./providers";
import { useEffect, useState } from "react";
import { SocketManager } from "@/components/SocketManager";
import Spinner from "@/components/ui/Spinner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html lang="pt-BR">
      <title>Poggo - Eventos</title>
      <body>
        {!isMounted ? (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
            <Spinner />
            </div>
        ) : (
          <Providers>
            <SocketManager />
            <main className="min-h-screen">
              {children}
            </main>
          </Providers>
        )}
      </body>
    </html>
  );
}