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
  paymentMethod?: string;
  lane?: string;
  gantry?: string;
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
  category: string;
};

export type VehicleCategory = {
  id: string;
  label: string;
};

export const vehicleCategories: VehicleCategory[] = [
  { id: '1', label: 'Categoria 1 - Carro' },
  { id: '2', label: 'Categoria 2 - Caminhonete' },
  { id: '3', label: 'Categoria 3 - Moto' },
  { id: '4', label: 'Categoria 4 - Ônibus' },
];

export type UserProfile = {
  name: string;
  email: string;
  vehicle: Vehicle;
};

export const history: HistoryPoint[] = [
  { label: 'Jan', value: 120 },
  { label: 'Fev', value: 90 },
  { label: 'Mar', value: 160 },
  { label: 'Abr', value: 75 },
  { label: 'Mai', value: 235 },
  { label: 'Jun', value: 140 },
];

export const initialPassages: Passage[] = [
  {
    id: 't1',
    passageId: 'PS-2026-008721',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'conventional',
    plaza: 'Praça 2 - Km 32',
    highway: 'Rod. dos Bandeirantes',
    concessionaire: 'EcoRodovias',
    km: 'Km 32',
    direction: 'Sentido Interior',
    lane: 'Faixa 3 — TAG',
    amount: 12.8,
    date: '18 jun, 14:22',
    dueDate: '21 jun, 23:59',
    status: 'pending',
  },
  {
    id: 't5',
    passageId: 'PS-2026-008654',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'free-flow',
    plaza: 'Free Flow — Km 112',
    highway: 'Rod. Castello Branco',
    concessionaire: 'CCR',
    km: 'Km 112',
    direction: 'Sentido Litoral',
    gantry: 'Pórtico FF-04',
    amount: 18.4,
    date: '17 jun, 09:45',
    dueDate: '20 jun, 23:59',
    status: 'pending',
  },
  {
    id: 't6',
    passageId: 'PS-2026-008501',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'conventional',
    plaza: 'Praça 7 - Km 54',
    highway: 'Rod. Anhanguera',
    concessionaire: 'Entrevias',
    km: 'Km 54',
    direction: 'Sentido São Paulo',
    lane: 'Faixa 2 — TAG',
    amount: 9.5,
    date: '16 jun, 07:18',
    dueDate: '19 jun, 23:59',
    status: 'pending',
  },
  {
    id: 't2',
    passageId: 'PS-2026-007912',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'conventional',
    plaza: 'Praça 5 - Km 88',
    highway: 'Rod. Anhanguera',
    concessionaire: 'Entrevias',
    km: 'Km 88',
    direction: 'Sentido Interior',
    lane: 'Faixa 1 — TAG',
    amount: 9.5,
    date: '10 jun, 08:10',
    status: 'paid',
    paidAt: '10 jun, 18:30',
    receiptId: 'CPV-2026-007912',
    paymentMethod: 'Pix',
  },
  {
    id: 't3',
    passageId: 'PS-2026-007801',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'free-flow',
    plaza: 'Free Flow — Km 78',
    highway: 'Rod. Castello Branco',
    concessionaire: 'CCR',
    km: 'Km 78',
    direction: 'Sentido Litoral',
    gantry: 'Pórtico FF-02',
    amount: 15.2,
    date: '8 jun, 19:47',
    status: 'paid',
    paidAt: '9 jun, 10:15',
    receiptId: 'CPV-2026-007801',
    paymentMethod: 'Cartão de crédito',
  },
  {
    id: 't4',
    passageId: 'PS-2026-007650',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'conventional',
    plaza: 'Praça 3 - Km 51',
    highway: 'Rod. Régis Bittencourt',
    concessionaire: 'Autopista Régis',
    km: 'Km 51',
    direction: 'Sentido Curitiba',
    lane: 'Faixa 4 — TAG',
    amount: 11.4,
    date: '5 jun, 06:33',
    status: 'paid',
    paidAt: '5 jun, 22:00',
    receiptId: 'CPV-2026-007650',
    paymentMethod: 'Pix',
  },
  {
    id: 't7',
    passageId: 'PS-2026-006210',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'conventional',
    plaza: 'Praça 1 - Km 14',
    highway: 'Rod. Castello Branco',
    concessionaire: 'CCR',
    km: 'Km 14',
    direction: 'Sentido Litoral',
    lane: 'Faixa 2 — TAG',
    amount: 14.6,
    date: '22 mai, 11:05',
    status: 'paid',
    paidAt: '22 mai, 20:10',
    receiptId: 'CPV-2026-006210',
    paymentMethod: 'Saldo em conta',
  },
  {
    id: 't8',
    passageId: 'PS-2026-006118',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'free-flow',
    plaza: 'Free Flow — Km 45',
    highway: 'Rod. dos Bandeirantes',
    concessionaire: 'EcoRodovias',
    km: 'Km 45',
    direction: 'Sentido Interior',
    gantry: 'Pórtico FF-01',
    amount: 16.9,
    date: '15 mai, 07:40',
    status: 'paid',
    paidAt: '15 mai, 19:00',
    receiptId: 'CPV-2026-006118',
    paymentMethod: 'Pix',
  },
  {
    id: 't9',
    passageId: 'PS-2026-005902',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'conventional',
    plaza: 'Praça 4 - Km 67',
    highway: 'Rod. Anhanguera',
    concessionaire: 'Entrevias',
    km: 'Km 67',
    direction: 'Sentido São Paulo',
    lane: 'Faixa 1 — TAG',
    amount: 10.2,
    date: '8 abr, 16:18',
    status: 'paid',
    paidAt: '8 abr, 21:45',
    receiptId: 'CPV-2026-005902',
    paymentMethod: 'Cartão de crédito',
  },
  {
    id: 't10',
    passageId: 'PS-2026-004811',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'conventional',
    plaza: 'Praça 2 - Km 32',
    highway: 'Rod. dos Bandeirantes',
    concessionaire: 'EcoRodovias',
    km: 'Km 32',
    direction: 'Sentido Capital',
    lane: 'Faixa 3 — TAG',
    amount: 12.8,
    date: '19 mar, 13:02',
    status: 'paid',
    paidAt: '19 mar, 22:30',
    receiptId: 'CPV-2026-004811',
    paymentMethod: 'Pix',
  },
  {
    id: 't11',
    passageId: 'PS-2026-003720',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'free-flow',
    plaza: 'Free Flow — Km 92',
    highway: 'Rod. Castello Branco',
    concessionaire: 'CCR',
    km: 'Km 92',
    direction: 'Sentido Interior',
    gantry: 'Pórtico FF-03',
    amount: 17.5,
    date: '4 fev, 09:15',
    status: 'paid',
    paidAt: '4 fev, 18:20',
    receiptId: 'CPV-2026-003720',
    paymentMethod: 'Saldo em conta',
  },
  {
    id: 't12',
    passageId: 'PS-2026-002615',
    plate: 'BRA2E19',
    vehicleModel: 'Honda Civic',
    type: 'conventional',
    plaza: 'Praça 6 - Km 101',
    highway: 'Rod. Régis Bittencourt',
    concessionaire: 'Autopista Régis',
    km: 'Km 101',
    direction: 'Sentido São Paulo',
    lane: 'Faixa 2 — TAG',
    amount: 13.1,
    date: '21 jan, 06:50',
    status: 'paid',
    paidAt: '21 jan, 20:05',
    receiptId: 'CPV-2026-002615',
    paymentMethod: 'Pix',
  },
];

/** Soma inicial das passagens pendentes (derivada dos dados). */
export const pendingAmount = initialPassages
  .filter((p) => p.status === 'pending')
  .reduce((sum, p) => sum + p.amount, 0);

export const transactions = initialPassages;

export const alerts: AlertItem[] = [
  {
    id: '1',
    title: 'Pagamento pendente',
    description: 'Você tem 3 passagens em aberto vencendo em breve.',
    type: 'warning',
    date: 'Hoje, 09:12',
  },
  {
    id: '2',
    title: 'Nova passagem registrada',
    description: 'Pedágio Rod. dos Bandeirantes • R$ 12,80.',
    type: 'info',
    date: '18 jun, 14:22',
    passageId: 't1',
  },
  {
    id: '3',
    title: 'Passagem Free Flow',
    description: 'Free Flow Rod. Castello Branco • R$ 18,40.',
    type: 'info',
    date: '17 jun, 09:45',
    passageId: 't5',
  },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'pix', label: 'Pix', detail: 'Aprovação imediata', icon: 'pix' },
  {
    id: 'card',
    label: 'Cartão de crédito',
    detail: 'Mastercard •••• 4821',
    icon: 'credit-card',
  },
  {
    id: 'balance',
    label: 'Saldo em conta',
    detail: 'Disponível: R$ 100,00',
    icon: 'account-balance',
  },
];

export const userProfile: UserProfile = {
  name: 'João Wilson',
  email: 'joao.wilson@email.com',
  vehicle: {
    plate: 'BRA2E19',
    model: 'Honda Civic',
    category: 'Categoria 1 - Carro',
  },
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
