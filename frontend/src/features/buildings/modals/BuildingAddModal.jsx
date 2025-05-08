// src/components/BuildingAddModal.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FiHome, FiX, FiPlus } from 'react-icons/fi';
import DeviceSelector from './DeviceSelector';
import styles from './BuildingAddModal.module.css';

export default function BuildingAddModal({ gateways = [], onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    gatewayId: '',
  });
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current, { y: -60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 });
  }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  // stačí validovat jen name
  const canSubmit = form.name.trim().length > 0;

  return (
    <div className={styles.overlay}>
      <form
        ref={ref}
        className={styles.modal}
        onSubmit={e => { e.preventDefault(); onSubmit(form); }}
      >
        <header className={styles.head}>
          <h2 className={styles.title}><FiHome/> Přidat budovu</h2>
          <button type="button" onClick={onClose} className={styles.iconBtn}><FiX/></button>
        </header>

        <div className={styles.field}>
          <label className={styles.label}>Název</label>
          <input
            name="name"
            value={form.name}
            onChange={handle}
            className={styles.control}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Popis</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handle}
            className={styles.control}
          />
        </div>

        <DeviceSelector
          value={form.gatewayId}
          onChange={v => setForm({ ...form, gatewayId: v })}
          gateways={gateways}
        />

        <button
          type="submit"
          className={`${styles.btn} ${styles.primary}`}
          disabled={!canSubmit}
        >
          <FiPlus/> Vytvořit
        </button>
      </form>
    </div>
  );
}