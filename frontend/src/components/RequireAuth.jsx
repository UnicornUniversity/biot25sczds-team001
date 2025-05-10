'use client';

import { useEffect, useState } from 'react';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

/**
 * Zamezí přístupu ke všem stránkám mimo /auth,
 * pokud není přihlášený uživatel.
 */
export default function RequireAuth({ children }) {
  const { user }      = useAuth();                 // null/undefined/obj
  const pathname      = usePathname();
  const searchParams  = useSearchParams();
  const router        = useRouter();

  const isAuthPage    = pathname.startsWith('/auth');

  /* 1️⃣ – jsme už na klientu? */
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  /* 2️⃣ – redirect, pokud nejsem na /auth a nemám usera */
  useEffect(() => {
    if (!hydrated)  return;                       // ještě SSR/ISR
    if (isAuthPage) return;                       // na /auth neřeším
    if (user)       return;                       // přihlášen → vpřed

    // sem přijdeme pouze nepřihlášení
    const q = searchParams?.toString();
    const next = pathname + (q ? `?${q}` : '');
    router.replace(`/auth?mode=login&next=${encodeURIComponent(next)}`);
  }, [hydrated, isAuthPage, user, pathname, searchParams, router]);

  /* 3️⃣ – co renderovat */
  if (!hydrated)                 return null;      // ještě SSR
  if (!isAuthPage && !user)      return null;      // čekáme na redirect
  return children;                                // vše OK
}