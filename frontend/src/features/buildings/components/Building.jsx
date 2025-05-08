'use client';
import Link from 'next/link';
import {
  FiHome,
  FiEdit2,
  FiBookOpen,
} from 'react-icons/fi';

import BuildingStateIcon from './BuildingStateIcon';
import styles            from './Building.module.css';

export default function Building({ building, onEdit, onLogs }) {
  return (
    <li className={styles.card}>
      {/* stav / badge */}
      <BuildingStateIcon className={styles.state} />

      {/* velká ikona budovy */}
      <FiHome className={styles.bigIcon} />

      {/* jméno – odkaz do detailu */}
      <Link
        href={`/buildings/${building._id}/doors`}
        className={styles.name}
      >
        {building.name}
      </Link>

      {/* akce */}
      <div className={styles.actions}>
        <button
          onClick={onLogs}
          className={styles.iconBtn}
          aria-label="Logy budovy"
        >
          <FiBookOpen />
        </button>
        <button
          onClick={onEdit}
          className={styles.iconBtn}
          aria-label="Upravit budovu"
        >
          <FiEdit2 />
        </button>
      </div>
    </li>
  );
}