'use client';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import {
  FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle,
  FiX
} from 'react-icons/fi';

import RefreshButton  from './RefreshButton';
import ShowMoreButton from './ShowMoreButton';
import styles         from './BuildingLogsModal.module.css';

/* ——— Ikony závažnosti ——— */
const sevIcon = {
  info:    { Icon: FiInfo,         color: 'var(--color-info)'    },
  success: { Icon: FiCheckCircle,  color: 'var(--color-success)' },
  warning: { Icon: FiAlertTriangle,color: 'var(--color-warning)' },
  error:   { Icon: FiXCircle,      color: 'var(--color-error)'   },
};

export default function BuildingLogsModal({ building, fetchLogs, onClose }) {
  const [limit, setLimit] = useState(5);   // default 5 logů
  const [logs,  setLogs]  = useState([]);
  const modalRef = useRef(null);
  const listRef  = useRef(null);

  /* ——— Zadání dat ——— */
  useEffect(() => { fetchLogs(building._id, limit).then(setLogs); },
    [building._id, limit, fetchLogs]);

  /* ——— Jednorázová animace celého okna ——— */
  useLayoutEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { y: -50, autoAlpha: 0 },
      { y:   0, autoAlpha: 1, duration: .35, ease: 'power2.out' }
    );
  }, []);

  /* ——— Animace jednotlivých položek po změně `logs` ——— */
  useLayoutEffect(() => {
    gsap.from(listRef.current?.children, {
      autoAlpha: 0, x: -20, stagger: .06, duration: .25, ease: 'power1.out'
    });
  }, [logs]);

  /* ——— Handlery ——— */
  const refresh  = () => fetchLogs(building._id, limit).then(setLogs);
  const showMore = () => setLimit(l => l + 5);

  return (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal}>
        <header className={styles.head}>
          <h3 className={styles.title}>Logy — {building.name}</h3>

          <div className={styles.headBtns}>
            <RefreshButton  onClick={refresh}  />
            <button
              className={styles.iconBtn}
              onClick={onClose}
              aria-label="Zavřít"
            >
              <FiX />
            </button>
          </div>
        </header>

        <ul ref={listRef} className={styles.list}>
          {logs.map(l => {
            const { Icon, color } = sevIcon[l.severity] || sevIcon.info;
            return (
              <li key={l._id} className={styles.item}>
                <Icon className={styles.sevIcon} style={{ color }} />
                <div className={styles.itemBody}>
                  <span className={styles.msg}>{l.message}</span>
                  <time className={styles.time}>
                    {new Date(l.createdAt).toLocaleString()}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>

        {limit < 50 && (   /* demo hard‑stop – případně odstraňte */
          <ShowMoreButton onClick={showMore} />
        )}
      </div>
    </div>
  );
}