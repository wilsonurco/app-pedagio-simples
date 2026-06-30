import AsyncStorage from '@react-native-async-storage/async-storage';

import { type Vehicle } from '@/data/mock';
import { normalizePlate } from '@/services/lookupVehicleByPlate';

const STORAGE_KEY = '@pedagio-simples/vehicles';

function isVehicle(value: unknown): value is Vehicle {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Vehicle>;
  return typeof candidate.plate === 'string' && typeof candidate.model === 'string';
}

function normalizeVehicle(vehicle: Vehicle): Vehicle {
  return {
    plate: normalizePlate(vehicle.plate),
    model: vehicle.model.trim(),
  };
}

export async function loadStoredVehicles(): Promise<Vehicle[] | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    const vehicles = parsed
      .filter(isVehicle)
      .map(normalizeVehicle)
      .filter((vehicle) => vehicle.plate.length === 7 && vehicle.model.length >= 2);

    const uniqueByPlate = new Map<string, Vehicle>();
    for (const vehicle of vehicles) {
      uniqueByPlate.set(vehicle.plate, vehicle);
    }

    return [...uniqueByPlate.values()];
  } catch {
    return null;
  }
}

export async function saveStoredVehicles(vehicles: Vehicle[]): Promise<void> {
  const payload = vehicles.map(normalizeVehicle);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function clearStoredVehicles(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
