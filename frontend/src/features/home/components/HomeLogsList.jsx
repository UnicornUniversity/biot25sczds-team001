'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

import useUserLogs    from '../hooks/useUserLogs';
import HomeLogItem    from './HomeLogItem';
import ShowMoreButton from './ShowMoreButton';

import styles from './HomeLogsList.module.css';

export default function HomeLogsList({ onSelect }) {
  const { logs, pageInfo, nextPage, canLoadMore } = useUserLogs(5);
  const listRef = useRef(null);
  const firstRender = useRef(true);

  /* animace pouze při prvním renderu */
  useEffect(() => {
    if (listRef.current && firstRender.current) {
      gsap.from(listRef.current.children, {
        autoAlpha: 0,
        y: -20,
        stagger: 0.08,
        duration: 0.35,
      });
      firstRender.current = false;
    }
  }, [logs]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Aplikační logy</h2>

      {/* vlastní scrollbar */}
      <ul ref={listRef} className={styles.list}>
        {logs.map(log => (
          <HomeLogItem key={log._id} log={log} onClick={() => onSelect(log)} />
        ))}
      </ul>

      {canLoadMore && (
        <div className={styles.actions}>
          <ShowMoreButton
            onClick={nextPage}
            label={`Načíst další (${pageInfo.page + 1}/${pageInfo.totalPages})`}
          />
        </div>
      )}
    </div>
  );
}