// server layout (bez "use client")
import './globals.css';
import { Suspense } from 'react';
import Providers from './Providers';

export const metadata = {
  title: 'DoorGuardian',
  description: 'Správa dveří, zařízení a událostí',
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>
        {/*  Suspense zajistí, že klientské komponenty (které používají
            useSearchParams, useRouter apod.) se nespustí už při build‑time */}
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}