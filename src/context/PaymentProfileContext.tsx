import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { type CardBrand } from '@/utils/cardFormat';

export type SavedCreditCard = {
  holderName: string;
  brand: CardBrand;
  last4: string;
  expiry: string;
};

type PaymentProfileContextValue = {
  savedCard: SavedCreditCard | null;
  saveCreditCard: (card: SavedCreditCard) => void;
  clearCreditCard: () => void;
};

const PaymentProfileContext = createContext<PaymentProfileContextValue | null>(null);

export function PaymentProfileProvider({ children }: { children: ReactNode }) {
  const [savedCard, setSavedCard] = useState<SavedCreditCard | null>(null);

  const saveCreditCard = useCallback((card: SavedCreditCard) => {
    setSavedCard(card);
  }, []);

  const clearCreditCard = useCallback(() => {
    setSavedCard(null);
  }, []);

  const value = useMemo(
    () => ({
      savedCard,
      saveCreditCard,
      clearCreditCard,
    }),
    [savedCard, saveCreditCard, clearCreditCard],
  );

  return (
    <PaymentProfileContext.Provider value={value}>{children}</PaymentProfileContext.Provider>
  );
}

export function usePaymentProfile() {
  const context = useContext(PaymentProfileContext);
  if (!context) {
    throw new Error('usePaymentProfile must be used within PaymentProfileProvider');
  }
  return context;
}
