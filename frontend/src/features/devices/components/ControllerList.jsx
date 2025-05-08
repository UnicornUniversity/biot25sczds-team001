// src/components/ControllerList.jsx
'use client';

import ControllerItem from './ControllerItem';
import styles        from './ControllerList.module.css';

export default function ControllerList({ controllers, onEdit }) {
  if (!controllers || controllers.length === 0) {
    return <p className={styles.empty}>Žádné controllery</p>;
  }

  return (
    <ul className={styles.list}>
      {controllers.map(c => (
        <ControllerItem
          key={c._id}
          controller={c}
          onEdit={() => onEdit(c)}
        />
      ))}
    </ul>
  );
}