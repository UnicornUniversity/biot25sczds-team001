'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { FiSettings, FiX, FiSave, FiTrash2 } from 'react-icons/fi';

import DeviceSelector from './DeviceSelector';
import styles from './DoorEditModal.module.css';

export default function DoorEditModal({
  door,
  devices = [],
  selectedController,     // { _id, name, … } -- může být null
  onClose,
  onSubmit,
  onDelete,
}) {
  /* ---------- lokální stav ---------- */
  const [form, setForm] = useState({ name: '', description: '', deviceId: '' });

  /* ---------- naplnění formuláře po načtení ---------- */
  useEffect(() => {
    setForm({
      name:        door.name        ?? '',
      description: door.description ?? '',
      deviceId:    selectedController?._id?.toString() ?? '',   // ← povinně STRING
    });
  }, [door, selectedController]);

  /* ---------- options pro <select> ---------- */
  const deviceOptions = useMemo(() => {
    if (!selectedController) return devices;

    // přidej aktuální controller, pokud není ve výběru
    const inList = devices.some(d => d._id.toString() === selectedController._id.toString());
    return inList ? devices : [selectedController, ...devices];
  }, [devices, selectedController]);

  /* ---------- animace ---------- */
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { y: -60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .35 });
  }, []);

  /* ---------- handlery ---------- */
  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(door._id, { ...form, deviceId: form.deviceId || null });
  };

  /* ---------- render ---------- */
  return (
    <div className={styles.overlay}>
      <form ref={ref} className={styles.modal} onSubmit={handleSubmit}>
        <header className={styles.head}>
          <h2 className={styles.title}><FiSettings /> Upravit dveře</h2>
          <button type="button" onClick={onClose} className={styles.close}><FiX /></button>
        </header>

        <div className={styles.field}>
          <label className={styles.label}>Název</label>
          <input name="name" value={form.name} onChange={handleChange} className={styles.control} required />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Popis</label>
          <textarea name="description" rows={3} value={form.description} onChange={handleChange} className={styles.control} />
        </div>

        <DeviceSelector
          value={form.deviceId}                        /* STRING id */
          onChange={v => setForm(prev => ({ ...prev, deviceId: v }))}
          devices={deviceOptions}
        />

        <div className={styles.actions}>
          <button type="button" onClick={() => onDelete(door._id)} className={`${styles.btn} ${styles.delete}`}>
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