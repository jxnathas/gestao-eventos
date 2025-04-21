import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';
import api from '@/lib/api/api';

jest.mock('@/lib/api/api', () => ({
  get: jest.fn(),
}));

jest.mock('@/components/ui/Spinner', () => () => <div role="status">Loading...</div>);
jest.mock('@/components/ui/Container', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders events after fetching data', async () => {
    const mockEvents = [
      { id: 1, name: 'Event 1', description: 'Description 1' },
      { id: 2, name: 'Event 2', description: 'Description 2' },
    ];

    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockEvents });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Event 2')).not.toBeInTheDocument();
    });

    expect(console.error).toHaveBeenCalledWith(
      'Erro ao carregar eventos:',
      expect.any(Error)
    );
  });
});