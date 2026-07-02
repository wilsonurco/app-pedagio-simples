import type { VercelRequest, VercelResponse } from '@vercel/node';

import { consultarCpfBasicData } from '../_lib/bigdatacorp/client';
import { isValidCpf, normalizeCpf } from '../_lib/auth/validation';
import { handleOptions, internalError, methodNotAllowed, sendJson } from '../_lib/http';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    methodNotAllowed(req, res, ['POST']);
    return;
  }

  try {
    const body = req.body as { cpf?: unknown };
    const cpf = normalizeCpf(String(body?.cpf ?? ''));

    if (!isValidCpf(cpf)) {
      sendJson(req, res, 422, {
        erro: 'CPF_INVALIDO',
        mensagem: 'Informe um CPF válido.',
      });
      return;
    }

    const result = await consultarCpfBasicData(cpf);

    sendJson(req, res, 200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao consultar CPF.';

    if (message.includes('Variáveis de ambiente ausentes')) {
      sendJson(req, res, 503, {
        erro: 'SERVICO_INDISPONIVEL',
        mensagem: 'Consulta de CPF temporariamente indisponível.',
      });
      return;
    }

    if (message.includes('não encontrado') || message.includes('sem dados')) {
      sendJson(req, res, 404, {
        erro: 'CPF_NAO_ENCONTRADO',
        mensagem: message,
      });
      return;
    }

    internalError(req, res, error);
  }
}
