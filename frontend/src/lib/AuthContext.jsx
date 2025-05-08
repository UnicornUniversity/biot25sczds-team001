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
    const t = isBrowser ? localStorage.getItem(LS_TOKEN) : null;
    console.log('[AuthProvider] init token =', t);
    return t;
  });
  const [user, setUser] = useState(() => {
    if (!isBrowser) return null;
    try {
      const u = JSON.parse(localStorage.getItem(LS_USER));
      console.log('[AuthProvider] init user =', u);
      return u;
    } catch {
      console.log('[AuthProvider] init user parse error');
      return null;
    }
  });

  const persistSession = useCallback((jwt, usr) => {
    console.log('[AuthProvider] persistSession jwt=', jwt, 'usr=', usr);
    if (!isBrowser) return;
    if (jwt) localStorage.setItem(LS_TOKEN, jwt);
    else     localStorage.removeItem(LS_TOKEN);
    if (usr) localStorage.setItem(LS_USER, JSON.stringify(usr));
    else     localStorage.removeItem(LS_USER);
  }, []);

  async function login(loginName, password) {
    console.log('[AuthProvider] login()', loginName);
    const res = await fetch(`${BASE_URL}${API_ROUTES.auth.login}`, {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ loginName, password }),
    });
    console.log('[AuthProvider] login response status=', res.status);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      console.log('[AuthProvider] login error=', error);
      throw new Error(error || 'Chyba při přihlášení');
    }
    const { token: jwt, user: usr } = await res.json();
    console.log('[AuthProvider] login OK, jwt=', jwt, 'usr=', usr);
    setToken(jwt); setUser(usr); persistSession(jwt, usr);
    return usr;
  }

  async function register({ name, loginName, password }) {
    console.log('[AuthProvider] register()', name, loginName);
    const res = await fetch(`${BASE_URL}${API_ROUTES.auth.register}`, {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ name, loginName, password }),
    });
    console.log('[AuthProvider] register response status=', res.status);
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      console.log('[AuthProvider] register error=', error);
      throw new Error(error || 'Chyba při registraci');
    }
    const { token: jwt, user: usr } = await res.json();
    console.log('[AuthProvider] register OK, jwt=', jwt, 'usr=', usr);
    setToken(jwt); setUser(usr); persistSession(jwt, usr);
    return usr;
  }

  function logout() {
    console.log('[AuthProvider] logout()');
    setToken(null);
    setUser(null);
    persistSession(null, null);
  }

  // automatický logout po expiraci
  useEffect(() => {
    console.log('[AuthProvider] token changed =>', token);
    if (!token || !isBrowser) return;
    const [, payload] = token.split('.');
    let exp;
    try {
      const json = JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/')));
      exp = json.exp;
      console.log('[AuthProvider] token exp=', exp);
    } catch (e) {
      console.log('[AuthProvider] token parse error', e);
      logout();
      return;
    }
    const ms = exp * 1000 - Date.now();
    console.log('[AuthProvider] ms to expiry=', ms);
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