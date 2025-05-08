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
    userFavs,              // up-to-date favourite IDs array
    controllers,           // for the edit modal
    pageInfo,              // pagination info
    nextPage,              // pagination controls
    prevPage,
    fetchDoorDetail,
    updateDoor,
    deleteDoor,
    toggleLock,
    toggleFavourite,
    resetState,
    changeState,
    fetchDoorLogs,
  } = useDoors(null);

  // on this page, `doors` are already filtered to favourites
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
        userFavs={favDoors.map(d => d._id)}  // all hearts filled
        showAdd={false}
        onAdd={() => {}}
        onEdit={openEdit}
        onLogs={d => setLogsDoor(d)}
        onToggleLock={toggleLock}
        onToggleFav={toggleFavourite}
        onChangeState={changeState}
        // pass pagination controls down into DoorsList
        pageInfo={pageInfo}
        nextPage={nextPage}
        prevPage={prevPage}
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