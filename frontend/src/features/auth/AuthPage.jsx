'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const mode         = searchParams.get('mode') || 'login'; // 'login' nebo 'register'

  const { user, login, register } = useAuth();
  const [form, setForm]           = useState({ name: '', loginName: '', password: '' });
  const [error, setError]         = useState('');

  // Pokud už je někdo přihlášen, přesměruj na domovskou
  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(form.loginName, form.password);
      } else {
        await register({ name: form.name, loginName: form.loginName, password: form.password });
      }
      router.replace('/');
    } catch (err) {
      setError(err.message);
    }
  };

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
            <>Nemáte účet?{' '}
              <Link href="/auth?mode=register" className={styles.linkBtn}>
                Registrovat se
              </Link>
            </>
          ) : (
            <>Máte účet?{' '}
              <Link href="/auth?mode=login" className={styles.linkBtn}>
                Přihlášení
              </Link>
            </>
          )}
        </p>
      </form>
    </main>
  );
}