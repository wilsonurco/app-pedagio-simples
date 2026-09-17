import { ProfileDetailScreen } from '@/components/ProfileDetailScreen';
import { useVehicles } from '@/context/VehiclesContext';

export default function VehiclesScreen() {
  const { vehicles } = useVehicles();

  return (
    <ProfileDetailScreen
      title="Meus veículos"
      description="Veículos cadastrados na sua conta"
      icon="car"
      items={[
        ...vehicles.map((vehicle) => `${vehicle.model} • ${vehicle.plate}`),
        { label: 'Adicionar novo veículo', route: '/cadastro-veiculo' },
      ]}
    />
  );
}
