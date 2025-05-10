// app/404.jsx        (nebo .tsx)
'use client';
export const dynamic = 'force-dynamic';    // ↼ DONUTÍ čistě klientský render

export default function Custom404() {
  return (
    <main style={{ padding:'3rem', textAlign:'center' }}>
      <h1 style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>404</h1>
      <p>Stránka nenalezena.</p>
      <p><a href="/" style={{ color:'var(--color-primary)' }}>
        Zpět na hlavní stránku
      </a></p>
    </main>
  );
}