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
import type { AuthUser, RegisterInput } from '@/services/auth/types';
import { AuthApiError } from '@/services/auth/types';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (cpf: string, password: string) => Promise<void>;
  register: (payload: RegisterInput) => Promise<{ vehicle: RegisterInput['vehicle'] | null }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetchCurrentUser();
      setUser(response.user);
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 401) {
        setUser(null);
        return;
      }
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setIsBootstrapping(false));
  }, [refreshSession]);

  const login = useCallback(async (cpf: string, password: string) => {
    const response = await loginUser(cpf, password);
    setUser(response.user);
  }, []);

  const register = useCallback(async (payload: RegisterInput) => {
    const response = await registerUser(payload);
    setUser(response.user);
    return { vehicle: response.vehicle };
  }, []);

  const logout = useCallback(async () => {
    await logoutUser().catch(() => undefined);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isBootstrapping,
      login,
      register,
      logout,
      refreshSession,
    }),
    [user, isBootstrapping, login, register, logout, refreshSession],
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
