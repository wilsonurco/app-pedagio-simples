export type BigDataCorpEnv = {
  baseUrl: string;
  accessToken: string;
  tokenId: string;
};

export function getBigDataCorpEnv(): BigDataCorpEnv {
  const baseUrl =
    process.env.BIGDATACORP_BASE_URL?.replace(/\/$/, '') ??
    'https://plataforma.bigdatacorp.com.br';
  const accessToken = process.env.BIGDATACORP_ACCESS_TOKEN;
  const tokenId = process.env.BIGDATACORP_TOKEN_ID;

  const missing = [
    !accessToken && 'BIGDATACORP_ACCESS_TOKEN',
    !tokenId && 'BIGDATACORP_TOKEN_ID',
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }

  return {
    baseUrl,
    accessToken: accessToken!,
    tokenId: tokenId!,
  };
}
