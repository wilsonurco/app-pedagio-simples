import { ProfileDetailScreen } from '@/components/ProfileDetailScreen';

export default function NotificationsSettingsScreen() {
  return (
    <ProfileDetailScreen
      title="Notificações"
      description="Escolha o que você quer receber"
      icon="notifications-none"
      items={[
        'Pagamentos e cobranças',
        'Novas passagens',
        'Alertas de vencimento',
        'Promoções e novidades',
      ]}
    />
  );
}
