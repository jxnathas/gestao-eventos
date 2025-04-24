import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '../(protected)/dashboard/page';
import api from '@/lib/api/api';
import { useAuthStore } from '@/lib/stores/authStore';

jest.mock('@/lib/api/api', () => ({
  get: jest.fn(),
}));

jest.mock('@/lib/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('@/components/ui/Spinner', () => () => <div role="status">Loading...</div>);
jest.mock('@/components/ui/ButtonLink', () => ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a href={href}>{children}</a>
));

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard with quick actions and recent events', async () => {
    const mockUser = { id: 'user123', name: 'Test User' };
    const mockEvents = [
      { id: '1', name: 'Event 1', date: '2023-10-01T10:00:00Z' },
      { id: '2', name: 'Event 2', date: '2023-10-02T15:00:00Z' },
    ];

    (useAuthStore as jest.Mock).mockReturnValue({ user: mockUser });
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockEvents });

    render(<DashboardPage />);

    expect(screen.getByText(`Bem-vindo, ${mockUser.name}!`)).toBeInTheDocument();

    expect(screen.getByText('Criar Evento')).toBeInTheDocument();
    expect(screen.getByText('Gerar Cupom')).toBeInTheDocument();
    expect(screen.getByText('Ver Relatórios')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });

    expect(screen.getByText('01/10/2023')).toBeInTheDocument();
    expect(screen.getByText('02/10/2023')).toBeInTheDocument();
  });

  it('shows a loading spinner while fetching recent events', () => {
    const mockUser = { id: 'user123', name: 'Test User' };

    (useAuthStore as jest.Mock).mockReturnValue({ user: mockUser });
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<DashboardPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const mockUser = { id: 'user123', name: 'Test User' };

    (useAuthStore as jest.Mock).mockReturnValue({ user: mockUser });
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch events'));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });

  it('renders a default welcome message if no user is logged in', () => {
    (useAuthStore as jest.Mock).mockReturnValue({ user: null });

    render(<DashboardPage />);

    expect(screen.getByText('Bem-vindo, Administrador!')).toBeInTheDocument();
  });
});