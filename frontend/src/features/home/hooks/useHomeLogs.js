// src/features/home/hooks/useHomeLogs.js
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

import buildingsMock from '@/mock/buildings.json';
import doorsMock     from '@/mock/doors.json';
import logsMock      from '@/mock/logs.json';
import { getCurrentUserId } from '@/mock/session';

import { useStatus } from '@/lib/StatusContext';
import msgs          from '@/lib/messages';

const delay = ms => new Promise(res => setTimeout(res, ms));

export default function useHomeLogs(initialLimit = 5) {
  const { run, success, error } = useStatus();
  const uid = getCurrentUserId();

  /* ------------ předpočítaná data (nemění se) -------------------- */
  const buildingIds = useMemo(
    () => buildingsMock.filter(b => b.ownerId === uid).map(b => b._id),
    [uid]
  );

  const doorIds = useMemo(
    () => doorsMock.filter(d => buildingIds.includes(d.buildingId)).map(d => d._id),
    [buildingIds]
  );

  const allLogs = useMemo(
    () =>
      logsMock
        .filter(l => doorIds.includes(l.doorId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [doorIds]
  );

  /* ------------ stav UI ------------------------------------------- */
  const [limit, setLimit] = useState(initialLimit);
  const [logs,  setLogs]  = useState([]);

  /* ------------ „fetch“ ------------------------------------------- */
  const fetchLogs = useCallback(
    async () => {
      await delay(260);
      return allLogs.slice(0, limit);
    },
    [allLogs, limit]
  );

  /* ------------ API handlery ------------------------------------- */
  const refresh = useCallback(() => {
    return run(() => fetchLogs(), msgs.homeLogs.fetch)
      .then(fetched => {
        setLogs(fetched);
        success(msgs.homeLogs.fetchSuccess);
      })
      .catch(err => {
        error(msgs.homeLogs.fetchError.replace('{error}', err.message));
      });
  }, [run, fetchLogs, success, error]);

  const loadMore = useCallback(() => {
    setLimit(l => l + 5);
  }, []);

  const collapse = useCallback(() => {
    setLimit(initialLimit);
  }, [initialLimit]);

  /* ------------ efekt na změnu limitu ---------------------------- */
  useEffect(() => {
    refresh();
  }, [limit, refresh]);

  return {
    logs,
    onRefresh:  refresh,
    onShowMore: loadMore,
    onCollapse: collapse,
    canLoadMore: limit < allLogs.length,
  };
}