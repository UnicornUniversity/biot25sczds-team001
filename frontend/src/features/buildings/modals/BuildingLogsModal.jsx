// src/features/home/components/BuildingLogsModal.jsx
'use client';

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import gsap from 'gsap';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiXCircle, FiX } from 'react-icons/fi';
import RefreshButton  from './RefreshButton';
import ShowMoreButton from './ShowMoreButton';
import styles         from './BuildingLogsModal.module.css';

const sevIcon = {
  info:    { Icon: FiInfo,        color: 'var(--color-info)'    },
  success: { Icon: FiCheckCircle, color: 'var(--color-success)' },
  warning: { Icon: FiAlertTriangle,color: 'var(--color-warning)' },
  error:   { Icon: FiXCircle,     color: 'var(--color-error)'   },
};

const PAGE_SIZE = 5;

export default function BuildingLogsModal({ building, fetchLogs, onClose }) {
  /* ---------- state ---------- */
  const [logs, setLogs] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 1 });

  /* ---------- refs & animace ---------- */
  const modalRef = useRef(null);
  const listRef  = useRef(null);

  /* fade‑in modalu */
  useLayoutEffect(() => {
    const tween = gsap.fromTo(
      modalRef.current,
      { y: -50, autoAlpha: 0 },
      { y: 0,  autoAlpha: 1, duration: .35 }
    );
    return () => tween.kill();
  }, []);

  /* animuj jen nově přidané prvky */
  const animateList = els => {
    gsap.from(els, {
      autoAlpha: 0,
      x: -20,
      stagger: .06,
      duration: .25,
      clearProps: 'opacity,visibility,transform'
    });
  };

  /* ---------- načítání dat ---------- */
  const loadPage = useCallback(async page => {
    const { logs: newLogs, pageInfo: pi } =
      await fetchLogs(building._id, PAGE_SIZE, page);

    setLogs(prev => {
      const map = new Map(prev.map(l => [l._id, l]));     // existující
      newLogs.forEach(l => map.set(l._id, l));            // přepíše duplicitní
      const merged = Array.from(map.values());

      /* animace jen pro nové řádky */
      requestAnimationFrame(() => {
        const freshIds = newLogs.map(l => l._id);
        const nodes = Array.from(listRef.current?.children || [])
          .filter(li => freshIds.includes(li.dataset.id));
        if (nodes.length) animateList(nodes);
      });

      return page === 1 ? merged : merged;
    });

    setPageInfo(pi);
  }, [building._id, fetchLogs]);

  useEffect(() => { loadPage(pageInfo.page); }, [loadPage, pageInfo.page]);

  /* ---------- handlery ---------- */
  const refresh = () => {
    setLogs([]);                 // vyprázdni stávající list
    setPageInfo(p => ({ ...p, page: 1 })); // reset pageInfo
    loadPage(1);                 // **okamžitě načti první stránku**
  };

  const showMore = () => pageInfo.page < pageInfo.totalPages &&
                         setPageInfo(p => ({ ...p, page: p.page + 1 }));

  /* ---------- render ---------- */
  return (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal}>
        <header className={styles.head}>
          <h3 className={styles.title}>Logy — {building.name}</h3>
          <div className={styles.headBtns}>
            <RefreshButton onClick={refresh} />
            <button className={styles.iconBtn} onClick={onClose} aria-label="Zavřít">
              <FiX />
            </button>
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
                  <time className={styles.time}>
                    {new Date(l.createdAt).toLocaleString()}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>

        {pageInfo.page < pageInfo.totalPages && (
          <ShowMoreButton onClick={showMore} />
        )}
      </div>
    </div>
  );
}