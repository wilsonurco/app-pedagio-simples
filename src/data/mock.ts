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
};

export type Transaction = {
  id: string;
  plaza: string;
  highway: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending';
};

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

export const pendingAmount = 235.0;

export const history: HistoryPoint[] = [
  { label: 'Jan', value: 120 },
  { label: 'Fev', value: 90 },
  { label: 'Mar', value: 160 },
  { label: 'Abr', value: 75 },
  { label: 'Mai', value: 235 },
  { label: 'Jun', value: 140 },
];

export const transactions: Transaction[] = [
  {
    id: 't1',
    plaza: 'Praça 2 - Km 32',
    highway: 'Rod. dos Bandeirantes',
    amount: 12.8,
    date: '18 jun, 14:22',
    status: 'pending',
  },
  {
    id: 't2',
    plaza: 'Praça 5 - Km 88',
    highway: 'Rod. Anhanguera',
    amount: 9.5,
    date: '17 jun, 08:10',
    status: 'paid',
  },
  {
    id: 't3',
    plaza: 'Praça 1 - Km 14',
    highway: 'Rod. Castello Branco',
    amount: 15.2,
    date: '15 jun, 19:47',
    status: 'paid',
  },
  {
    id: 't4',
    plaza: 'Praça 3 - Km 51',
    highway: 'Rod. Régis Bittencourt',
    amount: 11.4,
    date: '12 jun, 06:33',
    status: 'paid',
  },
];

export const alerts: AlertItem[] = [
  {
    id: '1',
    title: 'Pagamento pendente',
    description: 'Você tem 1 cobrança em aberto vencendo em 3 dias.',
    type: 'warning',
    date: 'Hoje, 09:12',
  },
  {
    id: '2',
    title: 'Nova passagem registrada',
    description: 'Pedágio Rod. dos Bandeirantes • R$ 12,80.',
    type: 'info',
    date: '18 jun, 14:22',
  },
  {
    id: '3',
    title: 'Saldo recarregado',
    description: 'Recarga de R$ 100,00 confirmada na sua conta.',
    type: 'info',
    date: '14 jun, 11:05',
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
  icon: 'credit-card' | 'directions-car' | 'notifications-none' | 'help-outline';
  route: `/formas-pagamento` | `/veiculos` | `/notificacoes` | `/ajuda`;
};

/** Sequência dos itens do menu Perfil (conforme layout do print). */
export const profileMenuItems: ProfileMenuItem[] = [
  { id: 'methods', label: 'Formas de pagamento', icon: 'credit-card', route: '/formas-pagamento' },
  { id: 'vehicles', label: 'Meus veículos', icon: 'directions-car', route: '/veiculos' },
  { id: 'notifications', label: 'Notificações', icon: 'notifications-none', route: '/notificacoes' },
  { id: 'help', label: 'Ajuda e suporte', icon: 'help-outline', route: '/ajuda' },
];

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
