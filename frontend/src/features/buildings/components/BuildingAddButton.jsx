'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { FiPlus } from 'react-icons/fi';
import styles from './BuildingAddButton.module.css';

export default function BuildingAddButton({ onClick }) {
  const ref = useRef(null);

  /* malá animace při hoveru */
  const hover = scale => gsap.to(ref.current, { scale, duration: 0.2 });

  return (
    <button
      ref={ref}
      className={styles.btn}
      onMouseEnter={() => hover(1.1)}
      onMouseLeave={() => hover(1)}
      onClick={onClick}
      aria-label="Přidat budovu"
    >
      <FiPlus />
    </button>
  );
}