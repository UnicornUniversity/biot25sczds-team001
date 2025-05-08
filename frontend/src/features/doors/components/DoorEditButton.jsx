'use client';
import { FiEdit2 } from 'react-icons/fi';
import styles      from './DoorEditButton.module.css';
export default function DoorEditButton({ onClick }) {
  return (
    <button className={styles.iconBtn} onClick={onClick} aria-label="Upravit">
      <FiEdit2/>
    </button>
  );
}