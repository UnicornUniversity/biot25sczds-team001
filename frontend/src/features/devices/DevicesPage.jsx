'use client';

import { useState } from 'react';
import RadioList          from './components/RadioList';
import RadioAddModal      from './modals/RadioAddModal';
import RadioEditModal     from './modals/RadioEditModal';
import ControllerAddModal from './modals/ControllerAddModal';
import ControllerEditModal from './modals/ControllerEditModal';
import useDevices         from './hooks/useDevices';
import styles             from './DevicesPage.module.css';

export default function DevicesPage({ currentBuildingId }) {
  const {
    gateways,
    templatesGw,
    controllers,
    templatesCtrl,
    availableCtrl,
    attachGateway,
    updateGateway,
    detachGateway,
    attachController,
    updateController,
    detachController,
  } = useDevices(currentBuildingId);

  const [gwAddOpen, setGwAddOpen]   = useState(false);
  const [gwEdit, setGwEdit]         = useState(null);
  const [ctrlAddGw, setCtrlAddGw]   = useState(null);
  const [ctrlEdit, setCtrlEdit]     = useState(null);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Zařízení (Gateway + Controller)</h1>

      <RadioList
        gateways={gateways}
        controllers={controllers}
        onAddGateway={() => setGwAddOpen(true)}
        onEditGateway={g => setGwEdit(g)}
        onDeleteGateway={detachGateway}
        onAddController={gatewayId => setCtrlAddGw(gatewayId)}
        onEditController={device => setCtrlEdit(device)}
      />

      {gwAddOpen && (
        <RadioAddModal
          templates={templatesGw}
          onClose={() => setGwAddOpen(false)}
          onSubmit={({ templateId, name, description }) => {
            attachGateway(templateId, { name, description });
            setGwAddOpen(false);
          }}
        />
      )}

      {gwEdit && (
        <RadioEditModal
          gateway={gwEdit}
          onClose={() => setGwEdit(null)}
          onSubmit={(id, data) => {
            updateGateway(id, data);
            setGwEdit(null);
          }}
          onDelete={id => {
            detachGateway(id);
            setGwEdit(null);
          }}
        />
      )}

      {ctrlAddGw && (
        <ControllerAddModal
          gatewayId={ctrlAddGw}
          onClose={() => setCtrlAddGw(null)}
          onSubmit={(gwId, form) => {
            attachController(form.templateId, {
              gatewayId: gwId,
              doorId:    null,
              name:      form.name,
              description: form.description,
            });
            setCtrlAddGw(null);
          }}
        />
      )}

      {ctrlEdit && (
        <ControllerEditModal
          device={ctrlEdit}
          onClose={() => setCtrlEdit(null)}
          onSubmit={(id, data) => {
            updateController(id, data);
            setCtrlEdit(null);
          }}
          onDelete={id => {
            detachController(id);
            setCtrlEdit(null);
          }}
        />
      )}
    </main>
  );
}