'use client';
import { FiCpu }             from 'react-icons/fi';
import ControllerEditButton  from './ControllerEditButton';

import styles from './ControllerItem.module.css';

export default function ControllerItem({ controller, onEdit }) {
  return (
    <li className={styles.row}>
      <div className={styles.left}>
        <FiCpu className={styles.cIcon}/>
        <span className={styles.name}>{controller.name}</span>
      </div>

      <ControllerEditButton onClick={onEdit}/>
    </li>
  );
}