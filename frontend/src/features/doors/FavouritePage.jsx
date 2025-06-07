'use client';

import { useState } from 'react';
import DoorsList     from './components/DoorsList';
import DoorEditModal from './modals/DoorEditModal';
import DoorLogsModal from './modals/DoorLogsModal';
import useDoors      from './hooks/useDoors';
import styles        from './DoorsPage.module.css';

export default function FavouritePage() {
  const {
    doors,                 // enriched už obsahuje .buildingName
    controllers,
    pageInfo,
    nextPage,
    prevPage,
    fetchDoorDetail,
    updateDoor,
    deleteDoor,
    toggleLock,
    toggleFavourite,
    changeState,
    fetchDoorLogs,
  } = useDoors(null); // favourites

  const [editData, setEditData] = useState(null);
  const [logsDoor, setLogsDoor] = useState(null);

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
      <h1 className={styles.title}>Oblíbené dveře</h1>

      <DoorsList
        doors={doors}
        userFavs={doors.map(d => d._id)}
        showAdd={false}
        onAdd={() => {}}
        onEdit={openEdit}
        onLogs={setLogsDoor}
        onToggleFav={toggleFavourite}
        onToggleLock={toggleLock}
        onChangeState={changeState}
        pageInfo={pageInfo}
        nextPage={nextPage}
        prevPage={prevPage}
      />

      {editData && (
        <DoorEditModal
          door={editData.door}
          selectedController={editData.controller}
          devices={controllers}
          onClose={() => setEditData(null)}
          onDelete={id => { deleteDoor(id); setEditData(null); }}
          onSubmit={(id, data) => { updateDoor(id, data); setEditData(null); }}
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