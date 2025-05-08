'use client';

import { GiDoor } from 'react-icons/gi';
import DoorStateSelector from './DoorStateSelector';
import DoorFavouriteButton from './DoorFavouriteButton';
import DoorCodeButton      from './DoorCodeButton';
import DoorEditButton      from './DoorEditButton';
import DoorLogsButton      from './DoorLogsButton';
import cls from './Door.module.css';

export default function Door({
  door,
  state,
  isFavourite,
  onToggleFavourite,
  onToggleLock,
  onChangeState,
  onEdit,
  onLogs,
}) {
  // Mapa stav → barva
  const colorMap = {
    safe:     'var(--color-success)',
    alert:    'var(--color-error)',
    inactive: 'var(--gray-alpha-400)',
  };
  const iconColor = colorMap[state] || colorMap.inactive;

  return (
    <li className={cls.card} data-state={state}>
      {/* Dropdown výběr stavu */}
      <DoorStateSelector
        state={state}
        onChange={newState => onChangeState(door._id, newState)}
      />

      <div className={cls.center}>
        <GiDoor
          className={cls.doorIcon}
          style={{ color: iconColor }}
        />
        <span className={cls.name}>{door.name}</span>
      </div>

      <div className={cls.actions}>
        <DoorLogsButton
          onClick={onLogs}
          color={iconColor}
        />
        <DoorEditButton
          onClick={onEdit}
          color={iconColor}
        />
        <DoorCodeButton
          locked={door.locked}
          onToggle={() => onToggleLock(door._id)}
          color={iconColor}
        />
        <DoorFavouriteButton
          active={isFavourite}
          onToggle={() => onToggleFavourite(door._id)}
          color={iconColor}
        />
      </div>
    </li>
  );
}