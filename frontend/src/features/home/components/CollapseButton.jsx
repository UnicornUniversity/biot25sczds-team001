'use client';

import { FiChevronUp } from 'react-icons/fi';
import styles from './CollapseButton.module.css';

export default function CollapseButton({ onClick }) {
  return (
    <button
      className={styles.btn}
      onClick={onClick}
      aria-label="Skrýt nadbytečné"
    >
      <FiChevronUp />
    </button>
  );
}