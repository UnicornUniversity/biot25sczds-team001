'use client';

import { FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import cls from './DoorFavouriteButton.module.css';

export default function DoorFavouriteButton({ active, onToggle, color }) {
  return (
    <button
      className={cls.btn}
      onClick={onToggle}
      aria-label={active ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
    >
      {active
        ? <AiFillHeart className={cls.icon} style={{ color }} />
        : <FiHeart     className={cls.icon} style={{ color }} />
      }
    </button>
  );
}