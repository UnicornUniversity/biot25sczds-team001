// src/features/home/components/HomeDoorsList.jsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiMinusCircle,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { GiBrokenShield } from 'react-icons/gi';
import { gsap } from 'gsap';
import cls from './HomeDoorsList.module.css';
import useDoorStatus from '../hooks/useDoorStatus';

export default function HomeDoorsList() {
  const { doors, pageInfo, nextPage, prevPage } = useDoorStatus();
  const [filter, setFilter] = useState('all');
  const shieldRef = useRef(null);

  // Animace štítu
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(shieldRef.current, {
        repeat: -1,
        yoyo: true,
        keyframes: [
          { scale: 1.02, duration: 1, ease: 'sine.inOut' },
          { rotate: 2, duration: 0.5, ease: 'sine.inOut' },
          { rotate: -2, duration: 0.5, ease: 'sine.inOut' },
        ],
      });
    }, shieldRef);
    return () => ctx.revert();
  }, []);

  const hasAlert = useMemo(() => doors.some(d => d.state === 'alert'), [doors]);
  const ShieldIcon = hasAlert ? GiBrokenShield : FiShield;
  const shieldColor = hasAlert ? 'var(--color-error)' : 'var(--color-success)';

  // Filtering
  const filtered = useMemo(() => {
    if (filter === 'all') return doors;
    return doors.filter(d => d.state === filter);
  }, [doors, filter]);

  const filterOptions = [
    { key: 'all', Icon: FiShield, color: 'var(--foreground)' },
    { key: 'safe', Icon: FiCheckCircle, color: 'var(--color-success)' },
    { key: 'alert', Icon: FiAlertTriangle, color: 'var(--color-error)' },
    { key: 'inactive', Icon: FiMinusCircle, color: 'var(--gray-alpha-400)' },
  ];

  const stateIconMap = {
    safe: { Icon: FiCheckCircle, color: 'var(--color-success)' },
    alert: { Icon: FiAlertTriangle, color: 'var(--color-error)' },
    inactive: { Icon: FiMinusCircle, color: 'var(--gray-alpha-400)' },
  };

  return (
    <div className={cls.wrapper} style={{ borderColor: shieldColor }}>
      <div className={cls.shieldContainer}>
        <ShieldIcon
          ref={shieldRef}
          className={cls.shieldIcon}
          style={{ color: shieldColor }}
          aria-label={hasAlert ? 'Některé dveře v poplachu' : 'Všechny dveře v pořádku'}
        />
      </div>

      <div className={cls.content}>
        {/* Filtry */}
        <div className={cls.filterBtns}>
          {filterOptions.map(opt => (
            <button
              key={opt.key}
              className={`${cls.filterBtn} ${filter === opt.key ? cls.active : ''}`}
              onClick={() => setFilter(opt.key)}
              aria-label={opt.key}
              style={{ color: opt.color }}
            >
              <opt.Icon className={cls.filterIcon} />
            </button>
          ))}
        </div>

        {/* Karty */}
        <div className={cls.cards}>
          {filtered.map(d => {
            const { Icon, color } = stateIconMap[d.state] || stateIconMap.inactive;
            return (
              <a
                key={d.doorId}
                href={`/buildings/${d.buildingId}/doors`}
                className={cls.card}
                style={{ borderColor: color }}
              >
                <Icon style={{ color, fontSize: '1.2rem' }} />
                <div className={cls.cardText}>{d.doorName}</div>
              </a>
            );
          })}
        </div>

        {/* Paginace */}
        <div className={cls.pagination}>
          <button
            className={cls.pageBtn}
            onClick={prevPage}
            disabled={pageInfo.page === 1}
            aria-label="Předchozí stránka"
          >
            <FiChevronLeft className={cls.pageIcon} />
          </button>
          <span className={cls.pageInfo}>{pageInfo.page} / {pageInfo.totalPages}</span>
          <button
            className={cls.pageBtn}
            onClick={nextPage}
            disabled={pageInfo.page === pageInfo.totalPages}
            aria-label="Další stránka"
          >
            <FiChevronRight className={cls.pageIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}