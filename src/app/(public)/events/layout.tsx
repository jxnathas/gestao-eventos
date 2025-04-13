'use client';

import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/ui/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
            <main className="flex-1 p-4">
              <Container className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="p-4 bg-white shadow-md rounded-lg">
                  {children}
                </Card>
              </Container>
            </main>
        </div>
    </div>
  );
}