export type CardBrand = 'Visa' | 'Mastercard' | 'Elo' | 'Amex' | 'Hipercard' | 'Outro';

/** Bandeiras exibidas como referência no cadastro (padrão Mobbin/fintech). */
export const SUPPORTED_CARD_BRANDS: CardBrand[] = [
  'Visa',
  'Mastercard',
  'Elo',
  'Amex',
  'Hipercard',
];

const ELO_BINS =
  /^(4011(78|79)|431274|438935|451416|457393|457631|457632|504175|506(699|7)|509|627780|636(297|368)|65003[0-9]|65004[0-9]|65165[2-4]|65500[0-1])/;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCardNumber(value: string, brand?: CardBrand): string {
  const digits = digitsOnly(value);
  const resolvedBrand = brand ?? detectCardBrand(digits);

  if (resolvedBrand === 'Amex') {
    const limited = digits.slice(0, 15);
    const parts = [limited.slice(0, 4), limited.slice(4, 10), limited.slice(10, 15)].filter(Boolean);
    return parts.join(' ');
  }

  return digits
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
}

export function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function detectCardBrand(number: string): CardBrand {
  const digits = digitsOnly(number);
  if (!digits) return 'Outro';

  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^(606282|637095|637568|637599|637609|637612)/.test(digits)) return 'Hipercard';
  if (ELO_BINS.test(digits)) return 'Elo';
  if (/^4/.test(digits)) return 'Visa';
  if (/^(5[1-5]|2(?:2[1-9]|[3-6]|7[01]|20))/.test(digits)) return 'Mastercard';

  return 'Outro';
}

export function isValidCardNumber(number: string): boolean {
  const digits = digitsOnly(number);
  const brand = detectCardBrand(number);

  if (brand === 'Amex') {
    return digits.length === 15;
  }

  // Demo: valida comprimento e bandeira; Luhn exigiria número de teste específico.
  return digits.length >= 13 && digits.length <= 16 && brand !== 'Outro';
}

export function isValidExpiry(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const year = Number(`20${match[2]}`);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiryDate = new Date(year, month, 0, 23, 59, 59);
  return expiryDate >= now;
}

export function isValidCvv(cvv: string, brand?: CardBrand): boolean {
  const length = brand === 'Amex' ? 4 : 3;
  return new RegExp(`^\\d{${length}}$`).test(cvv);
}

export function formatCardSummary(brand: CardBrand, last4: string): string {
  return `${brand} •••• ${last4}`;
}

export function getCvvMaxLength(brand: CardBrand): number {
  return brand === 'Amex' ? 4 : 3;
}
