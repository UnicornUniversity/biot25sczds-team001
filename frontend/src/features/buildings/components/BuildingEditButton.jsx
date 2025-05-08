'use client';
import { FiEdit2 } from 'react-icons/fi';
import styles from './BuildingEditButton.module.css';

export default function BuildingEditButton({ onClick }) {
  return (
    <button className={styles.btn} onClick={onClick} aria-label="Upravit">
      <FiEdit2 />
    </button>
  );
}