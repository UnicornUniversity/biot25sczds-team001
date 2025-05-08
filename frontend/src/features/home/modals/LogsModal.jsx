'use client';

import { createPortal } from 'react-dom';
import {
  BiInfoCircle, BiCheckCircle, BiErrorAlt, BiError
} from 'react-icons/bi';

import styles from './LogsModal.module.css';

const severityMap = {
  info: {
    Icon: BiInfoCircle,
    color: 'var(--color-info)',
    interpretation:
      'Toto je informativní zpráva. Můžete ji zaznamenat pro sledování historie, není zapotřebí okamžité akce.',
  },
  success: {
    Icon: BiCheckCircle,
    color: 'var(--color-success)',
    interpretation: 'Operace proběhla úspěšně. Vše funguje podle očekávání.',
  },
  warning: {
    Icon: BiErrorAlt,
    color: 'var(--color-warning)',
    interpretation:
      'Upozornění: může dojít k potenciálnímu problému. Zkontrolujte fyzický stav dveří a zařízení.',
  },
  error: {
    Icon: BiError,
    color: 'var(--color-error)',
    interpretation:
      'Chyba – možný bezpečnostní incident! Ihned prověřte situaci a případně kontaktujte správce objektu.',
  },
};

export default function LogsModal({ log, onClose }) {
  if (!log) return null;

  const { Icon, color, interpretation } =
    severityMap[log.severity] || severityMap.info;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        style={{ borderLeftColor: color }}
      >
        <header className={styles.header}>
          <Icon className={styles.icon} style={{ color }} />
          <h2 className={styles.title}>Interpretace události</h2>
        </header>

        <div className={styles.body}>
          <div className={styles.field}>
            <span className={styles.label}>Zpráva:</span>
            <span className={styles.value}>{log.message}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Čas události:</span>
            <span className={styles.value}>
              {new Date(log.createdAt).toLocaleString()}
            </span>
          </div>
          <div className={styles.interpretation}>
            <span className={styles.label}>Co to znamená:</span>
            <p className={styles.value}>{interpretation}</p>
          </div>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          Zavřít
        </button>
      </div>
    </div>,
    document.body
  );
}