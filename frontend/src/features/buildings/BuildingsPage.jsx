'use client';

import { useState } from 'react';
import BuildingsList     from './components/BuildingsList';
import BuildingAddModal  from './modals/BuildingAddModal';
import BuildingEditModal from './modals/BuildingEditModal';
import BuildingLogsModal from './modals/BuildingLogsModal';
import useBuildings      from './hooks/useBuildings';

import styles from './BuildingsPage.module.css';

export default function BuildingsPage() {
  const {
    buildings,
    gateways,
    unattachedGws,
    fetchBuilding,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    fetchBuildingLogs,
  } = useBuildings();

  const [addOpen, setAddOpen] = useState(false);
  const [editBld, setEditBld] = useState(null);
  const [logsBld, setLogsBld] = useState(null);

  // složí seznam gateway pro edit modal: volné + aktuálně přiřazená
  const composeGwList = gwId => {
    const inList = unattachedGws.find(g => g._id === gwId);
    if (inList) return unattachedGws;
    const current = gateways.find(g => g._id === gwId);
    return current ? [...unattachedGws, current] : unattachedGws;
  };

  // při kliknutí na Upravit: stáhni plný záznam (včetně gatewayId)
  const handleEdit = async b => {
    try {
      const full = await fetchBuilding(b._id);
      setEditBld(full);
    } catch {
      // sem můžeš přidat chybovou hlášku
    }
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Správa budov</h1>

      <BuildingsList
        buildings={buildings}
        onAdd={() => setAddOpen(true)}
        onEdit={handleEdit}
        onLogs={setLogsBld}
      />

      {addOpen && (
        <BuildingAddModal
          gateways={unattachedGws}
          onClose={() => setAddOpen(false)}
          onSubmit={data => { addBuilding(data); setAddOpen(false); }}
        />
      )}

      {editBld && (
        <BuildingEditModal
          building={editBld}
          gateways={composeGwList(editBld.gatewayId)}
          onClose={() => setEditBld(null)}
          onSubmit={(id, data) => { updateBuilding(id, data); setEditBld(null); }}
          onDelete={id => { deleteBuilding(id); setEditBld(null); }}
        />
      )}

      {logsBld && (
        <BuildingLogsModal
          building={logsBld}
          fetchLogs={fetchBuildingLogs}
          onClose={() => setLogsBld(null)}
        />
      )}
    </main>
  );
}