// src/features/doors/components/Building.jsx
'use client';

import Link from 'next/link';
import { FiHome, FiEdit2, FiBookOpen } from 'react-icons/fi';
import BuildingStateIcon from './BuildingStateIcon';
import styles from './Building.module.css';

/** Kliknutelná celá karta + funkční akční ikonky */
export default function Building({ building, onEdit, onLogs }) {
  const doorHref = `/buildings/${building._id}/doors`;

  return (
    <li className={styles.card} data-status={building.status}>
      {/* Overlay odkaz přes celou kartu */}
      <Link
        href={doorHref}
        className={styles.fullLink}
        aria-label={`Přejít na dveře – ${building.name}`}
      />

      {/* Badge se stavem */}
      <BuildingStateIcon status={building.status} className={styles.state} />

      {/* Hlavní ikona */}
      <FiHome className={styles.bigIcon} />

      {/* Název budovy */}
      <span className={styles.name}>{building.name}</span>

      {/* Akce */}
      <div className={styles.actions}>
        <button
          onClick={e => {
            e.stopPropagation(); // nespustí overlay link
            onLogs();
          }}
          className={styles.iconBtn}
          aria-label="Logy budovy"
        >
          <FiBookOpen />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onEdit();
          }}
          className={styles.iconBtn}
          aria-label="Upravit budovu"
        >
          <FiEdit2 />
        </button>
      </div>
    </li>
  );
}