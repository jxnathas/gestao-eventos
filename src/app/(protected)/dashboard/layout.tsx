'use client';

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
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
              <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="p-4 bg-white shadow-md rounded-lg">
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  {children}
                </Card>
              </Container>
            </main>
        </div>
    </div>
  );
}