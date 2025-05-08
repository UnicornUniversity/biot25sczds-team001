'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useStatus } from '@/lib/StatusContext';
import msgs from '@/lib/messages';
import { authFetch } from '@/lib/authFetch';
import { API_ROUTES } from '@/lib/apiRoutes';

export default function useDoors(buildingId) {
  const { run, success, error } = useStatus();
  const { user } = useAuth();

  const [doors, setDoors] = useState([]);
  const [userFavs, setUserFavs] = useState([]);
  const [controllers, setControllers] = useState([]);

  // 1) seed favouriteDoors from user.profile
  useEffect(() => {
    if (user?.favouriteDoors) {
      setUserFavs(user.favouriteDoors);
    }
  }, [user]);

  // 2) fetch controllers (unassigned devices)
  const fetchControllers = useCallback(
    () =>
      run(async () => {
        const gwRes = await authFetch(API_ROUTES.gateways.list({ buildingId, created: true }));
        if (!gwRes.ok) throw new Error(`GW list ${gwRes.status}`);
        const { itemList: gws } = await gwRes.json();

        const all = [];
        await Promise.all(
          gws.map(async gw => {
            const ctrlRes = await authFetch(`${API_ROUTES.devices.available}?gatewayId=${gw._id}`);
            if (!ctrlRes.ok) throw new Error(`Ctr ${gw._id} ${ctrlRes.status}`);
            const { data } = await ctrlRes.json();
            all.push(...data);
          })
        );
        setControllers(all);
      }, msgs.devices.fetch).catch(err =>
        error(msgs.devices.fetchError.replace('{error}', err.message))
      ),
    [buildingId, run, error]
  );

  // 3) fetch doors (either by building or favourites endpoint)
  const fetchDoors = useCallback(
    () =>
      run(async () => {
        let res;
        if (buildingId) {
          res = await authFetch(API_ROUTES.doors.listByBuilding(buildingId));
        } else {
          res = await authFetch(API_ROUTES.doors.favourites);
        }
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      }, msgs.doors.fetch)
        .then(async payload => {
          let list, favs;
          if (buildingId) {
            // building view
            list = payload.itemList;
            favs = payload.favouriteDoors;
          } else {
            // favourites view
            list = payload.data;
            favs = user?.favouriteDoors || [];
          }
          setDoors(list);
          setUserFavs(favs || []);
          success(msgs.doors.fetchSuccess);
          await fetchControllers();
        })
        .catch(err =>
          error(msgs.doors.fetchError.replace('{error}', err.message))
        ),
    [buildingId, run, success, error, fetchControllers, user]
  );

  // initial load
  useEffect(() => {
    fetchDoors();
  }, [fetchDoors]);

  // 4) other door actions (create, update, delete, lock, favourite, reset) remain unchanged:

  const addDoor = useCallback(
    form =>
      run(async () => {
        const res = await authFetch(API_ROUTES.doors.create, {
          method: 'POST',
          body: JSON.stringify({ ...form, buildingId }),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return (await res.json()).data;
      }, msgs.doors.create)
        .then(async newDoor => {
          setDoors(prev => [newDoor, ...prev]);
          success(msgs.doors.createSuccess);
          await fetchControllers();
        })
        .catch(err =>
          error(msgs.doors.createError.replace('{error}', err.message))
        ),
    [buildingId, run, success, error, fetchControllers]
  );

  const updateDoor = useCallback(
    (id, form) =>
      run(async () => {
        const res = await authFetch(API_ROUTES.doors.update(id), {
          method: 'PUT',
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return (await res.json()).data;
      }, msgs.doors.update)
        .then(async updated => {
          setDoors(prev => prev.map(d => (d._id === id ? updated : d)));
          success(msgs.doors.updateSuccess);
          await fetchDoors();
        })
        .catch(err =>
          error(msgs.doors.updateError.replace('{error}', err.message))
        ),
    [run, success, error, fetchDoors]
  );

  const deleteDoor = useCallback(
    id =>
      run(async () => {
        const res = await authFetch(API_ROUTES.doors.delete(id), { method: 'DELETE' });
        if (!res.ok) throw new Error(`Status ${res.status}`);
      }, msgs.doors.delete)
        .then(async () => {
          setDoors(prev => prev.filter(d => d._id !== id));
          success(msgs.doors.deleteSuccess);
          await fetchDoors();
        })
        .catch(err =>
          error(msgs.doors.deleteError.replace('{error}', err.message))
        ),
    [run, success, error, fetchDoors]
  );

  const toggleLock = useCallback(
    id =>
      run(async () => {
        const res = await authFetch(API_ROUTES.doors.toggleLock(id), { method: 'POST' });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return (await res.json()).data;
      }, msgs.doors.toggleLock)
        .then(updated => {
          setDoors(prev => prev.map(d => (d._id === id ? updated : d)));
          success(msgs.doors.toggleLockSuccess);
        })
        .catch(err =>
          error(msgs.doors.toggleLockError.replace('{error}', err.message))
        ),
    [run, success, error]
  );

// ... uvnitř useDoors hooku
const toggleFavourite = useCallback(
  (id) =>
    run(async () => {
      const res = await authFetch(API_ROUTES.doors.toggleFavourite(id), {
        method: 'POST',
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return (await res.json()).data; // nové pole fav IDs
    }, msgs.doors.toggleFavourite)
      .then((favs) => {
        console.log('[useDoors] new favs after toggle:', favs);
        setUserFavs(favs || []);

        // pokud jsme na stránce "favourites", hned z oblíbených dveří smaž tu jednu
        if (buildingId === null) {
          setDoors((prev) => prev.filter((d) => favs.includes(d._id)));
        }

        success(msgs.doors.toggleFavouriteSuccess);
      })
      .catch((err) =>
        error(`Chyba oblíbených dveří: ${err.message}`)
      ),
  [run, success, error, buildingId]
);

  const resetState = useCallback(
    id =>
      run(async () => {
        const res = await authFetch(API_ROUTES.doors.toggleState(id), { method: 'POST' });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return (await res.json()).data;
      }, msgs.doors.resetState)
        .then(updated => {
          setDoors(prev => prev.map(d => (d._id === id ? updated : d)));
          success(msgs.doors.resetStateSuccess);
        })
        .catch(err =>
          error(msgs.doors.resetStateError.replace('{error}', err.message))
        ),
    [run, success, error]
  );

  const fetchDoorLogs = useCallback(
    (id, limit = 10) =>
      run(async () => {
        const res = await authFetch(API_ROUTES.doors.logs(id, limit, 0));
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return (await res.json()).data;
      }, msgs.doors.fetchLogs)
        .then(logs => {
          success(msgs.doors.fetchLogsSuccess);
          return logs;
        })
        .catch(err => {
          error(msgs.doors.fetchLogsError.replace('{error}', err.message));
          throw err;
        }),
    [run, success, error]
  );

  const fetchDoorDetail = useCallback(
    async id => {
      const res = await authFetch(API_ROUTES.doors.get(id));
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { data } = await res.json();
      return data;
    },
    []
  );

  const changeState = useCallback(
    (id, newState) =>
      run(async () => {
        const res = await authFetch(API_ROUTES.doors.toggleState(id), {
          method: 'POST',
          body: JSON.stringify({ state: newState }),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return (await res.json()).data;
      }, msgs.doors.toggleState)
        .then((updated) => {
          setDoors((prev) =>
            prev.map((d) => (d._id === id ? updated : d))
          );
          success(msgs.doors.toggleStateSuccess);
        })
        .catch((err) =>
          error(msgs.doors.toggleStateError.replace('{error}', err.message))
        ),
    [run, success, error]
  );

  return {
    doors,
    userFavs,
    controllers,
    fetchDoors,
    fetchDoorDetail,
    addDoor,
    updateDoor,
    deleteDoor,
    toggleLock,
    toggleFavourite,
    resetState,
    fetchDoorLogs,
    changeState,
  };
}