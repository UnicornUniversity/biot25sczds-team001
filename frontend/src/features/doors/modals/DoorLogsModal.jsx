'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import {
  FiInfo,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiX
} from 'react-icons/fi';

import RefreshButton  from './RefreshButton';
import ShowMoreButton from './ShowMoreButton';
import styles         from './DoorLogsModal.module.css';

/* ───── mapování závažností → ikona + barva ───── */
const sevIcon = {
  info:    { Icon: FiInfo,         color: 'var(--color-info)'    },
  success: { Icon: FiCheckCircle,  color: 'var(--color-success)' },
  warning: { Icon: FiAlertTriangle,color: 'var(--color-warning)' },
  error:   { Icon: FiXCircle,      color: 'var(--color-error)'   },
};

/**
 * @param {{door: object, fetchLogs: Function, onClose: Function}} props
 */
export default function DoorLogsModal({ door, fetchLogs, onClose }) {
  /* ————— stav ————— */
  const [limit, setLimit] = useState(5);
  const [logs,  setLogs]  = useState([]);

  /* refs pro animace */
  const modalRef = useRef(null);
  const listRef  = useRef(null);

  /* ————— načtení logů při změně dveří/limitu ————— */
  useEffect(() => {
    async function load() {
      const data = await fetchLogs(door._id, limit);
      setLogs(data);
    }
    load();
  }, [door._id, limit, fetchLogs]);

  /* ————— animace modalu ————— */
  useLayoutEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { y: -50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: .35, ease: 'power2.out' }
    );
  }, []);

  /* ————— animace položek po každém refreshi seznamu ————— */
  useLayoutEffect(() => {
    gsap.from(listRef.current?.children, {
      autoAlpha: 0, x: -20, stagger: .06, duration: .25, ease: 'power1.out'
    });
  }, [logs]);

  /* ————— akce ————— */
  const refresh   = () => fetchLogs(door._id, limit).then(setLogs);
  const showMore  = () => setLimit(l => l + 5);

  /* ————— render ————— */
  return (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal}>
        {/* hlavička */}
        <header className={styles.head}>
          <h3 className={styles.title}>Logy — {door.name}</h3>

          <div className={styles.headBtns}>
            <RefreshButton onClick={refresh} />
            <button
              type="button"
              className={`${styles.iconBtn}`}
              onClick={onClose}
              aria-label="Zavřít"
            >
              <FiX />
            </button>
          </div>
        </header>

        {/* seznam logů */}
        <ul ref={listRef} className={styles.list}>
          {logs.map(l => {
            const { Icon, color } = sevIcon[l.severity] ?? sevIcon.info;
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

        {/* show‑more */}
        {logs.length >= limit && (
          <div className={styles.moreWrap}>
            <ShowMoreButton onClick={showMore} />
          </div>
        )}
      </div>
    </div>
  );
}