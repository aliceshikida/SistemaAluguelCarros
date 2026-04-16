/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { decodeJwtPayload, primaryUiRole, rolesFromPayload } from '../utils/jwt';

const AuthContext = createContext(null);

const STORAGE_KEY = 'auth';

function authFromToken(token, loginHint) {
  const payload = decodeJwtPayload(token);
  const roles = rolesFromPayload(payload);
  const role = primaryUiRole(roles);
  const login =
      (typeof loginHint === 'string' && loginHint) ||
      (typeof payload?.sub === 'string' ? payload.sub : '') ||
      '';
  return { token, login, roles, role };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.token) return null;
      return authFromToken(parsed.token, parsed.login);
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
    const { data } = await api.post('/api/auth/login', {
      username: loginField.trim().toLowerCase(),
      password: senha,
    });
    const token = data.access_token ?? data.accessToken;
    if (!token) {
      throw new Error('Resposta de login sem access_token');
    }
    const next = authFromToken(token, loginField.trim().toLowerCase());
    setAuth(next);
    return next;
  }, []);

  const registerCliente = useCallback(async (body) => {
    await api.post('/api/auth/register/cliente', body);
  }, []);

  const registerAgente = useCallback(async (body) => {
    await api.post('/api/auth/register/agente', body);
  }, []);

  const logout = useCallback(() => setAuth(null), []);

  const value = useMemo(
      () => ({
        auth,
        isAuthenticated: !!auth?.token,
        login,
        logout,
        registerCliente,
        registerAgente,
      }),
      [auth, login, logout, registerCliente, registerAgente]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}
