'use client';

import { AuthProvider }    from '@/lib/AuthContext';
import { StatusProvider }  from '@/lib/StatusContext';
import StatusNotifications from '@/components/StatusNotifications';
import Header              from '@/components/Header';
import Footer              from '@/components/Footer';

/**
 * Jediný client‑side wrapper, který drží *všechny*
 * kontextové providery + sdílené, stavově závislé UI komponenty.
 */
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <StatusProvider>
        <Header />                 {/* reaguje na <AuthProvider> */}
        <main style={{ paddingTop: 64, paddingBottom: 64 }}>
          {children}
        </main>
        <Footer />
        <StatusNotifications />    {/* zobrazuje pending / toasty */}
      </StatusProvider>
    </AuthProvider>
  );
}