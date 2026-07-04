import { normalizePlate } from '@/services/lookupVehicleByPlate';

export function resolveVehicleModel(model: string | undefined | null): string {
  return model?.trim() ?? '';
}

/** Rótulo principal do veículo (lista, título). Usa a placa quando não há modelo. */
export function vehiclePrimaryLabel(vehicle: { plate: string; model?: string }): string {
  const model = resolveVehicleModel(vehicle.model);
  const plate = normalizePlate(vehicle.plate);
  return model.length >= 2 ? model : plate;
}

/** Rótulo completo para listas: "MODELO • PLACA" ou só a placa. */
export function vehicleListLabel(vehicle: { plate: string; model?: string }): string {
  const model = resolveVehicleModel(vehicle.model);
  const plate = normalizePlate(vehicle.plate);
  return model.length >= 2 ? `${model} • ${plate}` : plate;
}
