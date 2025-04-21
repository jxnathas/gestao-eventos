import { create } from "zustand";
import { socket } from "../socket/socket";
import { AuthState } from "@/types";
import api from "@/lib/api/api";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  checkToken: () => {
    const token = localStorage.getItem("auth-token");
    const email = localStorage.getItem("user-email");
    if (token && email) {
      set({ token });
      return true;
    }
    return false;
  },

  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem("auth-token", token);
    } else {
      localStorage.removeItem("auth-token");
    }
    set({ token });
  },

  login: async (email: string, plainPassword: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/users?email=${email}`);
      const user = response.data[0];

      if (!user || user.password !== plainPassword) {
        throw new Error("Credenciais inválidas");
      }

      const token = "fake-jwt-token";

      localStorage.setItem("auth-token", token);
      localStorage.setItem("user-email", email);

      set({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          document: "",
          phone: "",
          establishmentName: "",
          tradingName: "",
          password: ""
        },
        token,
        isInitialized: true,
      });

      return { token, user };
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-email");
    socket.disconnect();
    set({ user: null, token: null });
  },

  initializeAuth: async () => {
    if (useAuthStore.getState().isInitialized) return;

    set({ isLoading: true });
    try {
      const token = localStorage.getItem("auth-token");
      const email = localStorage.getItem("user-email");

      if (token && email) {
        const response = await api.get(`/users?email=${email}`);
        const user = response.data[0];

        if (user) {
          set({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              document: "",
              phone: "",
              establishmentName: "",
              tradingName: "",
              password: ""
            },
            token,
            isInitialized: true,
          });
          return;
        }
      }

      set({ user: null, token: null, isInitialized: true });
    } catch (error) {
      console.error("Falha ao inicializar autenticação:", error);
      set({ user: null, token: null, isInitialized: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));