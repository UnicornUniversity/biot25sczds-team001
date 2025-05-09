'use client';

import { useEffect, useRef, useMemo } from 'react';
import { FiShield, FiAlertTriangle } from 'react-icons/fi';
import { gsap } from 'gsap';
import cls from './HomeDoorsList.module.css';
import useDoorStatus from '../hooks/useDoorStatus';

export default function HomeDoorsList() {
  const { doors } = useDoorStatus();
  const shieldRef = useRef(null);

  /* ---------- animace štítu ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(shieldRef.current, {
        rotationY: 360,
        transformOrigin: '50% 50%',
        duration: 8,
        ease: 'linear',
        repeat: -1,
      });
    }, shieldRef);
    return () => ctx.revert();
  }, []);

  /* ---------- data ---------- */
  const alertDoors = useMemo(() => doors.filter(d => d.state === 'alert'), [doors]);
  const hasAlert   = alertDoors.length > 0;
  const shieldColor = hasAlert ? 'var(--color-error)' : 'var(--color-success)';
  const shieldText  = hasAlert ? 'Některé dveře hlásí poplach' : 'Vše je zabezpečeno';

  /* ---------- render ---------- */
  return (
    <div className={cls.wrapper}>
      <div className={cls.shieldContainer}>
        <FiShield
          ref={shieldRef}
          className={cls.shieldIcon}
          style={{ color: shieldColor }}
          aria-label={shieldText}
        />
        <div className={cls.shieldText} style={{ color: shieldColor }}>
          {shieldText}
        </div>
      </div>

      {hasAlert && (
        <div className={cls.content}>
          <div className={cls.cards}>
            {alertDoors.map(d => (
              <a
                key={d.doorId}
                href={`/buildings/${d.buildingId}/doors`}
                className={cls.card}
                style={{ borderColor: 'var(--color-error)' }}
              >
                <FiAlertTriangle style={{ color: 'var(--color-error)', fontSize: '1.2rem' }} />
                <div className={cls.cardText}>{d.doorName}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}