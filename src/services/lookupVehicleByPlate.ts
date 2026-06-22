/** Simulação de consulta de veículo por placa (substituir por API real). */

export type PlateLookupResult =
  | { found: true; plate: string; model: string }
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

export async function lookupVehicleByPlate(plate: string): Promise<PlateLookupResult> {
  const normalized = normalizePlate(plate);

  await new Promise((resolve) => setTimeout(resolve, LOOKUP_DELAY_MS));

  const model = SIMULATED_PLATE_REGISTRY[normalized];
  if (model) {
    return { found: true, plate: normalized, model };
  }

  return { found: false, plate: normalized };
}

export const simulatedPlateExamples = Object.keys(SIMULATED_PLATE_REGISTRY);
