import type { Sector, EventLot } from '@/types';

export const eventFields = [
  { name: 'name', label: 'Nome do Evento', type: 'text', required: true },
  { name: 'date', label: 'Data e Hora', type: 'datetime-local', required: true },
  { name: 'location', label: 'Localização', type: 'text', required: true },
  { name: 'description', label: 'Descrição', type: 'textarea', required: false },
  { name: 'banner', label: 'Banner do Evento', type: 'file', accept: 'image/*', required: false }
];

export const sectorFields = [
  { name: 'name', label: 'Nome do Setor', type: 'text', required: true },
  { name: 'capacity', label: 'Capacidade', type: 'number', required: true },
  { name: 'price', label: 'Preço (R$)', type: 'number', step: '0.01', required: true },
  { name: 'description', label: 'Descrição do Setor', type: 'text', required: false }
];

export const lotFields = [
  { name: 'name', label: 'Nome do Lote', type: 'text', required: true },
  { name: 'startDate', label: 'Data de Início', type: 'datetime-local', required: true },
  { name: 'endDate', label: 'Data de Término', type: 'datetime-local', required: true },
  { name: 'discount', label: 'Desconto (%)', type: 'number', step: '0.01', required: false }
];

export const defaultSector: Omit<Sector, 'id'> = {
  name: '',
  capacity: 0,
  price: 0,
  description: ''
};

export const defaultLot: Omit<EventLot, 'id'> = {
  name: '',
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  discount: 0,
  price: 0,
  isActive: false,
  eventId: '',
  createdAt: ''
};