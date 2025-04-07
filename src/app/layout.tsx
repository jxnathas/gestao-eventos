'use client';
import "@/styles/globals.css";
import { Providers } from "./providers";
import { useEffect, useState } from "react";
import { SocketManager } from "@/components/SocketManager";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <html lang="pt-BR">
      <body>
        {!isMounted ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        ) : (
          <Providers>
            <SocketManager />
            {children}
          </Providers>
        )}
      </body>
    </html>
  );
}