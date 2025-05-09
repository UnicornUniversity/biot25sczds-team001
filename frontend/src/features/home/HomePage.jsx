'use client';

import { useState } from 'react';
import Navigation      from './components/Navigation';
import HomeDoorsList   from './components/HomeDoorsList';
import HomeLogsList    from './components/HomeLogsList';
import LogsModal       from './modals/LogsModal';

export default function HomePage() {
  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <>
      <Navigation />

      <main style={{ padding: '1rem' }}>
        <HomeDoorsList />

        <HomeLogsList onSelect={setSelectedLog} />

        <LogsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      </main>
    </>
  );
}