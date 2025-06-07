'use client';

import { FiCpu } from 'react-icons/fi';
import styles    from './DeviceSelector.module.css';

export default function DeviceSelector({ value, onChange, devices = [] }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Controller</span>

      <div className={styles.field}>
        <FiCpu className={styles.icon} />

        <select
          name="deviceId"
          value={value ?? ''}                                /* STRING nebo '' */
          onChange={e => onChange(e.target.value)}
          className={styles.select}
        >
          <option value="">— vyberte controller —</option>

          {devices.map(d => (
            <option key={d._id} value={d._id.toString()}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}