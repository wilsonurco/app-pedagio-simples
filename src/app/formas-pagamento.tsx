import { ProfileDetailScreen } from '@/components/ProfileDetailScreen';
import { paymentMethods } from '@/data/mock';

export default function PaymentMethodsScreen() {
  return (
    <ProfileDetailScreen
      title="Formas de pagamento"
      description="Gerencie como você paga seus pedágios"
      icon="credit-card"
      items={paymentMethods.map((m) => `${m.label} — ${m.detail}`)}
    />
  );
}
