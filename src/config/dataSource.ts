export type DataSource = 'mock' | 'fiscaltech';

export function getDataSource(): DataSource {
  return process.env.EXPO_PUBLIC_DATA_SOURCE === 'mock' ? 'mock' : 'fiscaltech';
}

export function isFiscalTechEnabled(): boolean {
  return getDataSource() === 'fiscaltech';
}

export function getBffBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_BFF_URL?.replace(/\/$/, '');
  if (configured) return configured;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://app-pedagio-simples.vercel.app';
}
