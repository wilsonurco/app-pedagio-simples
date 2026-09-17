import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { userProfile } from '@/data/mock';

type SessionProfile = {
  name: string;
  email: string;
};

type SessionContextValue = {
  signedIn: boolean;
  profile: SessionProfile | null;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(true);

  const signOut = useCallback(() => {
    setSignedIn(false);
  }, []);

  const value = useMemo(
    () => ({
      signedIn,
      profile: signedIn ? { name: userProfile.name, email: userProfile.email } : null,
      signOut,
    }),
    [signedIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession deve ser usado dentro de SessionProvider');
  }
  return context;
}
