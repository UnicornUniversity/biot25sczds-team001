'use client';

import { useParams } from 'next/navigation';
import DoorsPage     from '@/features/doors/DoorsPage';

export default function BuildingDoorsRoute() {
  const params = useParams();
  const buildingId = params.buildingId;
  return <DoorsPage buildingId={buildingId} />;
}