export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    createdAt?: string;
}
  
export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    initializeAuth: () => Promise<void>;
};