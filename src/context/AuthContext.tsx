import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from '@/services/auth/client';
import type { AuthUser, AuthVehicle, RegisterInput } from '@/services/auth/types';
import { AuthApiError } from '@/services/auth/types';

type AuthContextValue = {
  user: AuthUser | null;
  vehicles: AuthVehicle[];
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (cpf: string, password: string) => Promise<void>;
  register: (payload: RegisterInput) => Promise<{ vehicle: RegisterInput['vehicle'] | null }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setVehicles: (vehicles: AuthVehicle[]) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [vehicles, setVehicles] = useState<AuthVehicle[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetchCurrentUser();
      setUser(response.user);
      setVehicles(response.vehicles ?? []);
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 401) {
        setUser(null);
        setVehicles([]);
        return;
      }
      setUser(null);
      setVehicles([]);
    }
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setIsBootstrapping(false));
  }, [refreshSession]);

  const login = useCallback(async (cpf: string, password: string) => {
    await loginUser(cpf, password);
    const session = await fetchCurrentUser();
    setUser(session.user);
    setVehicles(session.vehicles ?? []);
  }, []);

  const register = useCallback(async (payload: RegisterInput) => {
    const response = await registerUser(payload);
    setUser(response.user);
    setVehicles(response.vehicles ?? []);
    return { vehicle: response.vehicle };
  }, []);

  const logout = useCallback(async () => {
    await logoutUser().catch(() => undefined);
    setUser(null);
    setVehicles([]);
  }, []);

  const value = useMemo(
    () => ({
      user,
      vehicles,
      isAuthenticated: user !== null,
      isBootstrapping,
      login,
      register,
      logout,
      refreshSession,
      setVehicles,
    }),
    [user, vehicles, isBootstrapping, login, register, logout, refreshSession, setVehicles],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

export function useAccountHolder(): { name: string; email: string } {
  const { user } = useAuth();
  return {
    name: user?.name ?? '—',
    email: user?.email ?? user?.phone ?? '—',
  };
}
