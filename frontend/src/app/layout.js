import './globals.css';
import Providers from './Providers';

export const metadata = {
  title: 'DoorGuardian',
  description: 'Správa dveří, zařízení a událostí',
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}