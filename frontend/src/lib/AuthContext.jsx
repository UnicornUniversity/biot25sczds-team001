// src/lib/AuthContext.jsx
'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { API_ROUTES } from '@/lib/apiRoutes';

const BASE_URL  = process.env.NEXT_PUBLIC_API_URL;
const LS_TOKEN  = 'dg.jwt';
const LS_USER   = 'dg.user';
const isBrowser = typeof window !== 'undefined';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return isBrowser ? localStorage.getItem(LS_TOKEN) : null;
  });

  const [user, setUser] = useState(() => {
    if (!isBrowser) return null;
    try {
      return JSON.parse(localStorage.getItem(LS_USER));
    } catch {
      return null;
    }
  });

  const persistSession = useCallback((jwt, usr) => {
    if (!isBrowser) return;
    if (jwt) localStorage.setItem(LS_TOKEN, jwt);
    else     localStorage.removeItem(LS_TOKEN);
    if (usr) localStorage.setItem(LS_USER, JSON.stringify(usr));
    else     localStorage.removeItem(LS_USER);
  }, []);

  async function login(loginName, password) {
    const res = await fetch(`${BASE_URL}${API_ROUTES.auth.login}`, {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ loginName, password }),
    });
    
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      throw new Error(error || 'Chyba při přihlášení');
    }
    const { token: jwt, user: usr } = await res.json();
    setToken(jwt); setUser(usr); persistSession(jwt, usr);
    return usr;
  }

  async function register({ name, loginName, password }) {
    const res = await fetch(`${BASE_URL}${API_ROUTES.auth.register}`, {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ name, loginName, password }),
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      throw new Error(error || 'Chyba při registraci');
    }

    const { token: jwt, user: usr } = await res.json();
    setToken(jwt); setUser(usr); persistSession(jwt, usr);
    return usr;
  }

  function logout() {
    setToken(null);
    setUser(null);
    persistSession(null, null);
  }

  // automatický logout po expiraci
  useEffect(() => {
    if (!token || !isBrowser) return;
    const [, payload] = token.split('.');
    let exp;
    try {
      const json = JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/')));
      exp = json.exp;
    } catch (e) {
      logout();
      return;
    }
    const ms = exp * 1000 - Date.now();
    if (ms <= 0) return logout();
    const id = setTimeout(logout, ms + 1000);
    return () => clearTimeout(id);
  }, [token]);

  return (
    <AuthCtx.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth musí být uvnitř <AuthProvider>');
  return ctx;
}