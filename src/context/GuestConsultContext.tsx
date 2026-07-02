import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { PlateLookupResult } from '@/services/lookupVehicleByPlate';

export type RegistrationDraft = {
  cpf: string;
  name: string;
  birthDate: string;
  email: string;
  phone: string;
};

type GuestConsultContextValue = {
  consultedPlate: string | null;
  lookupResult: PlateLookupResult | null;
  /** Quantidade de débitos — sem detalhes enquanto o usuário não estiver cadastrado. */
  pendingDebitCount: number;
  registrationDraft: RegistrationDraft | null;
  setConsultResult: (plate: string, lookup: PlateLookupResult, pendingDebitCount: number) => void;
  setRegistrationDraft: (draft: RegistrationDraft) => void;
  clearRegistrationDraft: () => void;
  clearConsult: () => void;
};

const GuestConsultContext = createContext<GuestConsultContextValue | null>(null);

export function GuestConsultProvider({ children }: { children: ReactNode }) {
  const [consultedPlate, setConsultedPlate] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<PlateLookupResult | null>(null);
  const [pendingDebitCount, setPendingDebitCount] = useState(0);
  const [registrationDraft, setRegistrationDraftState] = useState<RegistrationDraft | null>(null);

  const setConsultResult = useCallback(
    (plate: string, lookup: PlateLookupResult, count: number) => {
      setConsultedPlate(plate);
      setLookupResult(lookup);
      setPendingDebitCount(count);
    },
    [],
  );

  const setRegistrationDraft = useCallback((draft: RegistrationDraft) => {
    setRegistrationDraftState(draft);
  }, []);

  const clearRegistrationDraft = useCallback(() => {
    setRegistrationDraftState(null);
  }, []);

  const clearConsult = useCallback(() => {
    setConsultedPlate(null);
    setLookupResult(null);
    setPendingDebitCount(0);
  }, []);

  const value = useMemo(
    () => ({
      consultedPlate,
      lookupResult,
      pendingDebitCount,
      registrationDraft,
      setConsultResult,
      setRegistrationDraft,
      clearRegistrationDraft,
      clearConsult,
    }),
    [
      consultedPlate,
      lookupResult,
      pendingDebitCount,
      registrationDraft,
      setConsultResult,
      setRegistrationDraft,
      clearRegistrationDraft,
      clearConsult,
    ],
  );

  return (
    <GuestConsultContext.Provider value={value}>{children}</GuestConsultContext.Provider>
  );
}

export function useGuestConsult() {
  const context = useContext(GuestConsultContext);
  if (!context) {
    throw new Error('useGuestConsult deve ser usado dentro de GuestConsultProvider');
  }
  return context;
}
