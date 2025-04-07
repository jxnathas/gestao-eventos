import { create } from "zustand";
import { socket } from "../socket/socket";

type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  checkToken: () => {
    const token = localStorage.getItem('auth-token');
    const email = localStorage.getItem('user-email');
    if (token && email) {
      set({ token });
      return true;
    }
    return false;
  },

  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('auth-token', token);
    } else {
      localStorage.removeItem('auth-token');
    }
    set({ token });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch('http://localhost:3001/users?email=' + email);
      const users = await response.json();
      const user = users[0];

      if (user && user.password === password) {
        const token = 'fake-jwt-token';
        localStorage.setItem('auth-token', token);
        localStorage.setItem('user-email', email);
        set({ 
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role 
          }, 
          token,
          isInitialized: true
        });
        return true;
      }
      throw new Error('Credenciais inválidas');
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('auth-token');
    socket.disconnect();
    set({ user: null, token: null });
  },

  initializeAuth: async () => {
    if (useAuthStore.getState().isInitialized) return;
    
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('auth-token');
      const email = localStorage.getItem('user-email');
      
      if (token && email) {
        const response = await fetch('http://localhost:3001/users?email=' + email);
        const users = await response.json();
        const user = users[0];
        
        if (user) {
          set({ 
            user: { 
              id: user.id, 
              email: user.email, 
              name: user.name, 
              role: user.role 
            }, 
            token,
            isInitialized: true
          });
          return;
        }
      }
      set({ user: null, token: null, isInitialized: true });
    } catch (error) {
      console.error('Falha ao inicializar autenticação:', error);
      set({ user: null, token: null, isInitialized: true });
    } finally {
      set({ isLoading: false });
    }
  }
}));