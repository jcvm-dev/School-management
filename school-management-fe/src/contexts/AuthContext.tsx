import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User, LoginRequest } from '../types';
import { authApi } from '../api/auth';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se o cookie de autenticação ainda é válido ao carregar a página
  useEffect(() => {
    authApi.me()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authApi.login(data);

    setUser({
      id: response.userId,
      email: response.email,
      nome: response.nome,
      tipo: response.tipo,
      ativo: true,
      senhaTemporaria: response.senhaTemporaria,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
