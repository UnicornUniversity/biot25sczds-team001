'use client';
import { FiBookOpen } from 'react-icons/fi';
import styles from './BuildingLogsButton.module.css';

export default function BuildingLogsButton({ onClick }) {
  return (
    <button className={styles.btn} onClick={onClick} aria-label="Logy">
      <FiBookOpen />
    </button>
  );
}