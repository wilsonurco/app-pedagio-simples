export type DataSource = 'mock' | 'fiscaltech';

export function getDataSource(): DataSource {
  const value = process.env.EXPO_PUBLIC_DATA_SOURCE;
  return value === 'fiscaltech' ? 'fiscaltech' : 'mock';
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
  return '';
}
