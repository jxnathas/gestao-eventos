"use client";

import React from 'react'

import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/lib/stores/authStore'
import { Header } from '@/components/ui/Header';
import  withAuth  from '@/components/hoc/withAuth';

const metrics = [
  { title: 'Eventos Ativos', value: 5, link: '/events' },
  { title: 'Vendas Hoje', value: 'R$ 1.200,00', link: '/sales' },
  { title: 'Ingressos Vendidos', value: 42, link: '/tickets' },
];


const quickActions = [
  { label: 'Criar Evento', href: '/events' },
  { label: 'Gerar Cupom', href: '/coupons/create' },
  { label: 'Ver Relatórios', href: '/reports' },
];


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
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics.map((metric) => (
                <Card key={metric.title} className="p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-gray-500">{metric.title}</h3>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <a href={metric.link} className="text-primary text-sm mt-2 inline-block">
                    Ver detalhes →
                  </a>
                </Card>
              ))}
            </div>

            <Card className="p-4">
              <h3 className="text-gray-500 mb-3">Ações Rápidas</h3>
              <div className="flex flex-wrap gap-3">
                {quickActions.map((action) => (
                  <Button key={action.label} variant="outline" href={action.href}>
                    {action.label}
                  </Button>
                ))}
              </div>
            </Card>
    
           
          </main>
        </div>
    );
}

export default withAuth(DashboardPage);