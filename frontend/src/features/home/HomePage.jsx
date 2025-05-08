'use client';

import { useState } from 'react';

import Navigation   from './components/Navigation';
import HomeLogsList from './components/HomeLogsList';
import LogsModal    from './modals/LogsModal';

export function HomePage() {
  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <>
      <Navigation />
      <main style={{ padding: '1rem' }}>
        <HomeLogsList onSelect={setSelectedLog} />
        <LogsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      </main>
    </>
  );
}