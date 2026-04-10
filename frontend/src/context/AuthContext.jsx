/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

const STORAGE_KEY = 'auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  const login = useCallback(async (loginField, senha) => {
    const { data } = await api.post('/api/auth/login', { login: loginField, senha });
    const next = {
      token: data.accessToken,
      role: data.role,
      nome: data.nome,
      usuarioId: data.usuarioId,
      tipoAgente: data.tipoAgente || null,
    };
    setAuth(next);
    return next;
  }, []);

  const register = useCallback(async (payload) => {
    await api.post('/api/auth/register', payload);
  }, []);

  const logout = useCallback(() => setAuth(null), []);

  const value = useMemo(
      () => ({
        auth,
        isAuthenticated: !!auth?.token,
        login,
        logout,
        register,
        registerCliente: register,
      }),
      [auth, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}