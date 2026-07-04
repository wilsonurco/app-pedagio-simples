import { useState } from 'react';
import { View } from 'react-native';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ProfileDetailScreen } from '@/components/ProfileDetailScreen';
import { useVehicles } from '@/context/VehiclesContext';
import { vehicleListLabel } from '@/utils/vehicleLabel';
import { type Vehicle } from '@/data/mock';

export default function VehiclesScreen() {
  const { vehicles, removeVehicle } = useVehicles();
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  async function handleConfirmDelete() {
    if (!vehicleToDelete) return;
    await removeVehicle(vehicleToDelete.plate);
    setVehicleToDelete(null);
  }

  return (
    <View style={{ flex: 1 }}>
      <ProfileDetailScreen
        title="Meus veículos"
        description="Veículos cadastrados na sua conta"
        icon="car"
        items={[
          ...vehicles.map((vehicle) => ({
            label: vehicleListLabel(vehicle),
            showVehicleAvatar: true,
            route: {
              pathname: '/veiculo/[plate]',
              params: { plate: vehicle.plate },
            },
            onDelete: () => setVehicleToDelete(vehicle),
          })),
          { label: 'Adicionar novo veículo', route: '/cadastro-veiculo' },
        ]}
      />

      <ConfirmDialog
        visible={vehicleToDelete !== null}
        title="Excluir veículo"
        message={
          vehicleToDelete
            ? `Deseja remover ${vehicleListLabel(vehicleToDelete)} da sua conta?`
            : ''
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setVehicleToDelete(null)}
      />
    </View>
  );
}
