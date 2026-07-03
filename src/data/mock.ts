/** Dados de exemplo para o app. Substituir por dados reais no futuro. */

export type HistoryPoint = {
  label: string;
  value: number;
};

export type AlertItem = {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'danger';
  date: string;
  passageId?: string;
};

export type PassageType = 'conventional' | 'free-flow';

export type Passage = {
  id: string;
  passageId: string;
  plate: string;
  vehicleModel: string;
  type: PassageType;
  plaza: string;
  highway: string;
  concessionaire: string;
  km: string;
  direction: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: 'paid' | 'pending';
  paidAt?: string;
  receiptId?: string;
  /** Registro de Passagem Veicular — emitido após quitação */
  rpvId?: string;
  paymentMethod?: string;
  lane?: string;
  gantry?: string;
  /** FiscalTech: transação disponível para reserva/pagamento */
  disponivel?: boolean;
  motivoIndisponivel?: string;
  vencida?: boolean;
  reservadoAte?: string;
  /** Protocolo de confirmação FiscalTech */
  fiscalProtocol?: string;
};

/** @deprecated Use Passage */
export type Transaction = Passage;

export type PaymentMethod = {
  id: string;
  label: string;
  detail: string;
  icon: 'pix' | 'credit-card' | 'account-balance';
};

export type Vehicle = {
  plate: string;
  model: string;
};

export const history: HistoryPoint[] = [
  { label: 'Jan', value: 120 },
  { label: 'Fev', value: 90 },
  { label: 'Mar', value: 160 },
  { label: 'Abr', value: 75 },
  { label: 'Mai', value: 235 },
  { label: 'Jun', value: 140 },
];

export const initialPassages: Passage[] = [];

/** Soma inicial das passagens pendentes (derivada dos dados). */
export const pendingAmount = initialPassages
  .filter((p) => p.status === 'pending')
  .reduce((sum, p) => sum + p.amount, 0);

export const transactions = initialPassages;

export const alerts: AlertItem[] = [
  {
    id: '1',
    title: 'Conta em dia',
    description: 'Nenhuma passagem pendente no momento.',
    type: 'info',
    date: '22/06/2026 09:12:00',
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'pix', label: 'Pix', detail: 'QR Code ou Copia e Cola', icon: 'pix' },
  {
    id: 'card',
    label: 'Cartão de crédito',
    detail: 'Mastercard •••• 4821',
    icon: 'credit-card',
  },
];

/** Chave Pix de recebimento do Pedágio Simples (simulada). */
export const merchantPix = {
  key: 'pagamentos@pedagiosimples.com.br',
  name: 'Pedágio Simples',
  city: 'SAO PAULO',
};

export type ProfileMenuItem = {
  id: string;
  label: string;
  icon: 'credit-card' | 'car' | 'bell' | 'help';
  route: `/formas-pagamento` | `/veiculos` | `/notificacoes` | `/ajuda`;
};

export const profileMenuItems: ProfileMenuItem[] = [
  { id: 'methods', label: 'Formas de pagamento', icon: 'credit-card', route: '/formas-pagamento' },
  { id: 'vehicles', label: 'Meus veículos', icon: 'car', route: '/veiculos' },
  { id: 'notifications', label: 'Notificações', icon: 'bell', route: '/notificacoes' },
  { id: 'help', label: 'Ajuda e suporte', icon: 'help', route: '/ajuda' },
];

export const passageTypeLabels: Record<PassageType, string> = {
  conventional: 'Praça convencional',
  'free-flow': 'Free Flow',
};

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function sumPassagesAmount(passages: Passage[]): number {
  return passages.reduce((sum, p) => sum + p.amount, 0);
}
