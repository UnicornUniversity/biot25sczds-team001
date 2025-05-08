'use client';

import { useState, useRef, useEffect } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiMinusCircle } from 'react-icons/fi';
import cls from './DoorStateSelector.module.css';

const OPTIONS = [
  { value: 'safe',     label: 'Bezpečný',  Icon: FiCheckCircle,   color: 'var(--color-success)' },
  { value: 'alert',    label: 'Poplach',   Icon: FiAlertTriangle, color: 'var(--color-error)'   },
  { value: 'inactive', label: 'Neaktivní', Icon: FiMinusCircle,   color: 'var(--gray-alpha-400)' }
];

export default function DoorStateSelector({ state, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = OPTIONS.find(o => o.value === state) || OPTIONS[0];

  return (
    <div className={cls.wrapper} ref={ref}>
      <button
        className={cls.toggle}
        onClick={() => setOpen(v => !v)}
        aria-label="Vybrat stav"
        style={{ color: current.color }}
      >
        <current.Icon className={cls.icon} />
      </button>

      {open && (
        <ul className={cls.menu}>
          {OPTIONS.map(opt => (
            <li key={opt.value} className={cls.li}>
              <button
                className={cls.item}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <opt.Icon className={cls.icon} style={{ color: opt.color }} />
                <span className={cls.label} style={{ color: opt.color }}>{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}