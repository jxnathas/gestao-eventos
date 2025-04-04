import { create } from "zustand";

type User = {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
};

type AuthState = {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    login: async (email, password) => {
      const response = await fetch('http://localhost:3001/users?email=' + email);
      const users = await response.json();
      const user = users[0];
  
      if (user && user.password === password) {
        const token = 'fake-jwt-token';
        localStorage.setItem('auth-token', token);
        set({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
      } else {
        throw new Error('Credenciais inválidas');
      }
    },
    logout: () => {
      localStorage.removeItem('auth-token');
      set({ user: null, token: null });
    },
}));