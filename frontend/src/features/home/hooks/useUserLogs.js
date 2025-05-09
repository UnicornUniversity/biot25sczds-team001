'use client';

import { useState, useEffect, useCallback } from 'react';
import { authFetch }  from '@/lib/authFetch';
import { API_ROUTES } from '@/lib/apiRoutes';
import { useStatus }  from '@/lib/StatusContext';
import { initSocket } from '@/lib/socket';
import { useAuth }    from '@/lib/AuthContext';
import msgs           from '@/lib/messages';

export default function useUserLogs(pageSize = 5) {
  const { run, success, error } = useStatus();
  const { token } = useAuth();

  const [logs, setLogs]         = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize,
    total: 0,
    totalPages: 1,
  });

  /* ---------- realtime log:new ---------- */
  useEffect(() => {
    if (!token) return;
    const socket = initSocket(token);

    const handler = newLog =>
      setLogs(ls => [newLog, ...ls]);   // vždy připíchni navrch

    socket.on('log:new', handler);
    return () => socket.off('log:new', handler);
  }, [token]);

  /* ---------- REST fetch (paginace, přidávání) ---------- */
  const fetchPage = useCallback(
    async page => {
      const url = API_ROUTES.logs.listByUser(null, page, pageSize);
      const res = await authFetch(url);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();                       // { itemList, pageInfo }
    },
    [pageSize]
  );

  /* prvotní načtení */
  useEffect(() => {
    run(() => fetchPage(1), msgs.homeLogs.fetch)
      .then(({ itemList, pageInfo: pi }) => {
        setLogs(itemList);
        setPageInfo(pi);
        success(msgs.homeLogs.fetchSuccess);
      })
      .catch(err => error(msgs.homeLogs.fetchError.replace('{error}', err.message)));
  }, [fetchPage, run, success, error]);

  /* načti další stránku – přilep na konec */
  const nextPage = () => {
    if (pageInfo.page >= pageInfo.totalPages) return;
    const next = pageInfo.page + 1;

    run(() => fetchPage(next), msgs.homeLogs.fetch)
      .then(({ itemList }) => {
        setLogs(ls => [...ls, ...itemList]);      // připoj
        setPageInfo(pi => ({ ...pi, page: next }));
      })
      .catch(err => error(msgs.homeLogs.fetchError.replace('{error}', err.message)));
  };

  const canLoadMore = pageInfo.page < pageInfo.totalPages;

  return { logs, pageInfo, nextPage, canLoadMore };
}