/** Consulta de veículo por placa — mock local ou débitos FiscalTech. */

import { isFiscalTechEnabled } from '@/config/dataSource';
import { consultarDebitos } from '@/services/fiscaltech/client';
import { FiscalTechApiError } from '@/services/fiscaltech/types';

export type PlateLookupResult =
  | { found: true; plate: string; model: string; hasDebts: boolean }
  | {
      found: false;
      plate: string;
      reason: 'not_found' | 'invalid_format' | 'api_error';
      message?: string;
    };

const MERCOSUL_PLATE_PATTERN = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
const OLD_PLATE_PATTERN = /^[A-Z]{3}[0-9]{4}$/;

export function isValidBrazilianPlate(plate: string) {
  const normalized = normalizePlate(plate);
  return MERCOSUL_PLATE_PATTERN.test(normalized) || OLD_PLATE_PATTERN.test(normalized);
}

export function getInvalidPlateMessage(plate: string) {
  const normalized = normalizePlate(plate);
  return `Formato inválido: "${normalized}". Use Mercosul (ABC1D23) ou antigo (ABC1234).`;
}

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

export function isPlateReadyForLookup(plate: string) {
  return isCompletePlate(plate) && isValidBrazilianPlate(plate);
}

async function lookupMock(plate: string): Promise<PlateLookupResult> {
  await new Promise((resolve) => setTimeout(resolve, LOOKUP_DELAY_MS));

  const model = SIMULATED_PLATE_REGISTRY[plate];
  if (model) {
    return { found: true, plate, model, hasDebts: true };
  }

  return { found: false, plate, reason: 'not_found' };
}

async function lookupFiscalTech(plate: string): Promise<PlateLookupResult> {
  if (!isValidBrazilianPlate(plate)) {
    return {
      found: false,
      plate,
      reason: 'invalid_format',
      message: getInvalidPlateMessage(plate),
    };
  }

  try {
    const response = await consultarDebitos({ placas: [plate], placaInternacional: false });
    const resultado = response.resultados?.find((item) => item.placa === plate);

    if (!resultado) {
      return { found: false, plate, reason: 'not_found' };
    }

    const transacoes = resultado.transacoes ?? [];

    return {
      found: true,
      plate,
      model: 'Veículo',
      hasDebts: transacoes.length > 0,
    };
  } catch (error) {
    if (error instanceof FiscalTechApiError) {
      const message = error.message;
      const isInvalidFormat =
        error.status === 400 &&
        (error.code === 'REQUISICAO_INVALIDA' ||
          message.toLowerCase().includes('formato de placa'));

      if (isInvalidFormat) {
        return {
          found: false,
          plate,
          reason: 'invalid_format',
          message,
        };
      }

      return {
        found: false,
        plate,
        reason: 'api_error',
        message,
      };
    }

    return {
      found: false,
      plate,
      reason: 'api_error',
      message: 'Não foi possível consultar a placa. Tente novamente.',
    };
  }
}

export async function lookupVehicleByPlate(plate: string): Promise<PlateLookupResult> {
  const normalized = normalizePlate(plate);

  if (isFiscalTechEnabled()) {
    return lookupFiscalTech(normalized);
  }

  return lookupMock(normalized);
}
