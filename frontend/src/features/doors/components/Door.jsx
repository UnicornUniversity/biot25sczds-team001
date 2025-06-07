'use client';

/******************************  Door.jsx  ******************************/
import { GiDoor } from 'react-icons/gi';
import DoorStateSelector   from './DoorStateSelector';
import DoorFavouriteButton from './DoorFavouriteButton';
import DoorCodeButton      from './DoorCodeButton';
import DoorEditButton      from './DoorEditButton';
import DoorLogsButton      from './DoorLogsButton';
import cls                 from './Door.module.css';

/* helper – odstraň koncové „ [něco]“ nebo „(něco)“ z názvu */
function stripTrailingBrackets(name = '') {
  const cleaned = name.replace(/\s*[\[(].*[)\]]\s*$/u, '').trim();
  return cleaned || name; // fallback, kdyby regex snědl vše
}

/**
 * Door card
 *  - Na stránce „Oblíbené dveře" backend přidá `door.buildingName` → zobrazíme pod názvem.
 *  - Na stránce konkrétní budovy pole neexistuje, takže se nic navíc nevykreslí.
 */
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
  /* stav → barva */
  const colorMap = {
    safe:     'var(--color-success)',
    alert:    'var(--color-error)',
    inactive: 'var(--gray-alpha-400)',
  };
  const iconColor = colorMap[state] || colorMap.inactive;

  const displayName   = stripTrailingBrackets(door.name);
  const buildingLabel = door.buildingName?.trim(); // undefined na DoorsPage

  return (
    <li className={cls.card} data-state={state}>
      <DoorStateSelector
        state={state}
        onChange={newState => onChangeState(door._id, newState)}
      />

      <div className={cls.center}>
        <GiDoor className={cls.doorIcon} style={{ color: iconColor }} />
        <span className={cls.name}>{displayName}</span>
        {buildingLabel && <span className={cls.building}>{buildingLabel}</span>}
      </div>

      <div className={cls.actions}>
        <DoorLogsButton onClick={onLogs} color={iconColor} />
        <DoorEditButton onClick={onEdit} color={iconColor} />
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
