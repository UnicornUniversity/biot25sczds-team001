'use client';
import { FiRefreshCw } from 'react-icons/fi';
import styles from './RefreshButton.module.css';

export default function RefreshButton({ onClick }) {
  return (
    <button
      className={styles.btn}
      aria-label="Obnovit logy"
      onClick={onClick}
    >
      <FiRefreshCw className={styles.icon}/>
    </button>
  );
}