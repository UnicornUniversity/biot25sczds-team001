// src/modals/DoorEditModal.js
'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FiSettings, FiX, FiSave, FiTrash2 } from 'react-icons/fi';

import DeviceSelector from './DeviceSelector';
import styles from './DoorEditModal.module.css';

export default function DoorEditModal({ door, devices = [], selectedController, onClose, onSubmit, onDelete }) {
  const [form, setForm] = useState({ name: '', description: '', deviceId: '' });
  const modalRef = useRef(null);

  // Initialize form values when door or selectedController change
  useEffect(() => {
    setForm({
      name: door.name || '',
      description: door.description || '',
      deviceId: selectedController?._id || ''
    });
  }, [door, selectedController]);

  // Warm up animation
  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { y: -60, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out' }
    );
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(door._id, form);
  };

  return (
    <div className={styles.overlay}>
      <form ref={modalRef} className={styles.modal} onSubmit={handleSubmit}>
        <header className={styles.head}>
          <h2 className={styles.title}><FiSettings /> Upravit dveře</h2>
          <button type="button" onClick={onClose} className={styles.close}><FiX /></button>
        </header>

        <div className={styles.field}>
          <label className={styles.label}>Název</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
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
            onChange={handleChange}
            className={styles.control}
          />
        </div>

        <DeviceSelector
          value={form.deviceId}
          onChange={v => setForm(prev => ({ ...prev, deviceId: v }))}
          devices={devices}
        />

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => onDelete(door._id)}
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
