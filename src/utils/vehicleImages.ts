import type { ImageSourcePropType } from 'react-native';

const hondaCivicImage = require('@/assets/images/honda-civic-profile.png');

const VEHICLE_IMAGES: Record<string, ImageSourcePropType> = {
  'Honda Civic': hondaCivicImage,
};

export function getVehicleImageSource(model: string): ImageSourcePropType | null {
  return VEHICLE_IMAGES[model] ?? null;
}
