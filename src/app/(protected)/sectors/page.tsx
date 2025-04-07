'use client';
import { useState } from 'react';
import api from '@/lib/api/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Section } from '@/components/ui/Section';
import { withAuth } from '@/components/hoc/withAuth';

function SectorsPage() {
  const [sectors, setSectors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSector, setCurrentSector] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (currentSector?.id) {

      await api.patch(`/sectors/${currentSector.id}`, data);

    } else {
      await api.post('/sectors', data);
    }
    setIsModalOpen(false);

    window.location.reload();
  };

  return (
    <Section>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
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
          <Button type="submit" variant="primary">
            Salvar
          </Button>
        </form>
      </Modal>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Setores</h1>
        <Button
          variant="primary"
          onClick={() => {
            setCurrentSector(null);
            setIsModalOpen(true);
          }}
        >
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

export default withAuth(SectorsPage);