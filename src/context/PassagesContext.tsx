import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { formatNowForPassage } from '@/utils/dateTime';
import { generateReceiptId } from '@/utils/receiptHtml';

import { initialPassages, type Passage } from '@/data/mock';

type PassagesContextValue = {
  passages: Passage[];
  pendingPassages: Passage[];
  pendingTotal: number;
  getPassage: (id: string) => Passage | undefined;
  markAsPaid: (ids: string[], paymentMethod?: string) => void;
};

const PassagesContext = createContext<PassagesContextValue | null>(null);

export function PassagesProvider({ children }: { children: ReactNode }) {
  const [passages, setPassages] = useState<Passage[]>(initialPassages);

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

  const markAsPaid = useCallback((ids: string[], paymentMethod = 'Pix') => {
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
            }
          : passage,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      passages,
      pendingPassages,
      pendingTotal,
      getPassage,
      markAsPaid,
    }),
    [passages, pendingPassages, pendingTotal, getPassage, markAsPaid],
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
