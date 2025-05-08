'use client';
import { FiEdit2 } from 'react-icons/fi';
import styles      from './RadioEditButton.module.css';

export default function RadioEditButton({ onClick }) {
  return (
    <button className={styles.iconBtn} onClick={onClick} aria-label="Upravit gateway">
      <FiEdit2/>
    </button>
  );
}