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

  /* Map kvůli rychlé deduplikaci */
  const [logMap, setLogMap]     = useState(() => new Map());
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize,
    total: 0,
    totalPages: 1,
  });

  /* helper – převod Map → array, novější první */
  const mapToArray = m =>
    [...m.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  /* ---------- realtime log:new ---------- */
  useEffect(() => {
    if (!token) return;
    const socket = initSocket(token);

    const handler = newLog =>
      setLogMap(m => {
        const map = new Map(m);
        map.set(newLog._id, newLog);     // přepíše duplicitní
        return map;
      });

    socket.on('log:new', handler);
    return () => socket.off('log:new', handler);
  }, [token]);

  /* ---------- REST fetch ---------- */
  const fetchPage = useCallback(
    async page => {
      const url = API_ROUTES.logs.listByUser(null, page, pageSize);
      const res = await authFetch(url);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();   // { itemList, pageInfo }
    },
    [pageSize]
  );

  /* prvotní načtení */
  useEffect(() => {
    run(() => fetchPage(1), msgs.homeLogs.fetch)
      .then(({ itemList, pageInfo: pi }) => {
        setLogMap(new Map(itemList.map(l => [l._id, l])));
        setPageInfo(pi);
        success(msgs.homeLogs.fetchSuccess);
      })
      .catch(err => error(msgs.homeLogs.fetchError.replace('{error}', err.message)));
  }, [fetchPage, run, success, error]);

  /* načti další stránku – merge unique */
  const nextPage = () => {
    if (pageInfo.page >= pageInfo.totalPages) return;
    const next = pageInfo.page + 1;

    run(() => fetchPage(next), msgs.homeLogs.fetch)
      .then(({ itemList }) => {
        setLogMap(m => {
          const map = new Map(m);
          itemList.forEach(l => map.set(l._id, l));
          return map;
        });
        setPageInfo(pi => ({ ...pi, page: next }));
      })
      .catch(err => error(msgs.homeLogs.fetchError.replace('{error}', err.message)));
  };

  return {
    logs: mapToArray(logMap),
    pageInfo,
    nextPage,
    canLoadMore: pageInfo.page < pageInfo.totalPages,
  };
}