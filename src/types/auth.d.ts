import { User } from './user';
  
export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    login: (email: string, password: string) => Promise<{ token: string; user: User }>;
    logout: () => void;
    initializeAuth: () => Promise<void>;
};