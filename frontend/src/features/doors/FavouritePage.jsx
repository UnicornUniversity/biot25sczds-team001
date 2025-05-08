// src/features/doors/FavouritePage.jsx
'use client';

import { useState } from 'react';
import DoorsList     from './components/DoorsList';
import DoorEditModal from './modals/DoorEditModal';
import DoorLogsModal from './modals/DoorLogsModal';
import useDoors      from './hooks/useDoors';
import styles        from './DoorsPage.module.css';

export default function FavouritePage() {
  // passing `null` makes the hook call GET /doors/favourites
  const {
    doors,                 // only your favourite doors
    userFavs,              // up-to-date favourite‐IDs array
    controllers,           // for the edit modal
    fetchDoorDetail,
    updateDoor,
    deleteDoor,
    toggleLock,
    toggleFavourite,
    resetState,
    changeState,           // ← přidali jsme sem
    fetchDoorLogs,
  } = useDoors(null);

  // doors už jsou jen favs, nemusíme filtrovat
  const favDoors = doors;

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
        doors={favDoors}
        // tady předáváme jenom jejich vlastní ID, aby byly všechny srdíčka plná
        userFavs={favDoors.map(d => d._id)}
        showAdd={false}
        onAdd={() => {}}
        onEdit={openEdit}
        onLogs={d => setLogsDoor(d)}
        onToggleLock={toggleLock}
        onToggleFav={toggleFavourite}
        onResetState={resetState}
        onChangeState={changeState}    // ← a tady
      />

      {editData && (
        <DoorEditModal
          door={editData.door}
          selectedController={editData.controller}
          devices={
            editData.controller
              ? [editData.controller, ...controllers.filter(c => c._id !== editData.controller._id)]
              : controllers
          }
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