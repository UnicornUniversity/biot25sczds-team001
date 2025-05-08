// src/features/home/components/HomeDoorsList.jsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  FiShield,
  FiCheckCircle,
  FiAlertTriangle,
  FiMinusCircle
} from 'react-icons/fi';
import { GiBrokenShield } from 'react-icons/gi';
import { gsap } from 'gsap';
import cls from './HomeDoorsList.module.css';

/**
 * @param {{
 *   doors: Array<{
 *     doorId: string,
 *     doorName: string,
 *     state: 'safe'|'alert'|'inactive',
 *     buildingId: string
 *   }>
 * }} props
 */
export default function HomeDoorsList({ doors }) {
  const [filter, setFilter] = useState('all');
  const shieldRef = useRef(null);

  // richer animation: pulse + slight rotate + glow flicker
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(shieldRef.current, {
        repeat: -1,
        yoyo: true,
        keyframes: [
          { scale: 1.02, duration: 1, ease: 'sine.inOut' },
          { rotate: 2,  duration: 0.5, ease: 'sine.inOut' },
          { rotate: -2, duration: 0.5, ease: 'sine.inOut' },
        ],
      });
    }, shieldRef);
    return () => ctx.revert();
  }, []);

  const hasAlert = useMemo(
    () => doors.some(d => d.state === 'alert'),
    [doors]
  );

  const filtered = useMemo(() => {
    if (filter === 'all') return doors;
    return doors.filter(d => d.state === filter);
  }, [doors, filter]);

  const filterOptions = [
    { key: 'all',      Icon: FiShield,        label: 'Vše',       color: 'var(--foreground)' },
    { key: 'safe',     Icon: FiCheckCircle,   label: 'Bezpečné',  color: 'var(--color-success)' },
    { key: 'alert',    Icon: FiAlertTriangle, label: 'Poplach',   color: 'var(--color-error)'   },
    { key: 'inactive', Icon: FiMinusCircle,   label: 'Neaktivní', color: 'var(--gray-alpha-400)' },
  ];

  const stateIconMap = {
    safe:     { Icon: FiCheckCircle,   color: 'var(--color-success)' },
    alert:    { Icon: FiAlertTriangle, color: 'var(--color-error)'   },
    inactive: { Icon: FiMinusCircle,   color: 'var(--gray-alpha-400)' },
  };

  const ShieldIcon   = hasAlert ? GiBrokenShield : FiShield;
  const shieldColor  = hasAlert ? 'var(--color-error)' : 'var(--color-success)';

  return (
    <div
      className={`${cls.wrapper} ${hasAlert ? cls.alert : ''}`}
      style={{ borderColor: shieldColor }}
    >
      <div className={cls.shieldContainer}>
        <ShieldIcon
          ref={shieldRef}
          className={cls.shieldIcon}
          style={{ color: shieldColor }}
          aria-label={
            hasAlert
              ? 'Některé dveře v poplachu'
              : 'Všechny dveře v pořádku'
          }
        />
      </div>

      <div className={cls.content}>
        <div className={cls.filterBtns}>
          {filterOptions.map(opt => (
            <button
              key={opt.key}
              className={`${cls.filterBtn} ${filter === opt.key ? cls.active : ''}`}
              onClick={() => setFilter(opt.key)}
              aria-label={opt.label}
              style={{ color: opt.color }}
            >
              <opt.Icon className={cls.filterIcon} />
            </button>
          ))}
        </div>

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
                <span className={cls.cardText}>{d.doorName}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}