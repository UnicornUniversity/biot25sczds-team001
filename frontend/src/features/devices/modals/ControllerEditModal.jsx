'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSettings, FiX, FiSave, FiTrash2 } from 'react-icons/fi';
import gsap from 'gsap';
import styles from './ControllerEditModal.module.css';

export default function ControllerEditModal({ device, onClose, onSubmit, onDelete }) {
  const [form, setForm] = useState({ ...device });
  const ref = useRef(null);

  useEffect(() => setForm({ ...device }), [device]);
  useEffect(() => {
    gsap.fromTo(ref.current, { y: -60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .35 });
  }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className={styles.overlay}>
      <form
        ref={ref}
        className={styles.modal}
        onSubmit={e => { e.preventDefault(); onSubmit(device._id, form); }}
      >
        <header className={styles.head}>
          <h2 className={styles.title}><FiSettings /> Upravit controller</h2>
          <button type="button" className={styles.close} onClick={onClose}><FiX /></button>
        </header>

        <div className={styles.field}>
          <label className={styles.label}>Název</label>
          <input name="name" value={form.name} onChange={handle} className={styles.control} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Popis</label>
          <textarea name="description" rows={3} value={form.description || ''} onChange={handle} className={styles.control} />
        </div>

        <div className={styles.actions}>
          <button type="button" className={`${styles.btn} ${styles.delete}`} onClick={() => onDelete(device._id)}>
            <FiTrash2 /> Odpojit
          </button>
          <button type="submit" className={`${styles.btn} ${styles.primary}`}>
            <FiSave /> Uložit
          </button>
        </div>
      </form>
    </div>
  );
}
