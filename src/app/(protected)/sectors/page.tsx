'use client';
import { useState, useEffect } from 'react';

import api from '@/lib/api/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Section } from '@/components/ui/Section';

export default function SectorsPage() {
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    api.get('/sectors').then((res) => setSectors(res.data));
  }, []);

  return (
    <Section>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Setores</h1>
        <Button variant="primary" href="/sectors/create">
          Criar Setor
        </Button>
      </div>
      <Card>
        <DataTable
          headers={['Nome', 'Capacidade', 'Preço', 'Ações']}
          data={sectors.map((sector) => [
            sector.name,
            sector.capacity,
            `R$ ${sector.price.toFixed(2)}`,
            <div key={sector.id} className="flex gap-2">
              <Button variant="ghost" size="sm" href={`/sectors/edit/${sector.id}`}>
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => api.delete(`/sectors/${sector.id}`).then(() => window.location.reload())}
              >
                Excluir
              </Button>
            </div>,
          ])}
        />
      </Card>
    </Section>
  );
}