import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { isFiscalTechEnabled } from '@/config/dataSource';
import { formatNowForPassage } from '@/utils/dateTime';
import { generateReceiptId } from '@/utils/receiptHtml';
import { consultarDebitos } from '@/services/fiscaltech/client';
import { mapDebitosToPassages } from '@/services/fiscaltech/mappers';

import { initialPassages, type Passage } from '@/data/mock';

type RefreshOptions = {
  vehicleModels?: Record<string, string>;
};

type PassagesContextValue = {
  passages: Passage[];
  pendingPassages: Passage[];
  pendingTotal: number;
  isLoading: boolean;
  loadError: string | null;
  getPassage: (id: string) => Passage | undefined;
  refreshDebts: (plates: string[], options?: RefreshOptions) => Promise<void>;
  markAsPaid: (ids: string[], paymentMethod?: string, fiscalProtocol?: string) => void;
};

const PassagesContext = createContext<PassagesContextValue | null>(null);

export function PassagesProvider({ children }: { children: ReactNode }) {
  const [passages, setPassages] = useState<Passage[]>(
    isFiscalTechEnabled() ? [] : initialPassages,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const pendingPassages = useMemo(
    () => passages.filter((p) => p.status === 'pending'),
    [passages],
  );

  const pendingTotal = useMemo(
    () => pendingPassages.reduce((sum, p) => sum + p.amount, 0),
    [pendingPassages],
  );

  const getPassage = useCallback(
    (id: string) => passages.find((p) => p.id === id),
    [passages],
  );

  const refreshDebts = useCallback(async (plates: string[], options?: RefreshOptions) => {
    if (!isFiscalTechEnabled()) return;
    if (plates.length === 0) {
      setPassages([]);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const normalizedPlates = [...new Set(plates.map((p) => p.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()))];
      const response = await consultarDebitos({
        placas: normalizedPlates,
        placaInternacional: false,
      });

      const pendingFromApi = mapDebitosToPassages(response.resultados ?? [], options?.vehicleModels);

      setPassages((current) => {
        const paidPassages = current.filter((passage) => passage.status === 'paid');
        const paidIds = new Set(paidPassages.map((passage) => passage.id));
        const freshPending = pendingFromApi.filter((passage) => !paidIds.has(passage.id));
        return [...freshPending, ...paidPassages];
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao consultar débitos';
      setLoadError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsPaid = useCallback(
    (ids: string[], paymentMethod = 'Pix', fiscalProtocol?: string) => {
      const now = formatNowForPassage();

      setPassages((current) =>
        current.map((passage) =>
          ids.includes(passage.id)
            ? {
                ...passage,
                status: 'paid' as const,
                paidAt: now,
                paymentMethod,
                receiptId: generateReceiptId(passage.passageId),
                fiscalProtocol,
                disponivel: true,
              }
            : passage,
        ),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      passages,
      pendingPassages,
      pendingTotal,
      isLoading,
      loadError,
      getPassage,
      refreshDebts,
      markAsPaid,
    }),
    [passages, pendingPassages, pendingTotal, isLoading, loadError, getPassage, refreshDebts, markAsPaid],
  );

  return <PassagesContext.Provider value={value}>{children}</PassagesContext.Provider>;
}

export function usePassages() {
  const context = useContext(PassagesContext);
  if (!context) {
    throw new Error('usePassages deve ser usado dentro de PassagesProvider');
  }
  return context;
}
