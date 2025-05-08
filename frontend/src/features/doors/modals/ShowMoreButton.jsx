'use client';
import { FiChevronDown } from 'react-icons/fi';
import styles            from './ShowMoreButton.module.css';
export default function ShowMoreButton({ onClick }) {
  return <button className={styles.circle} onClick={onClick} aria-label="Více"><FiChevronDown/></button>;
}