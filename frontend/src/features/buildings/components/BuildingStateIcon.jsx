'use client';

import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function BuildingStateIcon({ status }) {
  // status: 'safe' | 'alert'
  const ok   = status !== 'alert';
  const Icon = ok ? FiCheckCircle : FiAlertCircle;
  const color = ok ? 'var(--color-success)' : 'var(--color-error)';

  return <Icon style={{ color, fontSize: '1.3rem' }} />;
}