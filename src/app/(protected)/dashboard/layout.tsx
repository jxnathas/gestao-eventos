'use client';

import { Header } from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4">
            {children}
            </main>
        </div>
    </div>
  );
}