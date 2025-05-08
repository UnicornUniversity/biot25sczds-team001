'use client';
import { FiRefreshCw } from 'react-icons/fi';
import styles          from './RefreshButton.module.css';
export default function RefreshButton({ onClick }) {
  return <button className={styles.circle} onClick={onClick} aria-label="Obnovit"><FiRefreshCw/></button>;
}