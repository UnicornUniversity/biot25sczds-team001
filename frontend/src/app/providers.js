'use client';

import { AuthProvider }   from '@/lib/AuthContext';
import { StatusProvider } from '@/lib/StatusContext';
import StatusNotifications from '@/components/StatusNotifications';
import Header              from '@/components/Header';
import Footer              from '@/components/Footer';

import RequireAuth from '@/components/RequireAuth';   // <‑‑ NOVÉ!

/**
 * Vrstva všech kontextů + sdílených UI komponent.
 */
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <StatusProvider>
        <Header />                     {/* reaguje na <AuthProvider> */}
        <main style={{ padding: '64px 0' }}>
          {/*  <<<‑‑‑ ochrana všech rout (kromě /auth)  */}
          <RequireAuth>{children}</RequireAuth>
        </main>
        <Footer />
        <StatusNotifications />
      </StatusProvider>
    </AuthProvider>
  );
}