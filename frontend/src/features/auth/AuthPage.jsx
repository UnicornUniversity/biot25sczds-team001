'use client';

import { useState, useEffect } from 'react';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const mode     = searchParams.get('mode') || 'login';      // login | register
  const nextUrl  = searchParams.get('next') ?? '/';          // kam se vrátit

  const { user, login, register } = useAuth();

  const [form,  setForm]  = useState({
    name: '', loginName: '', password: '',
  });
  const [error, setError] = useState('');

  /* ---------- už přihlášen ⇒ pryč z /auth --------------------------- */
  useEffect(() => {
    if (user) router.replace(nextUrl);
  }, [user, router, nextUrl]);

  /* ---------- formulář --------------------------------------------- */
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        await login(form.loginName, form.password);
      } else {
        await register({
          name: form.name,
          loginName: form.loginName,
          password: form.password,
        });
      }
      router.replace(nextUrl);         // <‑‑ návrat
    } catch (err) {
      setError(err.message);
    }
  }

  /* ---------- UI ---------------------------------------------------- */
  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>
          {mode === 'login' ? 'Přihlášení' : 'Registrace'}
        </h1>

        {mode === 'register' && (
          <div className={styles.field}>
            <label>Jméno</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className={styles.field}>
          <label>Přezdívka (loginName)</label>
          <input
            name="loginName"
            value={form.loginName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Heslo</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.primaryBtn} type="submit">
          {mode === 'login' ? 'Přihlásit se' : 'Registrovat se'}
        </button>

        <p className={styles.switch}>
          {mode === 'login' ? (
            <>
              Nemáte účet?{' '}
              <Link href={`/auth?mode=register&next=${encodeURIComponent(nextUrl)}`}
                    className={styles.linkBtn}>
                Registrovat se
              </Link>
            </>
          ) : (
            <>
              Máte účet?{' '}
              <Link href={`/auth?mode=login&next=${encodeURIComponent(nextUrl)}`}
                    className={styles.linkBtn}>
                Přihlášení
              </Link>
            </>
          )}
        </p>
      </form>
    </main>
  );
}