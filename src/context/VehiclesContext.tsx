import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '@/context/AuthContext';
import { addVehicleRemote, removeVehicleRemote } from '@/services/auth/client';
import { AuthApiError } from '@/services/auth/types';
import { normalizePlate } from '@/services/lookupVehicleByPlate';
import { loadStoredVehicles, saveStoredVehicles } from '@/utils/vehicleStorage';
import { type Vehicle } from '@/data/mock';

type VehiclesContextValue = {
  vehicles: Vehicle[];
  isHydrated: boolean;
  isSyncing: boolean;
  primaryVehicle: Vehicle | undefined;
  hasVehicle: (plate: string) => boolean;
  getVehicle: (plate: string) => Vehicle | undefined;
  addVehicle: (vehicle: Vehicle) => Promise<boolean>;
  removeVehicle: (plate: string) => Promise<boolean>;
};

const VehiclesContext = createContext<VehiclesContextValue | null>(null);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, vehicles: authVehicles, setVehicles: setAuthVehicles, isBootstrapping } =
    useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let active = true;

    loadStoredVehicles()
      .then((stored) => {
        if (!active || isAuthenticated) return;
        if (stored !== null) setVehicles(stored);
      })
      .finally(() => {
        if (active) setIsHydrated(true);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isBootstrapping) return;

    if (isAuthenticated) {
      setVehicles(authVehicles);
      setIsHydrated(true);
      return;
    }

    setVehicles([]);
  }, [isAuthenticated, authVehicles, isBootstrapping]);

  useEffect(() => {
    if (!isHydrated || isAuthenticated) return;
    saveStoredVehicles(vehicles).catch(() => undefined);
  }, [vehicles, isHydrated, isAuthenticated]);

  const hasVehicle = useCallback(
    (plate: string) =>
      vehicles.some((vehicle) => normalizePlate(vehicle.plate) === normalizePlate(plate)),
    [vehicles],
  );

  const getVehicle = useCallback(
    (plate: string) =>
      vehicles.find((vehicle) => normalizePlate(vehicle.plate) === normalizePlate(plate)),
    [vehicles],
  );

  const addVehicle = useCallback(
    async (vehicle: Vehicle) => {
      const normalizedPlate = normalizePlate(vehicle.plate);
      const payload = { ...vehicle, plate: normalizedPlate };

      if (hasVehicle(normalizedPlate)) return false;

      if (isAuthenticated) {
        setIsSyncing(true);
        try {
          const response = await addVehicleRemote(payload);
          setAuthVehicles((current) => {
            if (current.some((item) => normalizePlate(item.plate) === normalizedPlate)) {
              return current;
            }
            return [...current, response.vehicle];
          });
          return true;
        } catch (error) {
          if (error instanceof AuthApiError && error.status === 409) return false;
          throw error;
        } finally {
          setIsSyncing(false);
        }
      }

      setVehicles((current) => [...current, payload]);
      return true;
    },
    [hasVehicle, isAuthenticated, setAuthVehicles],
  );

  const removeVehicle = useCallback(
    async (plate: string) => {
      const normalizedPlate = normalizePlate(plate);

      if (isAuthenticated) {
        setIsSyncing(true);
        try {
          await removeVehicleRemote(normalizedPlate);
          setAuthVehicles((current) =>
            current.filter((item) => normalizePlate(item.plate) !== normalizedPlate),
          );
          return true;
        } catch (error) {
          if (error instanceof AuthApiError && error.status === 404) return false;
          throw error;
        } finally {
          setIsSyncing(false);
        }
      }

      let removed = false;
      setVehicles((current) => {
        const next = current.filter((item) => normalizePlate(item.plate) !== normalizedPlate);
        removed = next.length !== current.length;
        return next;
      });
      return removed;
    },
    [isAuthenticated, setAuthVehicles],
  );

  const primaryVehicle = vehicles[0];

  const value = useMemo(
    () => ({
      vehicles,
      isHydrated,
      isSyncing,
      primaryVehicle,
      hasVehicle,
      getVehicle,
      addVehicle,
      removeVehicle,
    }),
    [vehicles, isHydrated, isSyncing, primaryVehicle, hasVehicle, getVehicle, addVehicle, removeVehicle],
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
