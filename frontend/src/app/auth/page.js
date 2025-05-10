'use client';

// ❌ původně: import AuthPage from '@/features/auth';
import AuthPage from '@/features/auth/AuthPage';  // ✅ IMPORTUJEME PŘÍMO SOUBOR

export default function AuthRoute() {
  return <AuthPage />;
}