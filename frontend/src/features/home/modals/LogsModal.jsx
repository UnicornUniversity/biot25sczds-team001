/*******************************  LogsModal.jsx  ******************************/
import { createPortal } from 'react-dom';
import {
  BiInfoCircle,
  BiCheckCircle,
  BiErrorAlt,
  BiError,
} from 'react-icons/bi';
import modalStyles from './LogsModal.module.css';

const modalSeverityMap = {
  info: {
    Icon: BiInfoCircle,
    color: 'var(--color-info)',
    interpretation:
      'Toto je informativní zpráva. Můžete ji zaznamenat pro sledování historie, není zapotřebí okamžité akce.',
  },
  success: {
    Icon: BiCheckCircle,
    color: 'var(--color-success)',
    interpretation: 'Operace proběhla úspěšně. Vše funguje podle očekávání.',
  },
  warning: {
    Icon: BiErrorAlt,
    color: 'var(--color-warning)',
    interpretation:
      'Upozornění: může dojít k potenciálnímu problému. Zkontrolujte fyzický stav dveří a zařízení.',
  },
  error: {
    Icon: BiError,
    color: 'var(--color-error)',
    interpretation:
      'Chyba – možný bezpečnostní incident! Ihned prověřte situaci a případně kontaktujte správce objektu.',
  },
};

function LogsModal({ log, onClose }) {
  if (!log) return null;

  const { Icon, color, interpretation } =
    modalSeverityMap[log.severity] || modalSeverityMap.info;

  return createPortal(
    <div className={modalStyles.overlay} onClick={onClose}>
      <div
        className={modalStyles.modal}
        onClick={(e) => e.stopPropagation()}
        style={{ borderLeftColor: color }}
      >
        <header className={modalStyles.header}>
          <Icon className={modalStyles.icon} style={{ color }} />
          <h2 className={modalStyles.title}>Interpretace události</h2>
        </header>

        <div className={modalStyles.body}>
          <div className={modalStyles.field}>
            <span className={modalStyles.label}>Zpráva:</span>
            <span className={modalStyles.value}>{log.message}</span>
          </div>
          <div className={modalStyles.field}>
            <span className={modalStyles.label}>Čas události:</span>
            <span className={modalStyles.value}>
              {new Date(log.createdAt).toLocaleString()}
            </span>
          </div>

          {log.buildingName && (
            <div className={modalStyles.field}>
              <span className={modalStyles.label}>Budova:</span>
              <span className={modalStyles.value}>{log.buildingName}</span>
            </div>
          )}
          {log.doorName && (
            <div className={modalStyles.field}>
              <span className={modalStyles.label}>Dveře:</span>
              <span className={modalStyles.value}>{log.doorName}</span>
            </div>
          )}

          <div className={modalStyles.interpretation}>
            <span className={modalStyles.label}>Co to znamená:</span>
            <p className={modalStyles.value}>{interpretation}</p>
          </div>
        </div>

        <button className={modalStyles.closeBtn} onClick={onClose}>
          Zavřít
        </button>
      </div>
    </div>,
    document.body,
  );
}

export { LogsModal as default };
