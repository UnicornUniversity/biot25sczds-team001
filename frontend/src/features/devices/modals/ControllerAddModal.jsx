'use client';

import { useState, useEffect, useRef } from 'react';
import { FaMicrochip } from 'react-icons/fa6';
import { FiX, FiPlus } from 'react-icons/fi';
import gsap from 'gsap';
import { authFetch } from '@/lib/authFetch';
import { API_ROUTES } from '@/lib/apiRoutes';

import styles from './ControllerAddModal.module.css';

export default function ControllerAddModal({ gatewayId, onClose, onSubmit }) {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({ templateId: '', name: '', description: '' });
  const ref = useRef(null);

  // modal animation
  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { y: -60, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35 }
    );
  }, []);

  // load controller‐templates for this gateway
  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${API_ROUTES.devices.templates}?gatewayId=${gatewayId}`);
        if (!res.ok) throw new Error(`Templates ${res.status}`);
        const { data } = await res.json();

        if (process.env.NODE_ENV === 'development') {
        console.log('Loaded controller templates for gateway', gatewayId, data);
        }

        setTemplates(data);
      } catch (err) {
        console.error('Failed to load controller templates:', err);
      }
    })();
  }, [gatewayId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <div className={styles.overlay}>
      <form
        ref={ref}
        className={styles.modal}
        onSubmit={e => {
          e.preventDefault();
          onSubmit(gatewayId, form);
        }}
      >
        <header className={styles.head}>
          <h2 className={styles.title}><FaMicrochip /> Přidat controller</h2>
          <button type="button" className={styles.close} onClick={onClose}>
            <FiX />
          </button>
        </header>

        <div className={styles.field}>
          <label className={styles.label}>Vyberte dostupný modul</label>
          <select
            name="templateId"
            value={form.templateId}
            onChange={handleChange}
            className={styles.control}
            required
          >
            <option value="">— dostupné šablony —</option>
            {templates.map(t => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Zobrazovaný název</label>
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

        <div className={styles.actions}>
          <button
            type="submit"
            className={`${styles.btn} ${styles.primary}`}
            disabled={!form.templateId || !form.name.trim()}
          >
            <FiPlus /> Přidat
          </button>
        </div>
      </form>
    </div>
  );
}