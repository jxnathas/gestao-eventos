'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Section } from '@/components/ui/Section';
import withAuth from '@/components/hoc/withAuth';
import { Header } from '@/components/ui/Header';
import type { Sector } from '@/types';
import { useAuthStore } from '@/lib/stores/authStore';

function SectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSector, setCurrentSector] = useState<Sector | null>(null);

  const userId = useAuthStore.getState().user?.id || 'defaultUserId';
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const res = await api.get(`/sectors?organizerId=${userId}`);
        setSectors(res.data);
      } catch (err) {
        console.error("Failed to fetch sectors", err);
      }
    };

    if (userId) {
      fetchSectors();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = Object.fromEntries(formData);

    if (currentSector?.id) {
      await api.patch(`/sectors/${currentSector.id}`, payload);
    } else {
      await api.post('/sectors', payload);
    }
    const updatedSectors = await api.get('/events');
    setSectors(updatedSectors.data);
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <Section className="pt-3">
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={currentSector ? 'Editar Setor' : 'Criar Setor'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              label="Nome do Setor"
              defaultValue={currentSector?.name}
              required
            />
            <Input
              name="capacity"
              type="number"
              label="Capacidade"
              defaultValue={currentSector?.capacity}
              required
            />
            <Input
              name="price"
              type="number"
              step="0.01"
              label="Preço (R$)"
              defaultValue={currentSector?.price}
              required
            />
            <Button type="submit" variant="primary" className="w-full">
              Salvar
            </Button>
          </form>
        </Modal>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
              >
                {'<'}
              </Button>
              <h1 className="text-2xl font-semibold">Setores</h1>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              setCurrentSector(null);
              setIsModalOpen(true);
            }}
          >
            Criar Setor
          </Button>

          <DataTable
            headers={['Nome', 'Capacidade', 'Preço', 'Ações']}
            data={sectors.map((sector) => [
              sector.name,
              sector.capacity,
              `R$ ${sector.price}`,
              <div key={sector.id} className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentSector(sector);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm('Excluir este setor?')) {
                      api.delete(`/sectors/${sector.id}`).then(() =>
                        window.location.reload()
                      );
                    }
                  }}
                >
                  Excluir
                </Button>
              </div>,
            ])}
          />
        </Card>
      </Section>
    </>
  );
}

export default withAuth(SectorsPage);