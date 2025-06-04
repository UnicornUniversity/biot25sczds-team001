// src/lib/authFetch.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // např. http://localhost:3000
const LS_TOKEN = 'dg.jwt';

export async function authFetch(path, opts = {}) {
  // načtení tokenu
  const token = typeof window !== 'undefined'
    ? localStorage.getItem(LS_TOKEN)
    : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

    /* Výpisy pouze v development prostředí
  if (process.env.NODE_ENV === 'development') {
    console.log('[authFetch] →', path);
    console.log('[authFetch] opts:', opts);
    console.log('[authFetch] headers:', headers);
  }
   */

  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers,
  });

  // vypsat celé tělo odpovědi (JSON nebo text)
/*
  if (process.env.NODE_ENV === 'development') {
    console.log('[authFetch] status:', res.status);

  try {
    const text = await res.clone().text();
    console.log('[authFetch] body:', text);
  } catch (e) {
    console.log('[authFetch] body parse error', e);
  }
}
*/
  return res;
}