'use client';
import { FiLock, FiUnlock } from 'react-icons/fi';
import cls from './DoorCodeButton.module.css';

export default function DoorCodeButton({ locked, onToggle }) {
  const Icon = locked ? FiLock : FiUnlock;       /* obráceně – co provedeme */
  return (
    <button
      className={cls.btn}
      onClick={onToggle}
      aria-label={locked ? 'Odemknout' : 'Zamknout'}
    >
      <Icon className={cls.icon}/>
    </button>
  );
}