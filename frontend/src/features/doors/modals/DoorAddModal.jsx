'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FiHome, FiX, FiPlus } from 'react-icons/fi';

import DeviceSelector from './DeviceSelector';
import styles             from './DoorAddModal.module.css';

export default function DoorAddModal({ devices = [], onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', description: '', deviceId: '', locked: false });
  const modalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(modalRef.current, { y: -60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .35, ease: 'power3.out' });
  }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className={styles.overlay}>
      <form
        ref={modalRef}
        className={styles.modal}
        onSubmit={e => { e.preventDefault(); onSubmit(form); }}
      >
        <header className={styles.head}>
          <h2 className={styles.title}><FiHome /> Přidat dveře</h2>
          <button type="button" onClick={onClose} className={styles.close}><FiX /></button>
        </header>

        <div className={styles.field}>
          <label className={styles.label}>Název</label>
          <input name="name" value={form.name} onChange={handle} className={styles.control} required />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Popis</label>
          <textarea name="description" rows={3} value={form.description} onChange={handle} className={styles.control} />
        </div>

        <DeviceSelector
          value={form.deviceId}
          onChange={v => setForm({ ...form, deviceId: v })}
          devices={devices}
        />

        <div className={styles.actions}>
          <button type="submit" className={`${styles.btn} ${styles.primary}`} disabled={!form.name.trim()}>
            <FiPlus /> Vytvořit
          </button>
        </div>
      </form>
    </div>
  );
}