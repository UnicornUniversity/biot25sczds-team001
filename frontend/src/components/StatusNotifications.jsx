'use client';
import { createPortal } from 'react-dom';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useStatus } from '@/lib/StatusContext';
import styles from './StatusNotifications.module.css';

/* ─── vizuální vrstva ─────────────────────────────────────────── */
export default function StatusNotifications() {
  const { pending, toasts } = useStatus();

  /* overlay se spinnerem */
  const overlay = pending && createPortal(
    <div className={styles.overlay}>
      <Spinner text={pending.msg} />
    </div>,
    document.body
  );

  /* toasty (každý zvlášť přes portal kvůli fixed pozici) */
  const toastEls = toasts.map(t => createPortal(
    <Toast key={t.id} type={t.type} msg={t.msg} />,
    document.body
  ));

  return (
    <>
      {overlay}
      {toastEls}
    </>
  );
}

/* ─── spinner pomocí GSAP ─────────────────────────────────────── */
function Spinner({ text }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dot',
        { y: 0 },
        { y: -12, yoyo: true, repeat: -1, stagger: 0.1, duration: 0.5, ease: 'sine.inOut' }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={styles.spinnerWrap}>
      <div className={styles.dots}>
        <span className="dot">●</span>
        <span className="dot">●</span>
        <span className="dot">●</span>
      </div>
      <p>{text}</p>
    </div>
  );
}

/* ─── toast (success / error) ─────────────────────────────────── */
function Toast({ type, msg }) {
  const posClass = type === 'error' ? styles.error : styles.success;
  return (
    <div className={`${styles.toast} ${posClass}`}>
      {msg}
    </div>
  );
}