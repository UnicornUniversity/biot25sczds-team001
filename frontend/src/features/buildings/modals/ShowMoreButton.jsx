'use client';
import { FiChevronDown } from 'react-icons/fi';
import styles from './ShowMoreButton.module.css';

export default function ShowMoreButton({ onClick }) {
  return (
    <button
      className={styles.btn}
      onClick={onClick}
      aria-label="Načíst další záznamy"
    >
      <FiChevronDown className={styles.icon}/>
    </button>
  );
}