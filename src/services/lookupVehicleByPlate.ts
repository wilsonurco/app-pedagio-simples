const MERCOSUL_PLATE_PATTERN = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
const OLD_PLATE_PATTERN = /^[A-Z]{3}[0-9]{4}$/;

export function normalizePlate(plate: string) {
  return plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function isCompletePlate(plate: string) {
  return normalizePlate(plate).length === 7;
}

export function isValidBrazilianPlate(plate: string) {
  const normalized = normalizePlate(plate);
  return MERCOSUL_PLATE_PATTERN.test(normalized) || OLD_PLATE_PATTERN.test(normalized);
}

export function getInvalidPlateMessage(plate: string) {
  const normalized = normalizePlate(plate);
  return `Formato inválido: "${normalized}". Use Mercosul (ABC1D23) ou antigo (ABC1234).`;
}
