'use client';

import { useState } from 'react';
import DoorsList     from './components/DoorsList';
import DoorAddModal  from './modals/DoorAddModal';
import DoorEditModal from './modals/DoorEditModal';
import DoorLogsModal from './modals/DoorLogsModal';
import useDoors      from './hooks/useDoors';
import styles        from './DoorsPage.module.css';

export default function DoorsPage({ buildingId }) {
  const {
    doors,
    userFavs,
    controllers,
    buildingName,   // <-- nově z hooku
    pageInfo,
    nextPage,
    prevPage,
    fetchDoorDetail,
    addDoor,
    updateDoor,
    deleteDoor,
    toggleLock,
    toggleFavourite,
    changeState,
    fetchDoorLogs,
  } = useDoors(buildingId);

  const [addOpen,   setAddOpen]   = useState(false);
  const [editData, setEditData]  = useState(null);
  const [logsDoor, setLogsDoor]  = useState(null);

  const openEdit = async doorItem => {
    try {
      const { door, controller } = await fetchDoorDetail(doorItem._id);
      setEditData({ door, controller });
    } catch (err) {
      console.error('Chyba načtení detailu dveří', err);
    }
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>
        {buildingName ? `${buildingName}` : 'Dveře budovy'}
      </h1>

      <DoorsList
        doors={doors}
        userFavs={userFavs}
        showAdd
        onAdd={() => setAddOpen(true)}
        onEdit={openEdit}
        onLogs={setLogsDoor}
        onToggleLock={toggleLock}
        onToggleFav={toggleFavourite}
        onChangeState={changeState}
        pageInfo={pageInfo}
        nextPage={nextPage}
        prevPage={prevPage}
      />

      {addOpen && (
        <DoorAddModal
          devices={controllers}
          onClose={() => setAddOpen(false)}
          onSubmit={form => { addDoor(form); setAddOpen(false); }}
        />
      )}

      {editData && (
        <DoorEditModal
          door={editData.door}
          selectedController={editData.controller}
          devices={controllers}
          onClose={() => setEditData(null)}
          onSubmit={(id, form) => { updateDoor(id, form); setEditData(null); }}
          onDelete={id => { deleteDoor(id); setEditData(null); }}
        />
      )}

      {logsDoor && (
        <DoorLogsModal
          door={logsDoor}
          fetchLogs={fetchDoorLogs}
          onClose={() => setLogsDoor(null)}
        />
      )}
    </main>
  );
}