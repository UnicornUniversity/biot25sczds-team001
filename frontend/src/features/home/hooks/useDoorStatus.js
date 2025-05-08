'use client';

import { useState, useEffect, useCallback } from 'react';
import { authFetch } from '@/lib/authFetch';
import { API_ROUTES } from '@/lib/apiRoutes';
import { useStatus } from '@/lib/StatusContext';
import msgs from '@/lib/messages';

export default function useDoorStatus() {
  const { run, success, error } = useStatus();
  const [doors, setDoors] = useState([]);

  const fetchStatus = useCallback(() => 
    run(async () => {
      const res = await authFetch(API_ROUTES.doors.status);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { data } = await res.json();
      return data;
    }, msgs.homeDoors.fetch)
      .then(data => {
        setDoors(data);
        success(msgs.homeDoors.fetchSuccess);
      })
      .catch(err => {
        error(msgs.homeDoors.fetchError.replace('{error}', err.message));
      })
  , [run, success, error]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { doors, refresh: fetchStatus };
}