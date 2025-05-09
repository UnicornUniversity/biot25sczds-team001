'use client';

import { useState, useEffect, useCallback } from 'react';
import { authFetch }   from '@/lib/authFetch';
import { API_ROUTES }  from '@/lib/apiRoutes';
import { useStatus }   from '@/lib/StatusContext';
import { initSocket }  from '@/lib/socket';
import { useAuth }     from '@/lib/AuthContext';
import msgs            from '@/lib/messages';

export default function useDoorStatus(initialPageSize = 8) {
  const { run, success, error } = useStatus();
  const { token } = useAuth();

  const [doors, setDoors]       = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: initialPageSize,
    total: 0,
    totalPages: 1,
  });

  /* ---------- real‑time door:state ---------- */
  useEffect(() => {
    if (!token) return;
    const socket = initSocket(token);

    const handler = ({ doorId, doorName, buildingId, state, locked, updatedAt }) => {
      if (state !== 'alert') {
        // už není v alertu → smaž
        setDoors(ds => ds.filter(d => d.doorId !== doorId));
        return;
      }

      // přidej nebo aktualizuj
      setDoors(ds => {
        const idx = ds.findIndex(d => d.doorId === doorId);
        if (idx === -1) {
          return [
            { doorId, doorName, buildingId, state, locked, updatedAt },
            ...ds
          ];
        }
        const copy = [...ds];
        copy[idx] = { ...copy[idx], doorName, buildingId, state, locked, updatedAt };
        return copy;
      });
    };

    socket.on('door:state', handler);
    return () => socket.off('door:state', handler);
  }, [token]);

  /* ---------- REST fetch ---------- */
  const fetchPage = useCallback(
    (page = 1) =>
      run(async () => {
        const { pageSize } = pageInfo;
        const url = `${API_ROUTES.doors.status}?page=${page}&pageSize=${pageSize}`;
        const res = await authFetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      }, msgs.homeDoors.fetch)
        .then(json => {
          setDoors(json.itemList);        // itemList already contains doorName & buildingId
          setPageInfo(json.pageInfo);
          success(msgs.homeDoors.fetchSuccess);
        })
        .catch(err => error(msgs.homeDoors.fetchError.replace('{error}', err.message))),
    [pageInfo.pageSize, run, success, error]
  );

  useEffect(() => { fetchPage(pageInfo.page); }, [fetchPage]);

  const nextPage = () => pageInfo.page < pageInfo.totalPages && fetchPage(pageInfo.page + 1);
  const prevPage = () => pageInfo.page > 1 && fetchPage(pageInfo.page - 1);

  return { doors, pageInfo, nextPage, prevPage, refresh: () => fetchPage(1) };
}