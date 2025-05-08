// src/components/RadioItem.jsx
'use client';

import { FiHardDrive }     from 'react-icons/fi';
import ControllerAddButton from './ControllerAddButton';
import ControllerList      from './ControllerList';
import RadioEditButton     from './RadioEditButton';
import styles              from './RadioItem.module.css';

export default function RadioItem({
  gateway,
  controllers,
  onEdit,
  onAddController,
  onEditController,
  onDelete,
}) {
  return (
    <li className={styles.card}>
      <header className={styles.top}>
        <div className={styles.nameWrap}>
          <FiHardDrive className={styles.gwIcon} />
          <h3 className={styles.name}>{gateway.name}</h3>
        </div>

        <div className={styles.actions}>
          <RadioEditButton onClick={onEdit} />
          <ControllerAddButton onClick={onAddController} />
        </div>
      </header>

      <p className={styles.desc}>{gateway.description || '—'}</p>

      <ControllerList
        controllers={controllers}
        onEdit={onEditController}
      />
    </li>
  );
}