/** Exibe o ID da passagem como 10 dígitos numéricos (ex.: 2026008654). */
export function formatPassageIdNumeric(passageId: string): string {
  const digits = passageId.replace(/\D/g, '');

  if (digits.length >= 10) {
    return digits.slice(-10);
  }

  return digits.padStart(10, '0');
}
