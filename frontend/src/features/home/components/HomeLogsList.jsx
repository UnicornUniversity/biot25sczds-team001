'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

import useHome    from '../hooks/useHome';
import HomeLogItem    from './HomeLogItem';
import RefreshButton  from './RefreshButton';
import ShowMoreButton from './ShowMoreButton';
import CollapseButton from './CollapseButton';

import styles from './HomeLogsList.module.css';

export default function HomeLogsList({ onSelect }) {
  const initialLimit = 5;
  const {
    logs,
    onRefresh,
    onShowMore,
    onCollapse,
    canLoadMore,
  } = useHome(initialLimit);

  /* jednoduchá vstupní animace */
  const listRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (listRef.current && !mounted.current) {
      gsap.from(listRef.current.children, {
        autoAlpha: 0,
        y: -20,
        stagger: 0.1,
        duration: 0.4,
      });
      mounted.current = true;
    }
  }, []);

  return (
    <div className={styles.container}>
      <RefreshButton onClick={onRefresh} />

      <ul ref={listRef} className={styles.list}>
        {logs.map(log => (
          <HomeLogItem key={log._id} log={log} onClick={() => onSelect(log)} />
        ))}
      </ul>

      <div className={styles.actions}>
        {canLoadMore && <ShowMoreButton onClick={onShowMore} />}
        {logs.length > initialLimit && <CollapseButton onClick={onCollapse} />}
      </div>
    </div>
  );
}