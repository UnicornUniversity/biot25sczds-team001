'use client';
import { useRef } from 'react';
import gsap       from 'gsap';
import { FiPlus } from 'react-icons/fi';

import styles from './ControllerAddButton.module.css';

export default function ControllerAddButton({ onClick }) {
  const ref = useRef(null);
  const hover = s => gsap.to(ref.current, { scale:s, duration:.2 });

  return (
    <button
      ref={ref}
      className={styles.btn}
      onMouseEnter={()=>hover(1.1)}
      onMouseLeave={()=>hover(1)}
      onClick={onClick}
      aria-label="Přidat controller"
    >
      <FiPlus/>
    </button>
  );
}