'use client';

/******************************  HomeLogItem.jsx  ******************************/
import {
  BiInfoCircle,
  BiCheckCircle,
  BiError,
  BiErrorAlt,
} from 'react-icons/bi';
import styles from './HomeLogItem.module.css';

const severityMap = {
  info:    { icon: BiInfoCircle,  color: 'var(--color-info)'    },
  success: { icon: BiCheckCircle, color: 'var(--color-success)' },
  warning: { icon: BiErrorAlt,    color: 'var(--color-warning)' },
  error:   { icon: BiError,       color: 'var(--color-error)'   },
};

/** Helper: escape regex metacharacters */
function escapeRegExp(str = '') {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Vrátí text pro "budova / dveře" bez duplicit.
 * - Vyhodí výskyty buildingName (case-insensitive) z doorName, i pokud jsou v [hranatých] či (kulatých) závorkách.
 * - Pokud po očištění zůstane doorName prázdné nebo shodné → zobrazí jen buildingName.
 */
function composeMeta(buildingName = '', doorName = '') {
  const b = buildingName.trim();
  let d  = doorName.trim();

  if (!b && !d) return '';
  if (!b) return d;

  // odeber duplicitní buildingName z doorName
  if (d) {
    const patt = new RegExp(`\\s*[\\/(\\[]?${escapeRegExp(b)}[\\)\\]]?\\s*`, 'gi');
    d = d.replace(patt, '');
    d = d.replace(/\s{2,}/g, ' ').trim();          // zredukuj vícenásobné mezery
    d = d.replace(/^[-–/]+|[-–/]+$/g, '').trim();   // ořízni zbytky lomítek, pomlček
  }

  if (!d || d.toLowerCase() === b.toLowerCase()) return b;
  return `${b} / ${d}`;
}

export default function HomeLogItem({ log, onClick }) {
  const Meta  = severityMap[log.severity] || {};
  const Icon  = Meta.icon || BiInfoCircle;
  const label = composeMeta(log.buildingName, log.doorName);

  return (
    <li
      className={styles.item}
      data-severity={log.severity}
      onClick={onClick}
    >
      <Icon className={styles.icon} style={{ color: Meta.color }} />

      <div className={styles.content}>
        <span className={styles.message}>{log.message}</span>
        {label && <span className={styles.meta}>{label}</span>}
        <time className={styles.timestamp}>
          {new Date(log.createdAt).toLocaleString()}
        </time>
      </div>
    </li>
  );
}
