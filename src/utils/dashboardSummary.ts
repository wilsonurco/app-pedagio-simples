import { type Passage } from '@/data/mock';
import { normalizePlate } from '@/services/lookupVehicleByPlate';
import { compareAppDateTime } from '@/utils/dateTime';

export type DueDateSummary = {
  earliest: string;
  uniqueCount: number;
};

export type DashboardSummary = {
  pendingCount: number;
  pendingTotal: number;
  vehicleCount: number;
  platesWithDebt: number;
  dueDateSummary: DueDateSummary | null;
};

export function getDueDateSummary(passages: Pick<Passage, 'dueDate'>[]): DueDateSummary | null {
  const uniqueDates = [
    ...new Set(passages.map((passage) => passage.dueDate).filter(Boolean) as string[]),
  ];
  if (uniqueDates.length === 0) return null;

  const sorted = [...uniqueDates].sort((a, b) => compareAppDateTime(a, b));
  return {
    earliest: sorted[0]!,
    uniqueCount: uniqueDates.length,
  };
}

export function getPlatesWithDebt(passages: Pick<Passage, 'plate'>[]) {
  return new Set(passages.map((passage) => normalizePlate(passage.plate))).size;
}

export function formatVehicleSummary(vehicleCount: number, platesWithDebt: number) {
  if (vehicleCount <= 1) {
    return vehicleCount === 1 ? '1 veículo cadastrado' : 'Nenhum veículo cadastrado';
  }

  if (platesWithDebt === 0) {
    return `${vehicleCount} veículos cadastrados`;
  }

  if (platesWithDebt === vehicleCount) {
    return `${vehicleCount} veículos · todos com débito`;
  }

  if (platesWithDebt === 1) {
    return `${vehicleCount} veículos · débito em 1 placa`;
  }

  return `${vehicleCount} veículos · ${platesWithDebt} com débito`;
}

export function formatIdleVehicleHint(vehicleCount: number) {
  if (vehicleCount === 1) return '1 veículo cadastrado · tudo em dia';
  return `${vehicleCount} veículos cadastrados · tudo em dia`;
}

export function buildDashboardSummary(
  pendingPassages: Passage[],
  pendingTotal: number,
  vehicleCount: number,
): DashboardSummary {
  return {
    pendingCount: pendingPassages.length,
    pendingTotal,
    vehicleCount,
    platesWithDebt: getPlatesWithDebt(pendingPassages),
    dueDateSummary: getDueDateSummary(pendingPassages),
  };
}
