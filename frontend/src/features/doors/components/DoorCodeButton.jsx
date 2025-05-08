'use client';

import { FiLock, FiUnlock } from 'react-icons/fi';
import cls from './DoorCodeButton.module.css';

export default function DoorCodeButton({ locked, onToggle, color }) {
  const Icon = locked ? FiLock : FiUnlock;
  return (
    <button
      className={cls.btn}
      onClick={onToggle}
      aria-label={locked ? 'Odemknout' : 'Zamknout'}
    >
      <Icon className={cls.icon} style={{ color }} />
    </button>
  );
}