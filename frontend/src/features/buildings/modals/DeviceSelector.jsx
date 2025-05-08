'use client';
import { FiCpu } from 'react-icons/fi';
import styles from './DeviceSelector.module.css';

export default function DeviceSelector({ value, onChange, gateways = [] }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Gateway</span>
      <div className={styles.row}>
        <FiCpu className={styles.icon} />
        <select value={value||''} onChange={e=>onChange(e.target.value||null)} className={styles.select}>
          <option value="">— vyberte gateway —</option>
          {gateways.map(g=>(
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}