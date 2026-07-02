import { getBigDataCorpEnv } from './env';
import type { BigDataCorpResponse, CpfBasicData } from './types';

function birthDateToIso(value: string | undefined): string | null {
  if (!value) return null;

  const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (isoDateMatch) {
    return `${isoDateMatch[1]}-${isoDateMatch[2]}-${isoDateMatch[3]}`;
  }

  return null;
}

function extractBasicData(response: BigDataCorpResponse): CpfBasicData | null {
  const item = response.Result?.[0];
  const basic = item?.BasicData;
  if (!basic?.Name?.trim()) return null;

  const birthDate =
    birthDateToIso(basic.CapturedBirthDateFromRFSource) ??
    birthDateToIso(basic.BirthDate);

  if (!birthDate) return null;

  return {
    cpf: '',
    name: basic.Name.trim(),
    birthDate,
  };
}

export async function consultarCpfBasicData(cpf: string): Promise<CpfBasicData> {
  const env = getBigDataCorpEnv();

  console.info(`[bigdatacorp] POST /pessoas cpf=***${cpf.slice(-2)}`);

  const response = await fetch(`${env.baseUrl}/pessoas`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      AccessToken: env.accessToken,
      TokenId: env.tokenId,
    },
    body: JSON.stringify({
      Datasets: 'basic_data',
      q: `doc{${cpf}}`,
      Limit: 1,
    }),
  });

  const text = await response.text();
  let data: BigDataCorpResponse;

  try {
    data = text ? (JSON.parse(text) as BigDataCorpResponse) : {};
  } catch {
    throw new Error('Resposta inválida da BigDataCorp');
  }

  if (!response.ok) {
    const statusMessage =
      data.Status &&
      Object.values(data.Status)
        .flat()
        .map((entry) => entry.Message)
        .filter(Boolean)
        .join('; ');

    throw new Error(statusMessage || `BigDataCorp retornou HTTP ${response.status}`);
  }

  const basicData = extractBasicData(data);
  if (!basicData) {
    throw new Error('CPF não encontrado ou sem dados cadastrais disponíveis.');
  }

  return {
    ...basicData,
    cpf,
  };
}
