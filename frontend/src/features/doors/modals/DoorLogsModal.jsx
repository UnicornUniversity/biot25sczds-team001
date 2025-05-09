// src/features/home/components/DoorLogsModal.jsx
'use client';

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import gsap from 'gsap';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle, FiX } from 'react-icons/fi';
import RefreshButton  from './RefreshButton';
import ShowMoreButton from './ShowMoreButton';
import styles         from './DoorLogsModal.module.css';

/* ---------- ikona dle severity ---------- */
const sevIcon = {
  info:    { Icon: FiInfo,        color: 'var(--color-info)'    },
  success: { Icon: FiCheckCircle, color: 'var(--color-success)' },
  warning: { Icon: FiAlertTriangle,color: 'var(--color-warning)' },
  error:   { Icon: FiXCircle,     color: 'var(--color-error)'   },
};

const BATCH = 5; // kolik logů načíst najednou

export default function DoorLogsModal({ door, fetchLogs, onClose }) {
  /* ----------------------------- state ----------------------------- */
  const [limit, setLimit] = useState(BATCH);
  const [logs,  setLogs]  = useState([]);

  /* ------------------------ refs & animation ----------------------- */
  const modalRef = useRef(null);
  const listRef  = useRef(null);

  /* animace modalu */
  useLayoutEffect(() => {
    const t = gsap.fromTo(modalRef.current, { y:-50, autoAlpha:0 }, { y:0, autoAlpha:1, duration:.35 });
    return () => t.kill();
  }, []);

  const animateList = els => {
    gsap.from(els, { autoAlpha:0, x:-20, stagger:.06, duration:.25, clearProps:'opacity,visibility,transform' });
  };

  /* -------------------------- načtení ------------------------------ */
  const load = useCallback(async newLimit => {
    const data = await fetchLogs(door._id, newLimit);

    setLogs(prev => {
      const map = new Map(prev.map(l => [l._id, l]));
      data.forEach(l => map.set(l._id, l));
      const merged = Array.from(map.values()).slice(0, newLimit);

      // animuj jen nové položky
      requestAnimationFrame(() => {
        const freshIds = merged.filter(l => !prev.some(p => p._id === l._id)).map(l => l._id);
        const nodes = Array.from(listRef.current?.children || []).filter(li => freshIds.includes(li.dataset.id));
        if (nodes.length) animateList(nodes);
      });

      return merged;
    });
  }, [door._id, fetchLogs]);

  // první načtení + při změně limitu/dveří
  useEffect(() => { load(limit); }, [load, limit]);

  /* --------------------------- handlery ---------------------------- */
  const refresh = () => {
    setLogs([]);       // vyčisti seznam
    setLimit(BATCH);   // resetuj limit (pokud byl zvýšen)
    load(BATCH);       // okamžitě načti první batch znovu
  };

  const showMore = () => setLimit(l => l + BATCH);

  /* ---------------------------- render ----------------------------- */
  return (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal}>
        <header className={styles.head}>
          <h3 className={styles.title}>Logy — {door.name}</h3>
          <div className={styles.headBtns}>
            <RefreshButton onClick={refresh} />
            <button className={styles.iconBtn} onClick={onClose} aria-label="Zavřít"><FiX/></button>
          </div>
        </header>

        <ul ref={listRef} className={styles.list}>
          {logs.map(l => {
            const { Icon, color } = sevIcon[l.severity] || sevIcon.info;
            return (
              <li key={l._id} data-id={l._id} className={styles.item}>
                <Icon className={styles.sevIcon} style={{ color }} />
                <div className={styles.itemBody}>
                  <span className={styles.msg}>{l.message}</span>
                  <time className={styles.time}>{new Date(l.createdAt).toLocaleString()}</time>
                </div>
              </li>
            );
          })}
        </ul>

        {logs.length >= limit && (
          <div className={styles.moreWrap}>
            <ShowMoreButton onClick={showMore} />
          </div>
        )}
      </div>
    </div>
  );
}
