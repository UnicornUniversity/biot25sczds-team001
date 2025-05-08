// File: src/components/StatusNotifications.jsx
'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useStatus } from '@/lib/StatusContext';
import styles from './StatusNotifications.module.css';

// UX Timing Constants
const DISPLAY_DURATION_MS = 2000;
const ANIM_DURATION_S = 0.3;

export default function StatusNotifications() {
  const { pending, toasts } = useStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <>
      {pending && <Spinner text={pending.msg} />}
      <div className={styles.container}>
        {toasts.map(toast => (
          <Toast key={toast.id} type={toast.type} msg={toast.msg} />
        ))}
      </div>
    </>,
    document.body
  );
}

function Spinner({ text }) {
  const orbitRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // simple fast rotation
      gsap.to(orbitRef.current, {
        rotation: 360,
        duration: 0.5,
        ease: 'none',
        repeat: -1,
        transformOrigin: '50% 50%'
      });
    }, orbitRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.overlay}>
      <div ref={orbitRef} className={styles.orbit}>
        {[...Array(4)].map((_, i) => {
          const angle = (360 / 4) * i;
          return <span key={i} className={styles.electron} style={{ '--angle': `${angle}deg` }} />;
        })}
      </div>
      <p className={styles.pendingText}>{text}</p>
    </div>
  );
}

function Toast({ type, msg }) {
  const ref = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: ANIM_DURATION_S, ease: 'power3.out' }
    );
    gsap.fromTo(
      barRef.current,
      { scaleX: 1 },
      { scaleX: 0, duration: DISPLAY_DURATION_MS / 1000, ease: 'linear', onComplete: () => gsap.to(ref.current, { x: 100, opacity: 0, duration: ANIM_DURATION_S, ease: 'power3.in' }) }
    );
  }, []);

  return (
    <div ref={ref} className={`${styles.toast} ${styles[type]}`} role="status" aria-live="polite">
      <div className={styles.msg}>{msg}</div>
      <button className={styles.closeBtn} onClick={() => gsap.to(ref.current, { x: 100, opacity: 0, duration: ANIM_DURATION_S, ease: 'power3.in' })}>×</button>
      <div className={styles.progressContainer}>
        <div ref={barRef} className={styles.progressBar} />
      </div>
    </div>
  );
}