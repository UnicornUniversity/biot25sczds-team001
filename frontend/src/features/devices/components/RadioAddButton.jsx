'use client';
import { FiPlus } from 'react-icons/fi';
import { useRef } from 'react';
import gsap from 'gsap';
import styles from './RadioAddButton.module.css';

export default function RadioAddButton({ onClick }) {
  const ref = useRef(null);
  const hover = s => gsap.to(ref.current,{ scale:s, duration:0.2 });

  return (
    <button
      ref={ref}
      className={styles.btn}
      onMouseEnter={()=>hover(1.1)}
      onMouseLeave={()=>hover(1)}
      onClick={onClick}
      aria-label="Přidat gateway"
    >
      <FiPlus/>
    </button>
  );
}