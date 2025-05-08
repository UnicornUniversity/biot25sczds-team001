'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth }    from '@/lib/AuthContext';
import { authFetch }  from '@/lib/authFetch';
import { API_ROUTES } from '@/lib/apiRoutes';
import { useStatus }  from '@/lib/StatusContext';
import msgs           from '@/lib/messages';

export default function useDevices(currentBuildingId) {
  const { user } = useAuth();
  const ownerId  = user?.id;
  const { run, success, error } = useStatus();

  // --- Gateways ---
  const [gateways, setGateways]       = useState([]);
  const [templatesGw, setTemplatesGw] = useState([]);
  const [availableGw, setAvailableGw] = useState([]);

  // --- Controllers ---
  const [controllers, setControllers]     = useState([]);
  const [templatesCtrl, setTemplatesCtrl] = useState([]);
  const [availableCtrl, setAvailableCtrl] = useState([]);

  // Load gateways and controllers on mount / owner change
  useEffect(() => {
    // 1) Fetch gateways
    run(
      async () => {
        const [gwRes, tplGwRes, availGwRes] = await Promise.all([
          authFetch(API_ROUTES.gateways.list({ ownerId, created: true })),
          authFetch(API_ROUTES.gateways.templates),
          authFetch(API_ROUTES.gateways.available),
        ]);
        if (!gwRes.ok)     throw new Error(`GW list ${gwRes.status}`);
        if (!tplGwRes.ok)  throw new Error(`GW templates ${tplGwRes.status}`);
        if (!availGwRes.ok)throw new Error(`GW available ${availGwRes.status}`);

        const { itemList: gwList } = await gwRes.json();
        const { data: tplGwList }  = await tplGwRes.json();
        const { data: availGwList}= await availGwRes.json();

        setGateways(gwList);
        setTemplatesGw(tplGwList);
        setAvailableGw(availGwList);
        success(msgs.gateways.fetchSuccess);
      },
      msgs.gateways.fetch
    )
    .catch(err => error(msgs.gateways.fetchError.replace('{error}', err.message)));

    // 2) Fetch controllers
    run(
      async () => {
        const devRes = await authFetch(
          API_ROUTES.devices.list({ created: true, gatewayId: currentBuildingId })
        );
        if (!devRes.ok) throw new Error(`Device list ${devRes.status}`);
        const { itemList: devList } = await devRes.json();
        setControllers(devList);
        success(msgs.devices.fetchSuccess);
      },
      msgs.devices.fetch
    )
    .catch(err => error(msgs.devices.fetchError.replace('{error}', err.message)));
  }, [ownerId, currentBuildingId, run, success, error]);

  // --- Gateway actions ---
  const attachGateway = useCallback((templateId, { name, description }) =>
    run(
      async () => {
        const res = await authFetch(API_ROUTES.gateways.attach(templateId), {
          method: 'PUT',
          body: JSON.stringify({ created: true, buildingId: currentBuildingId, name, description }),
        });
        if (!res.ok) throw new Error(`Attach GW ${res.status}`);
        const { data: gw } = await res.json();
        setGateways(g => [gw, ...g]);
        setTemplatesGw(t => t.filter(x => x._id !== templateId));
        success(msgs.gateways.createSuccess);
        return gw;
      },
      msgs.gateways.create
    )
    .catch(err => { error(msgs.gateways.createError.replace('{error}', err.message)); throw err; })
  , [run, currentBuildingId, error]);

  const updateGateway = useCallback((id, data) =>
    run(
      async () => {
        const res = await authFetch(API_ROUTES.gateways.update(id), {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Update GW ${res.status}`);
        const { data: gw } = await res.json();
        setGateways(g => g.map(x => x._id === gw._id ? gw : x));
        success(msgs.gateways.updateSuccess);
        return gw;
      },
      msgs.gateways.update
    )
    .catch(err => { error(msgs.gateways.updateError.replace('{error}', err.message)); throw err; })
  , [run, error]);

  const detachGateway = useCallback(id =>
    run(
      async () => {
        const res = await authFetch(API_ROUTES.gateways.detach(id), { method: 'DELETE' });
        if (!res.ok) throw new Error(`Detach GW ${res.status}`);
        const { data: gw } = await res.json();
        setGateways(g => g.filter(x => x._id !== id));
        setTemplatesGw(t => [gw, ...t]);
        success(msgs.gateways.deleteSuccess);
        return gw;
      },
      msgs.gateways.delete
    )
    .catch(err => { error(msgs.gateways.deleteError.replace('{error}', err.message)); throw err; })
  , [run, error]);

  // --- Controller actions ---
  const attachController = useCallback((templateId, { gatewayId, doorId, name, description }) =>
    run(
      async () => {
        const res = await authFetch(API_ROUTES.devices.update(templateId), {
          method: 'PUT',
          body: JSON.stringify({ created: true, gatewayId, doorId, name, description }),
        });
        if (!res.ok) throw new Error(`Attach DEV ${res.status}`);
        const { data: dev } = await res.json();
        setControllers(d => [dev, ...d]);
        setTemplatesCtrl(t => t.filter(x => x._id !== templateId));
        success(msgs.devices.createSuccess);
        return dev;
      },
      msgs.devices.create
    )
    .catch(err => { error(msgs.devices.createError.replace('{error}', err.message)); throw err; })
  , [run, error]);

  const updateController = useCallback((id, data) =>
    run(
      async () => {
        const res = await authFetch(API_ROUTES.devices.update(id), {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Update DEV ${res.status}`);
        return (await res.json()).data;
      },
      msgs.devices.update
    )
    .then(dev => { setControllers(d => d.map(x => x._id === dev._id ? dev : x)); success(msgs.devices.updateSuccess); })
    .catch(err => error(msgs.devices.updateError.replace('{error}', err.message)))
  ,[run, error]);

  const detachController = useCallback((id) =>
    run(
      async () => {
        const res = await authFetch(`/devices/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ created: false }),
        });
        if (!res.ok) throw new Error(`Detach DEV ${res.status}`);
        const { data: dev } = await res.json();
        setControllers(prev => prev.filter(c => c._id !== id));
        success(msgs.devices.deleteSuccess);
        return dev;
      },
      msgs.devices.delete
    )
    .catch(err => { error(msgs.devices.deleteError.replace('{error}', err.message)); throw err; })
  , [run, error]);

  return {
    gateways,
    templatesGw,
    availableGw,
    controllers,
    templatesCtrl,
    availableCtrl,
    attachGateway,
    updateGateway,
    detachGateway,
    attachController,
    updateController,
    detachController,
  };
}
