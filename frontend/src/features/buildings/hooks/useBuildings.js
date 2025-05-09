// src/hooks/useBuildings.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { API_ROUTES } from '@/lib/apiRoutes';
import { useAuth }    from '@/lib/AuthContext';
import { useStatus }  from '@/lib/StatusContext';
import msgs           from '@/lib/messages';
import { authFetch }  from '@/lib/authFetch';

export default function useBuildings(initialPageSize = 9) {
  const { token, user } = useAuth();
  const { run, success, error } = useStatus();

  // Data lists
  const [buildings, setBuildings]         = useState([]);
  const [gateways, setGateways]           = useState([]);
  const [unattachedGws, setUnattachedGws] = useState([]);

  // Pagination state
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    pageSize: initialPageSize,
    total: 0,
    totalPages: 1,
  });

  // Fetch paginated buildings
  const fetchBuildings = useCallback(() => {
    if (!token || !user) return;
    run(
      async () => {
        const { page, pageSize } = pageInfo;
        const res = await authFetch(API_ROUTES.buildings.list(page, pageSize));
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      },
      msgs.buildings.fetch
    )
    .then(json => {
      setBuildings(json.itemList);
      setPageInfo(json.pageInfo);
      success(msgs.buildings.fetchSuccess);
    })
    .catch(err => {
      error(msgs.buildings.fetchError.replace('{error}', err.message));
    });
  }, [token, user, run, success, error, pageInfo.page, pageInfo.pageSize]);

  // Fetch all gateways (for modals)
  const fetchGateways = useCallback(() => {
    if (!token || !user) return;
    run(
      async () => {
        const res = await authFetch(API_ROUTES.gateways.list({ ownerId: user.id }));
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      },
      msgs.gateways.fetch
    )
    .then(json => {
      setGateways(json.itemList);
      success(msgs.gateways.fetchSuccess);
    })
    .catch(err => {
      error(msgs.gateways.fetchError.replace('{error}', err.message));
    });
  }, [token, user, run, success, error]);

  // Fetch unattached gateways
  const fetchUnattached = useCallback(() => {
    if (!token || !user) return;
    run(
      async () => {
        const res = await authFetch(API_ROUTES.gateways.available);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      },
      msgs.gateways.fetch
    )
    .then(json => {
      setUnattachedGws(json.data);
      success(msgs.gateways.fetchSuccess);
    })
    .catch(err => {
      error(msgs.gateways.fetchError.replace('{error}', err.message));
    });
  }, [token, user, run, success, error]);

  // Combined initial data load
  const fetchAll = useCallback(() => {
    fetchBuildings();
    fetchGateways();
    fetchUnattached();
  }, [fetchBuildings, fetchGateways, fetchUnattached]);

  // Re-fetch when dependencies change
  useEffect(fetchAll, [fetchAll]);

  // Pagination controls
  const nextPage = useCallback(() => {
    setPageInfo(pi => ({
      ...pi,
      page: Math.min(pi.page + 1, pi.totalPages)
    }));
  }, []);
  const prevPage = useCallback(() => {
    setPageInfo(pi => ({
      ...pi,
      page: Math.max(pi.page - 1, 1)
    }));
  }, []);

  // Fetch single building detail
  const fetchBuilding = useCallback((id) =>
    run(
      async () => {
        const res = await authFetch(API_ROUTES.buildings.get(id));
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        return json.data;
      },
      msgs.buildings.fetch
    )
    .catch(err => {
      error(msgs.buildings.fetchError.replace('{error}', err.message));
      throw err;
    })
  , [run, error]);

// Create a new building
const addBuilding = useCallback(data =>
  run(async () => {
    const payload = { name: data.name, description: data.description, gatewayId: data.gatewayId };
    const res = await authFetch(API_ROUTES.buildings.create, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.clone().text();
      throw new Error(`Status ${res.status}: ${errBody}`);
    }
    const { data: newBld } = await res.json();
    setBuildings(bs => [newBld, ...bs]);
    return newBld;
  }, msgs.buildings.create)
    .then(b => {
      success(msgs.buildings.createSuccess);
      return b;
    })
    .catch(err => {
      error(msgs.buildings.createError.replace('{error}', err.message));
      throw err;
    })
, [run, success, error]);

// Update existing building
const updateBuilding = useCallback((id, data) =>
  run(async () => {
    const payload = { name: data.name, description: data.description, gatewayId: data.gatewayId };
    const res = await authFetch(API_ROUTES.buildings.update(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.clone().text();
      throw new Error(`Status ${res.status}: ${errBody}`);
    }
    const { data: updatedBld } = await res.json();
    setBuildings(bs => bs.map(b => b._id === id ? updatedBld : b));
    return updatedBld;
  }, msgs.buildings.update)
    .then(b => {
      success(msgs.buildings.updateSuccess);
      return b;
    })
    .catch(err => {
      error(msgs.buildings.updateError.replace('{error}', err.message));
      throw err;
    })
, [run, success, error]);

// Delete building
const deleteBuilding = useCallback(id =>
  run(async () => {
    const res = await authFetch(API_ROUTES.buildings.delete(id), { method: 'DELETE' });
    if (!res.ok) {
      const errBody = await res.clone().text();
      throw new Error(`Status ${res.status}: ${errBody}`);
    }
    setBuildings(bs => bs.filter(b => b._id !== id));
  }, msgs.buildings.delete)
    .then(() => {
      success(msgs.buildings.deleteSuccess);
    })
    .catch(err => {
      error(msgs.buildings.deleteError.replace('{error}', err.message));
      throw err;
    })
, [run, success, error]);

// uvnitř src/hooks/useBuildings.js
const fetchBuildingLogs = useCallback(
  (buildingId, pageSize = 5, page = 1, severity = '') =>
    run(async () => {
      const url = API_ROUTES.buildings.logs(buildingId, page, pageSize, severity);
      const res = await authFetch(url);
      if (!res.ok) throw new Error(await res.clone().text() || `Status ${res.status}`);
      return res.json();              // { itemList, pageInfo }
    }, msgs.buildings.fetchLogs)
      .then(({ itemList, pageInfo }) => ({ logs: itemList, pageInfo }))
      .catch(err => {
        error(msgs.buildings.fetchLogsError.replace('{error}', err.message));
        throw err;
      }),
  [run, error]
);

  return {
    buildings,
    gateways,
    unattachedGws,
    pageInfo,
    nextPage,
    prevPage,
    fetchBuilding,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    fetchBuildingLogs,
  };
}