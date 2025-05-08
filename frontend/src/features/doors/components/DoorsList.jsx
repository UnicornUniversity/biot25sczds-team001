/* src/features/doors/components/DoorsList.jsx */
'use client';

import React from 'react';
import Door from './Door';
import DoorAddButton from './DoorAddButton';
import cls from './DoorsList.module.css';

export default function DoorsList({
  doors,
  userFavs,
  showAdd = true,
  onAdd,
  onEdit,
  onLogs,
  onToggleFav,
  onToggleLock,
  onChangeState,
}) {
  return (
    <section className={cls.wrapper}>
      <div className={cls.head}>
        {showAdd && <DoorAddButton onClick={onAdd} />}
      </div>
      <ul className={cls.list}>
        {doors.map(d => (
          <Door
            key={d._id}
            door={d}
            state={d.state}
            isFavourite={userFavs.includes(d._id)}
            onToggleFavourite={() => onToggleFav(d._id)}
            onToggleLock={() => onToggleLock(d._id)}
            onChangeState={onChangeState}
            onEdit={() => onEdit(d)}
            onLogs={() => onLogs(d)}
          />
        ))}
      </ul>
    </section>
  );
}