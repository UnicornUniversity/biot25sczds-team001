'use client';

import RequireAuth from '@/components/RequireAuth';
import { HomePage } from '@/features/home';

export default function HomeRoute() {
  return (
    <RequireAuth>
      <HomePage />
    </RequireAuth>
  );
}