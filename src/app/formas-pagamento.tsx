import { ProfileDetailScreen, type DetailListItem } from '@/components/ProfileDetailScreen';
import { usePaymentProfile } from '@/context/PaymentProfileContext';
import { formatCardSummary } from '@/utils/cardFormat';

export default function PaymentMethodsScreen() {
  const { savedCard } = usePaymentProfile();

  const items: DetailListItem[] = [
    {
      label: 'Pix — QR Code ou Copia e Cola',
    },
    {
      label: savedCard
        ? `Cartão de crédito — ${formatCardSummary(savedCard.brand, savedCard.last4)}`
        : 'Cartão de crédito — Cadastre seu cartão',
      route: '/cadastro-cartao',
    },
  ];

  return (
    <ProfileDetailScreen
      title="Formas de pagamento"
      description="Gerencie como você paga seus pedágios"
      icon="credit-card"
      items={items}
    />
  );
}
