/** Consulta de veículo por placa — mock local ou débitos FiscalTech. */

import { isFiscalTechEnabled } from '@/config/dataSource';
import { consultarDebitos } from '@/services/fiscaltech/client';

export type PlateLookupResult =
  | { found: true; plate: string; model: string; hasDebts: boolean }
  | { found: false; plate: string };

const SIMULATED_PLATE_REGISTRY: Record<string, string> = {
  BRA2E19: 'Honda Civic',
  ABC1D23: 'Toyota Corolla',
  XYZ9F87: 'Jeep Compass',
  MOV1234: 'Volkswagen T-Cross',
  QWE4R56: 'Hyundai HB20',
  FGH7J89: 'Chevrolet Onix',
  RIO2A34: 'Fiat Argo',
  PQR5T67: 'Renault Kwid',
};

const LOOKUP_DELAY_MS = 900;

export function normalizePlate(plate: string) {
  return plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function isCompletePlate(plate: string) {
  return normalizePlate(plate).length === 7;
}

async function lookupMock(plate: string): Promise<PlateLookupResult> {
  await new Promise((resolve) => setTimeout(resolve, LOOKUP_DELAY_MS));

  const model = SIMULATED_PLATE_REGISTRY[plate];
  if (model) {
    return { found: true, plate, model, hasDebts: true };
  }

  return { found: false, plate };
}

async function lookupFiscalTech(plate: string): Promise<PlateLookupResult> {
  const response = await consultarDebitos({ placas: [plate], placaInternacional: false });
  const resultado = response.resultados?.find((item) => item.placa === plate);
  const transacoes = resultado?.transacoes ?? [];

  if (transacoes.length === 0) {
    return { found: false, plate };
  }

  return {
    found: true,
    plate,
    model: 'Veículo',
    hasDebts: true,
  };
}

export async function lookupVehicleByPlate(plate: string): Promise<PlateLookupResult> {
  const normalized = normalizePlate(plate);

  if (isFiscalTechEnabled()) {
    return lookupFiscalTech(normalized);
  }

  return lookupMock(normalized);
}
