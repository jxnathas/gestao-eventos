import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventsPage from '../(protected)/my-events/page';
import { useEvents } from '../(protected)/my-events/hooks/useEvents';
import { useAuthStore } from '@/lib/stores/authStore';

jest.mock('../(protected)/my-events/hooks/useEvents', () => ({
  useEvents: jest.fn(),
}));

jest.mock('@/lib/stores/authStore', () => ({
  useAuthStore: {
    getState: jest.fn(),
  },
}));

jest.mock('@/components/ui/Header', () => () => <header>Header</header>);
jest.mock('@/components/ui/Section', () => ({ children }: { children: React.ReactNode }) => <section>{children}</section>);
jest.mock('@/components/ui/Card', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('@/components/ui/DataTable', () => ({ headers, data }: { headers: string[]; data: any[] }) => (
  <table>
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          {Object.values(row).map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
));

describe('EventsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders events correctly', async () => {
    const mockUser = { id: 'user123' };
    const mockEvents = [
      { id: '1', name: 'Event 1', date: '2023-10-01T10:00:00Z' },
      { id: '2', name: 'Event 2', date: '2023-10-02T15:00:00Z' },
    ];

    (useAuthStore.getState as jest.Mock).mockReturnValue({ user: mockUser });
    (useEvents as jest.Mock).mockReturnValue({
      events: mockEvents,
      error: null,
      handleDelete: jest.fn(),
    });

    render(<EventsPage />);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Criar Evento')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
      expect(screen.getByText('01/10/2023, 10:00:00')).toBeInTheDocument();
      expect(screen.getByText('02/10/2023, 15:00:00')).toBeInTheDocument();
    });
  });

  it('displays an error message when there is an error', () => {
    const mockUser = { id: 'user123' };

    (useAuthStore.getState as jest.Mock).mockReturnValue({ user: mockUser });
    (useEvents as jest.Mock).mockReturnValue({
      events: [],
      error: 'Failed to fetch events',
      handleDelete: jest.fn(),
    });

    render(<EventsPage />);

    expect(screen.getByText('Failed to fetch events')).toBeInTheDocument();
  });

  it('calls handleDelete when the delete button is clicked', async () => {
    const mockUser = { id: 'user123' };
    const mockHandleDelete = jest.fn();
    const mockEvents = [
      { id: '1', name: 'Event 1', date: '2023-10-01T10:00:00Z' },
    ];

    (useAuthStore.getState as jest.Mock).mockReturnValue({ user: mockUser });
    (useEvents as jest.Mock).mockReturnValue({
      events: mockEvents,
      error: null,
      handleDelete: mockHandleDelete,
    });

    render(<EventsPage />);

    const deleteButton = screen.getByText('Excluir');
    deleteButton.click();

    await waitFor(() => {
      expect(mockHandleDelete).toHaveBeenCalledWith('1');
    });
  });

  it('renders a fallback message when no events are available', () => {
    const mockUser = { id: 'user123' };

    (useAuthStore.getState as jest.Mock).mockReturnValue({ user: mockUser });
    (useEvents as jest.Mock).mockReturnValue({
      events: [],
      error: null,
      handleDelete: jest.fn(),
    });

    render(<EventsPage />);

    expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
  });
});