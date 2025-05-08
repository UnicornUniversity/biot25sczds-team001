'use client';

import Building          from './Building';
import BuildingAddButton from './BuildingAddButton';
import styles            from './BuildingsList.module.css';

export default function BuildingsList({ buildings, onAdd, onEdit, onLogs }) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.head}>
        <BuildingAddButton onClick={onAdd} />
      </div>
      <ul className={styles.grid}>
        {buildings.map(b => (
          <Building
            key={b._id}
            building={b}
            onEdit={() => onEdit(b)}
            onLogs={() => onLogs(b)}
          />
        ))}
      </ul>
    </section>
  );
}