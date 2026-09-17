import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { isFiscalTechEnabled } from '@/config/dataSource';
import { userProfile, vehicleCategories, type Vehicle } from '@/data/mock';
import { normalizePlate } from '@/services/lookupVehicleByPlate';

type AddVehicleInput = {
  plate: string;
  model: string;
  categoryId: string;
};

type AddVehicleResult = { ok: true; vehicle: Vehicle } | { ok: false; error: string };

type VehiclesContextValue = {
  vehicles: Vehicle[];
  primaryVehicle: Vehicle | undefined;
  addVehicle: (input: AddVehicleInput) => AddVehicleResult;
  clearVehicles: () => void;
};

const VehiclesContext = createContext<VehiclesContextValue | null>(null);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    isFiscalTechEnabled() ? [] : [userProfile.vehicle],
  );

  const addVehicle = useCallback((input: AddVehicleInput): AddVehicleResult => {
    const plate = normalizePlate(input.plate);
    const model = input.model.trim() || plate;

    if (plate.length < 7) {
      return { ok: false, error: 'Informe uma placa válida.' };
    }

    const category =
      vehicleCategories.find((item) => item.id === input.categoryId)?.label ??
      vehicleCategories[0].label;

    let result: AddVehicleResult = {
      ok: false,
      error: 'Não foi possível cadastrar o veículo.',
    };

    setVehicles((current) => {
      const alreadyRegistered = current.some(
        (vehicle) => normalizePlate(vehicle.plate) === plate,
      );
      if (alreadyRegistered) {
        result = { ok: false, error: 'Já existe um veículo cadastrado com essa placa.' };
        return current;
      }

      const vehicle: Vehicle = { plate, model, category };
      result = { ok: true, vehicle };
      return [vehicle, ...current];
    });

    return result;
  }, []);

  const clearVehicles = useCallback(() => {
    setVehicles([]);
  }, []);

  const primaryVehicle = vehicles[0];

  const value = useMemo(
    () => ({ vehicles, primaryVehicle, addVehicle, clearVehicles }),
    [vehicles, primaryVehicle, addVehicle, clearVehicles],
  );

  return <VehiclesContext.Provider value={value}>{children}</VehiclesContext.Provider>;
}

export function useVehicles() {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error('useVehicles deve ser usado dentro de VehiclesProvider');
  }
  return context;
}
