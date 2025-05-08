// src/components/RadioList.jsx
'use client';

import RadioAddButton from './RadioAddButton';
import RadioItem      from './RadioItem';
import styles         from './RadioList.module.css';

export default function RadioList({
  gateways,
  controllers,
  onAddGateway,
  onEditGateway,
  onDeleteGateway,
  onAddController,
  onEditController,
}) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.head}>
        <h2>Radio dongly</h2>
        <RadioAddButton onClick={onAddGateway} />
      </div>

      <ul className={styles.list}>
        {gateways.map(gw => (
          <RadioItem
            key={gw._id}
            gateway={gw}
            controllers={controllers.filter(d => d.gatewayId === gw._id)}
            onEdit={() => onEditGateway(gw)}
            onDelete={() => onDeleteGateway(gw._id)}
            onAddController={() => onAddController(gw._id)}
            onEditController={onEditController}
          />
        ))}
      </ul>
    </section>
  );
}