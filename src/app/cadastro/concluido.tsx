import { Redirect, type Href } from 'expo-router';

import { RegistrationSuccessView } from '@/components/auth/RegistrationSuccessView';
import { useAuth } from '@/context/AuthContext';

export default function CadastroConcluidoScreen() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href={'/splash' as Href} />;
  }

  return <RegistrationSuccessView />;
}
