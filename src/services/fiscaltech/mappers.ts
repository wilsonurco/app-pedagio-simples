import type { Passage } from '@/data/mock';
import { formatAppDateTime } from '@/utils/dateTime';

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
  return 'free-flow';
}

export function mapTransacaoToPassage(
  placa: string,
  transacao: FiscalTechTransacao,
  vehicleModel = 'Veículo',
): Passage {
  const isPending = transacao.disponivel !== false;

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
    status: isPending ? 'pending' : 'pending',
    gantry: transacao.praca,
    disponivel: transacao.disponivel,
    motivoIndisponivel: transacao.motivoIndisponivel,
    vencida: transacao.vencida ?? undefined,
    reservadoAte: utcToAppDateTime(transacao.reservadoAte),
  };
}

export function mapDebitosToPassages(
  resultados: FiscalTechDebitoResultado[],
  vehicleModels: Record<string, string> = {},
): Passage[] {
  const passages: Passage[] = [];

  for (const resultado of resultados) {
    const model = vehicleModels[resultado.placa] ?? 'Veículo';
    for (const transacao of resultado.transacoes ?? []) {
      passages.push(mapTransacaoToPassage(resultado.placa, transacao, model));
    }
  }

  return passages.sort((a, b) => {
    const dateA = new Date(a.date.split(' ').reverse().join(' ')).getTime();
    const dateB = new Date(b.date.split(' ').reverse().join(' ')).getTime();
    return dateB - dateA;
  });
}

export function sumPassagesCents(passages: Passage[]): number {
  return Math.round(passages.reduce((sum, passage) => sum + passage.amount * 100, 0));
}

export function isPassagePayable(passage: Passage): boolean {
  return passage.status === 'pending' && passage.disponivel !== false;
}
