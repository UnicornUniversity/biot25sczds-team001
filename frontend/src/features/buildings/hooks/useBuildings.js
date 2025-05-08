'use client';

import { useState, useEffect, useCallback } from 'react';
import { API_ROUTES } from '@/lib/apiRoutes';
import { useAuth }    from '@/lib/AuthContext';
import { useStatus }  from '@/lib/StatusContext';
import msgs           from '@/lib/messages';
import { authFetch }  from '@/lib/authFetch';

export default function useBuildings() {
  const { token, user } = useAuth();
  const { run, success, error } = useStatus();

  const [buildings, setBuildings]         = useState([]);
  const [gateways, setGateways]           = useState([]); // pro edit
  const [unattachedGws, setUnattachedGws] = useState([]); // volné pro add/edit

  const fetchData = useCallback(() => {
    if (!token || !user) return;

    // 1) buildings
    run(async () => {
      const res = await authFetch(API_ROUTES.buildings.list());
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setBuildings(json.itemList);
      success(msgs.buildings.fetchSuccess);
    }, msgs.buildings.fetch)
      .catch(err => error(msgs.buildings.fetchError.replace('{error}', err.message)));

    // 2) všechny gateway
    run(async () => {
      const res = await authFetch(API_ROUTES.gateways.list({ ownerId: user.id }));
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setGateways(json.itemList);
      success(msgs.gateways.fetchSuccess);
    }, msgs.gateways.fetch)
      .catch(err => error(msgs.gateways.fetchError.replace('{error}', err.message)));

    // 3) dostupné gateway
    run(async () => {
      const res = await authFetch(API_ROUTES.gateways.available);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      setUnattachedGws(json.data);
      success(msgs.gateways.fetchSuccess);
    }, msgs.gateways.fetch)
      .catch(err => error(msgs.gateways.fetchError.replace('{error}', err.message)));

  }, [token, user, run, success, error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // fetch single building (včetně gatewayId)
  const fetchBuilding = useCallback((id) =>
    run(async () => {
      const res = await authFetch(API_ROUTES.buildings.get(id));
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      return json.data;
    }, msgs.buildings.fetch)
      .catch(err => { error(msgs.buildings.fetchError.replace('{error}', err.message)); throw err; })
  , [run, error]);

  // create
  const addBuilding = useCallback(data =>
    run(async () => {
      const payload = { name: data.name, description: data.description, gatewayId: data.gatewayId };
      const res = await authFetch(API_ROUTES.buildings.create, {
        method: 'POST',
        body:   JSON.stringify(payload),
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
        fetchData();
        return b;
      })
      .catch(err => { error(msgs.buildings.createError.replace('{error}', err.message)); throw err; })
  , [run, success, error, fetchData]);

  // update
  const updateBuilding = useCallback((id, data) =>
    run(async () => {
      const payload = { name: data.name, description: data.description, gatewayId: data.gatewayId };
      const res = await authFetch(API_ROUTES.buildings.update(id), {
        method: 'PUT',
        body:   JSON.stringify(payload),
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
        fetchData();             // refresh gateways/unattachedGws
        return b;
      })
      .catch(err => { error(msgs.buildings.updateError.replace('{error}', err.message)); throw err; })
  , [run, success, error, fetchData]);

  // delete
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
        fetchData();             // po smazání taky refresh gateway stavy
      })
      .catch(err => { error(msgs.buildings.deleteError.replace('{error}', err.message)); throw err; })
  , [run, success, error, fetchData]);

  // logs
  const fetchBuildingLogs = useCallback(buildingId =>
    run(async () => {
      const res = await authFetch(API_ROUTES.buildings.logs(buildingId));
      if (!res.ok) {
        const errBody = await res.clone().text();
        throw new Error(`Status ${res.status}: ${errBody}`);
      }
      const { data } = await res.json();
      return data;
    }, msgs.buildings.fetchLogs)
      .then(logs => { success(msgs.buildings.fetchLogsSuccess); return logs; })
      .catch(err => { error(msgs.buildings.fetchLogsError.replace('{error}', err.message)); throw err; })
  , [run, success, error]);

  return {
    buildings,
    gateways,
    unattachedGws,
    fetchBuilding,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    fetchBuildingLogs,
  };
}
