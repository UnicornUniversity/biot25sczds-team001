// src/lib/authFetch.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // např. http://localhost:3000
const LS_TOKEN = 'dg.jwt';

export async function authFetch(path, opts = {}) {
  // načtení tokenu
  const token = typeof window !== 'undefined'
    ? localStorage.getItem(LS_TOKEN)
    : null;

  console.log('[authFetch] →', path);
  console.log('[authFetch] opts:', opts);
  console.log('[authFetch] token:', token);

  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  console.log('[authFetch] headers:', headers);

  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers,
  });

  console.log('[authFetch] status:', res.status);

  // vypsat celé tělo odpovědi (JSON nebo text)
  let text;
  try {
    text = await res.clone().text();
    console.log('[authFetch] body:', text);
  } catch (e) {
    console.log('[authFetch] body parse error', e);
  }

  return res;
}