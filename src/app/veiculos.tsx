import { useState } from 'react';
import { View } from 'react-native';

import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ProfileDetailScreen } from '@/components/ProfileDetailScreen';
import { useVehicles } from '@/context/VehiclesContext';
import { type Vehicle } from '@/data/mock';

export default function VehiclesScreen() {
  const { vehicles, removeVehicle } = useVehicles();
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  function handleConfirmDelete() {
    if (!vehicleToDelete) return;
    removeVehicle(vehicleToDelete.plate);
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
            label: `${vehicle.model} • ${vehicle.plate}`,
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
            ? `Deseja remover ${vehicleToDelete.model} • ${vehicleToDelete.plate} da sua conta?`
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
