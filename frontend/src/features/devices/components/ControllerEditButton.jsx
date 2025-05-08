'use client';
import { FiEdit2 } from 'react-icons/fi';
import styles      from './ControllerEditButton.module.css';

export default function ControllerEditButton({ onClick }) {
  return (
    <button className={styles.iconBtn} onClick={onClick} aria-label="Upravit controller">
      <FiEdit2/>
    </button>
  );
}