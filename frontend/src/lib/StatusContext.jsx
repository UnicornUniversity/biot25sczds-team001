// src/lib/StatusContext.js
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import msgs from './messages';

let idCounter = 0;
const genId = () => `st-${++idCounter}`;

const Ctx = createContext(null);

export function StatusProvider({ children }) {
  const [pending, setPending] = useState(null);   // {id,msg}
  const [toasts, setToasts]   = useState([]);     // [{id,msg,type}]

  const pushToast = useCallback((msg, type='success') => {
    const id = genId();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const run = useCallback(
    async (fn, pendingMsg = msgs.generic.loading) => {
      const id = genId();
      setPending({ id, msg: pendingMsg });
      try {
        return await fn();
      } finally {
        setPending(p => (p?.id === id ? null : p));
      }
    },
    []
  );

  const success = useCallback(msg => pushToast(msg, 'success'), [pushToast]);
  const error   = useCallback(msg => pushToast(msg, 'error'),   [pushToast]);

  return (
    <Ctx.Provider value={{ pending, toasts, run, success, error }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStatus() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStatus must be inside <StatusProvider>');
  return ctx;
}