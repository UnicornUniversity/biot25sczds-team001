'use client';

import { useState } from 'react';
import Navigation    from './components/Navigation';
import HomeDoorsList from './components/HomeDoorsList';
import useDoorStatus from './hooks/useDoorStatus';
import HomeLogsList  from './components/HomeLogsList';
import LogsModal     from './modals/LogsModal';

export function HomePage() {
  const { doors, refresh } = useDoorStatus();
  const [selectedLog, setSelectedLog] = useState(null);

  return (
    <>
      <Navigation />

      <main style={{ padding: '1rem' }}>
        {/* Nově: seznam dveří se stavem */}
        <HomeDoorsList doors={doors} />

        {/* zbytek vaší původní HomePage */}
        <HomeLogsList onSelect={setSelectedLog} />
        <LogsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      </main>
    </>
  );
}