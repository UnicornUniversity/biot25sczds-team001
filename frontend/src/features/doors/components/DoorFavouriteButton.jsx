'use client';

import { FiHeart } from 'react-icons/fi';
import { AiFillHeart } from 'react-icons/ai';
import cls from './DoorFavouriteButton.module.css';

export default function DoorFavouriteButton({ active, onToggle }) {
  console.log('[DoorFavouriteButton] active=', active);
  return (
    <button
      className={cls.btn}
      onClick={onToggle}
      aria-label={active ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}
    >
      {active
        ? <AiFillHeart className={cls.icon} />
        : <FiHeart     className={cls.icon} />
      }
    </button>
  );
}