// server layout (bez "use client")
import './globals.css';
import Providers from '@/app/providers';
import { Suspense } from 'react';
export const metadata = {
  title: 'DoorGuardian',
  description: 'Správa dveří, zařízení a událostí',
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>
        <Suspense>
          <Providers>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}