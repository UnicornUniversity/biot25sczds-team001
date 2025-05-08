'use client';

import { useState, useEffect, useCallback } from 'react';
import { authFetch } from '@/lib/authFetch';
import { API_ROUTES } from '@/lib/apiRoutes';
import { useStatus } from '@/lib/StatusContext';
import msgs from '@/lib/messages';

export default function useDoorStatus(initialPageSize = 8) {
  const { run, success, error } = useStatus();
  const [doors, setDoors]       = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: initialPageSize,
    total: 0,
    totalPages: 1,
  });

  const fetchPage = useCallback((page = 1) =>
    run(async () => {
      const { pageSize } = pageInfo;
      const url = `${API_ROUTES.doors.status}?page=${page}&pageSize=${pageSize}`;
      const res = await authFetch(url);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();
    }, msgs.homeDoors.fetch)
      .then(json => {
        setDoors(json.itemList);
        setPageInfo(json.pageInfo);
        success(msgs.homeDoors.fetchSuccess);
      })
      .catch(err => {
        error(msgs.homeDoors.fetchError.replace('{error}', err.message));
      })
  , [pageInfo.pageSize, run, success, error]);

  useEffect(() => { fetchPage(pageInfo.page); }, [fetchPage]);

  const nextPage = () => {
    if (pageInfo.page < pageInfo.totalPages) {
      fetchPage(pageInfo.page + 1);
    }
  };
  const prevPage = () => {
    if (pageInfo.page > 1) {
      fetchPage(pageInfo.page - 1);
    }
  };

  return { doors, pageInfo, nextPage, prevPage, refresh: () => fetchPage(1) };
}