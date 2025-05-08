'use client';

import {
  BiInfoCircle,
  BiCheckCircle,
  BiError,
  BiErrorAlt
} from 'react-icons/bi';
import styles from './HomeLogItem.module.css';

const severityMap = {
  info:    { icon: BiInfoCircle,  color: 'var(--color-info)'    },
  success: { icon: BiCheckCircle, color: 'var(--color-success)' },
  warning: { icon: BiErrorAlt,    color: 'var(--color-warning)' },
  error:   { icon: BiError,       color: 'var(--color-error)'   },
};

export default function HomeLogItem({ log, onClick }) {
  const Meta = severityMap[log.severity] || {};
  const Icon = Meta.icon || BiInfoCircle;

  return (
    <li
      className={styles.item}
      data-severity={log.severity}
      onClick={onClick}
    >
      <Icon className={styles.icon} style={{ color: Meta.color }} />
      <div className={styles.content}>
        <span className={styles.message}>{log.message}</span>
        <time className={styles.timestamp}>
          {new Date(log.createdAt).toLocaleString()}
        </time>
      </div>
    </li>
  );
}