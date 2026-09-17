import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { userProfile, vehicleCategories, type Vehicle } from '@/data/mock';

type AddVehicleInput = {
  plate: string;
  model: string;
  categoryId: string;
};

type AddVehicleResult = { ok: true; vehicle: Vehicle } | { ok: false; error: string };

type VehiclesContextValue = {
  vehicles: Vehicle[];
  primaryVehicle: Vehicle;
  addVehicle: (input: AddVehicleInput) => AddVehicleResult;
};

const VehiclesContext = createContext<VehiclesContextValue | null>(null);

function normalizePlate(plate: string): string {
  return plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([userProfile.vehicle]);

  const addVehicle = useCallback((input: AddVehicleInput): AddVehicleResult => {
    const plate = normalizePlate(input.plate);
    const model = input.model.trim();

    if (plate.length < 7 || model.length < 2) {
      return { ok: false, error: 'Informe placa e modelo válidos.' };
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

  const primaryVehicle = vehicles[0] ?? userProfile.vehicle;

  const value = useMemo(
    () => ({ vehicles, primaryVehicle, addVehicle }),
    [vehicles, primaryVehicle, addVehicle],
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
