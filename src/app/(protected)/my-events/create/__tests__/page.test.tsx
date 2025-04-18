import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import CreateEventPage from '../page';
import { useAuthStore } from '@/lib/stores/authStore';
import { useDynamicFormItems } from '../hooks/useDynamicFormItems';
import api from '@/lib/api/api';

// Mock dependencies
jest.mock('@/lib/stores/authStore', () => ({
  useAuthStore: {
    getState: jest.fn(() => ({ user: { id: 'testUserId' } })),
  },
}));

jest.mock('@/lib/api/api', () => ({
  post: jest.fn(),
}));

jest.mock('../hooks/useDynamicFormItems', () => ({
  useDynamicFormItems: jest.fn(),
}));

describe('CreateEventPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDynamicFormItems as jest.Mock).mockReturnValue({
      items: [],
      addItem: jest.fn(),
      updateItem: jest.fn(),
      removeItem: jest.fn(),
    });
  });

  it('renders the page correctly', () => {
    render(<CreateEventPage />);
    expect(screen.getByText('Criar Evento')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Salvar Evento/i })).toBeInTheDocument();
  });

  it('submits the form with correct data', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { id: 'testEventId' } });
    (api.post as jest.Mock).mockResolvedValue({});

    render(<CreateEventPage />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/Data/i), { target: { value: '2025-04-18' } });
    fireEvent.change(screen.getByLabelText(/Localização/i), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Test Description' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar Evento/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/events', expect.objectContaining({
        name: 'Test Event',
        date: '2025-04-18',
        location: 'Test Location',
        description: 'Test Description',
        organizerId: 'testUserId',
      }));
    });

    expect(api.post).toHaveBeenCalledTimes(1);
  });

  it('handles dynamic sectors and lots', async () => {
    const addSector = jest.fn();
    const addLot = jest.fn();
    (useDynamicFormItems as jest.Mock).mockReturnValueOnce({
      items: [],
      addItem: addSector,
      updateItem: jest.fn(),
      removeItem: jest.fn(),
    }).mockReturnValueOnce({
      items: [],
      addItem: addLot,
      updateItem: jest.fn(),
      removeItem: jest.fn(),
    });

    render(<CreateEventPage />);

    fireEvent.click(screen.getByText(/Adicionar Setor/i));
    expect(addSector).toHaveBeenCalled();

    fireEvent.click(screen.getByText(/Adicionar Lote/i));
    expect(addLot).toHaveBeenCalled();
  });

  it('displays an error if event creation fails', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Failed to create event'));

    render(<CreateEventPage />);

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Test Event' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar Evento/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to create event/i)).toBeInTheDocument();
    });
  });
});