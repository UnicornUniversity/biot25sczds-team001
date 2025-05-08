'use client';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiSettings, FiX, FiSave, FiTrash2 } from 'react-icons/fi';
import DeviceSelector from './DeviceSelector';
import styles from './BuildingEditModal.module.css';

export default function BuildingEditModal({
  building,
  gateways,
  onClose,
  onSubmit,
  onDelete,
}) {
  const [form, setForm] = useState({ ...building });
  const modalRef        = useRef(null);

  useEffect(() => setForm({ ...building }), [building]);

  /* animace vstupu */
  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { y:-60, autoAlpha:0 },
      { y:0,  autoAlpha:1, duration:.35, ease:'power3.out' }
    );
  }, []);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className={styles.overlay}>
      <form
        ref={modalRef}
        className={styles.modal}
        onSubmit={e => { e.preventDefault(); onSubmit(building._id, form); }}
      >
        {/* — header — */}
        <header className={styles.head}>
          <h2 className={styles.title}><FiSettings /> Upravit budovu</h2>
          <button type="button" onClick={onClose} className={styles.iconBtn}><FiX /></button>
        </header>

        {/* — fields — */}
        <div className={styles.field}>
          <label className={styles.label}>Název</label>
          <input name="name" value={form.name} onChange={handle} className={styles.control}/>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Popis</label>
          <textarea
            name="description"
            rows={3}
            value={form.description||''}
            onChange={handle}
            className={styles.control}
          />
        </div>

        <DeviceSelector
          value={form.gatewayId}
          onChange={v => setForm({ ...form, gatewayId: v })}
          gateways={gateways}
        />

        {/* — actions — */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => onDelete(building._id)}
            className={`${styles.btn} ${styles.delete}`}
          >
            <FiTrash2 /> Smazat
          </button>
          <button type="submit" className={`${styles.btn} ${styles.save}`}>
            <FiSave /> Uložit
          </button>
        </div>
      </form>
    </div>
  );
}