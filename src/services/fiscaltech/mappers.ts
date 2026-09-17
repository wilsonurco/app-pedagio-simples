import type { Passage } from '@/data/mock';
import { compareAppDateTime, formatAppDateTime } from '@/utils/dateTime';

import type { FiscalTechDebitoResultado, FiscalTechTransacao } from './types';

function centsToReais(value: number): number {
  return value / 100;
}

function utcToAppDateTime(value?: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return formatAppDateTime(date);
}

function inferPassageType(praca?: string): Passage['type'] {
  const normalized = (praca ?? '').toLowerCase();
  if (normalized.includes('free flow') || normalized.includes('freeflow') || normalized.includes('pórtico')) {
    return 'free-flow';
  }
  return 'conventional';
}

export function mapTransacaoToPassage(
  placa: string,
  transacao: FiscalTechTransacao,
  vehicleModel = 'Veículo',
): Passage {
  return {
    id: transacao.transacaoId,
    passageId: transacao.transacaoId,
    plate: placa,
    vehicleModel,
    type: inferPassageType(transacao.praca),
    plaza: transacao.praca ?? 'Praça não informada',
    highway: transacao.pracaId ?? transacao.praca ?? '—',
    concessionaire: 'Concessionária parceira',
    km: transacao.pracaId ?? '—',
    direction: transacao.sentido ?? '—',
    amount: centsToReais(transacao.valor),
    date: utcToAppDateTime(transacao.dataPassagem) ?? transacao.dataPassagem,
    dueDate: utcToAppDateTime(transacao.dataVencimento),
    status: 'pending',
    gantry: transacao.praca,
    disponivel: transacao.disponivel,
    motivoIndisponivel: transacao.motivoIndisponivel,
    vencida: transacao.vencida ?? undefined,
  };
}

export function mapDebitosToPassages(
  resultados: FiscalTechDebitoResultado[],
  vehicleModels: Record<string, string> = {},
): Passage[] {
  const passages: Passage[] = [];

  for (const resultado of resultados) {
    const raw = vehicleModels[resultado.placa]?.trim() ?? '';
    const model = raw.length >= 2 ? raw : resultado.placa;
    for (const transacao of resultado.transacoes ?? []) {
      passages.push(mapTransacaoToPassage(resultado.placa, transacao, model));
    }
  }

  return passages.sort((a, b) => compareAppDateTime(b.date, a.date));
}
