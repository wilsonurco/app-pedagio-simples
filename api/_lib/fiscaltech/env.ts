export type FiscalTechEnv = {
  baseUrl: string;
  portalId: string;
  apiKey: string;
  secret: string;
};

export function getFiscalTechEnv(): FiscalTechEnv {
  const baseUrl = process.env.FISCALTECH_BASE_URL?.replace(/\/$/, '');
  const portalId = process.env.FISCALTECH_PORTAL_ID;
  const apiKey = process.env.FISCALTECH_API_KEY;
  const secret = process.env.FISCALTECH_SECRET;

  const missing = [
    !baseUrl && 'FISCALTECH_BASE_URL',
    !portalId && 'FISCALTECH_PORTAL_ID',
    !apiKey && 'FISCALTECH_API_KEY',
    !secret && 'FISCALTECH_SECRET',
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }

  return {
    baseUrl: baseUrl!,
    portalId: portalId!,
    apiKey: apiKey!,
    secret: secret!,
  };
}
