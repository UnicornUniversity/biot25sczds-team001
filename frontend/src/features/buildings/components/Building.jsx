'use client';

import Link from 'next/link';
import { FiHome, FiEdit2, FiBookOpen } from 'react-icons/fi';
import BuildingStateIcon from './BuildingStateIcon';
import styles from './Building.module.css';

export default function Building({ building, onEdit, onLogs }) {
  return (
    <li className={styles.card} data-status={building.status}>
      {/* badge se stavem */}
      <BuildingStateIcon status={building.status} className={styles.state} />

      {/* hlavní ikona */}
      <FiHome className={styles.bigIcon} />

      {/* jméno – odkaz do dveří */}
      <Link href={`/buildings/${building._id}/doors`} className={styles.name}>
        {building.name}
      </Link>

      {/* akce */}
      <div className={styles.actions}>
        <button onClick={onLogs} className={styles.iconBtn} aria-label="Logy budovy">
          <FiBookOpen />
        </button>
        <button onClick={onEdit} className={styles.iconBtn} aria-label="Upravit budovu">
          <FiEdit2 />
        </button>
      </div>
    </li>
  );
}