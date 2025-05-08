'use client';
import { FiBookOpen } from 'react-icons/fi';
import styles         from './DoorLogsButton.module.css';
export default function DoorLogsButton({ onClick }) {
  return (
    <button className={styles.iconBtn} onClick={onClick} aria-label="Logy">
      <FiBookOpen/>
    </button>
  );
}