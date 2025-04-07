"use client";

import React from 'react'

import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/lib/stores/authStore'
import { Header } from '@/components/ui/Header';
import { withAuth } from '@/components/hoc/withAuth';

function DashboardPage() {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Container className="py-6">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Olá, {user?.name || 'Administrador'}!
                </h1>
                <p className="text-gray-500">Resumo do seu negócio</p>
              </div>
            </Container>
    
            <div className="bg-white border-y border-gray-200 py-6">
              <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6">
                    <h3 className="font-medium text-gray-700">Eventos Ativos</h3>
                    <p className="text-3xl font-bold mt-2">12</p>
                  </Card>
                </div>
              </Container>
            </div>
    
            <Container className="py-6">
              <Card className="p-6 mb-8">
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Criar Evento</Button>
                </div>
              </Card>
            </Container>
          </main>
        </div>
    );
}

export default withAuth(DashboardPage);