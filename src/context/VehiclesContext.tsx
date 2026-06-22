import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { normalizePlate } from '@/services/lookupVehicleByPlate';
import { userProfile, type Vehicle } from '@/data/mock';

type VehiclesContextValue = {
  vehicles: Vehicle[];
  primaryVehicle: Vehicle | undefined;
  hasVehicle: (plate: string) => boolean;
  addVehicle: (vehicle: Vehicle) => boolean;
  removeVehicle: (plate: string) => boolean;
};

const VehiclesContext = createContext<VehiclesContextValue | null>(null);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([userProfile.vehicle]);

  const hasVehicle = useCallback(
    (plate: string) =>
      vehicles.some((vehicle) => normalizePlate(vehicle.plate) === normalizePlate(plate)),
    [vehicles],
  );

  const addVehicle = useCallback((vehicle: Vehicle) => {
    const normalizedPlate = normalizePlate(vehicle.plate);
    let added = false;

    setVehicles((current) => {
      if (current.some((item) => normalizePlate(item.plate) === normalizedPlate)) {
        return current;
      }
      added = true;
      return [...current, { ...vehicle, plate: normalizedPlate }];
    });

    return added;
  }, []);

  const removeVehicle = useCallback((plate: string) => {
    const normalizedPlate = normalizePlate(plate);
    let removed = false;

    setVehicles((current) => {
      const next = current.filter((item) => normalizePlate(item.plate) !== normalizedPlate);
      if (next.length === current.length) {
        return current;
      }
      removed = true;
      return next;
    });

    return removed;
  }, []);

  const primaryVehicle = vehicles[0];

  const value = useMemo(
    () => ({
      vehicles,
      primaryVehicle,
      hasVehicle,
      addVehicle,
      removeVehicle,
    }),
    [vehicles, primaryVehicle, hasVehicle, addVehicle, removeVehicle],
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
