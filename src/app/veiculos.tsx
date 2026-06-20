import { ProfileDetailScreen } from '@/components/ProfileDetailScreen';
import { userProfile } from '@/data/mock';

export default function VehiclesScreen() {
  const { vehicle } = userProfile;

  return (
    <ProfileDetailScreen
      title="Meus veículos"
      description="Veículos cadastrados na sua conta"
      icon="car"
      items={[
        `${vehicle.model} • ${vehicle.plate}`,
        vehicle.category,
        { label: 'Adicionar novo veículo', route: '/cadastro-veiculo' },
      ]}
    />
  );
}
