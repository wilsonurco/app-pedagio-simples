import type { ComponentType } from 'react';
import type { LucideProps } from 'lucide-react-native';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Calendar,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheck,
  CircleHelp,
  CreditCard,
  Download,
  History,
  Home,
  Info,
  LogOut,
  MapPin,
  Plus,
  QrCode,
  ScanLine,
  Share2,
  Shield,
  Signpost,
  Trash2,
  User,
  Wallet,
  Wifi,
  X,
} from 'lucide-react-native';

/** Traço fino alinhado ao visual minimalista do app. */
export const iconStroke = 1.75 as const;
export const iconStrokeActive = 2.25 as const;

export const iconSize = {
  sm: 20,
  md: 24,
  lg: 28,
  xl: 44,
} as const;

export type IconComponent = ComponentType<LucideProps>;

export const profileMenuIcons = {
  'credit-card': CreditCard,
  car: Car,
  bell: Bell,
  help: CircleHelp,
} as const;

export type ProfileMenuIconName = keyof typeof profileMenuIcons;

export const detailScreenIcons = {
  'credit-card': CreditCard,
  car: Car,
  bell: Bell,
  help: CircleHelp,
} as const;

export type DetailScreenIconName = keyof typeof detailScreenIcons;

export const alertIcons = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
} as const;

export const paymentMethodIcons = {
  pix: QrCode,
  'credit-card': CreditCard,
  'account-balance': Wallet,
} as const;

export type PaymentMethodIconName = keyof typeof paymentMethodIcons;

export const tabIcons = {
  home: Home,
  history: History,
  alerts: Bell,
  profile: User,
} as const;

type AppIconProps = LucideProps & {
  icon: IconComponent;
};

export function AppIcon({
  icon: Icon,
  size = iconSize.md,
  color,
  strokeWidth = iconStroke,
  ...props
}: AppIconProps) {
  return <Icon size={size} color={color} strokeWidth={strokeWidth} {...props} />;
}

export {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Calendar,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheck,
  CircleHelp,
  CreditCard,
  Download,
  History,
  Home,
  Info,
  LogOut,
  MapPin,
  Plus,
  QrCode,
  ScanLine,
  Share2,
  Shield,
  Signpost,
  Trash2,
  User,
  Wallet,
  Wifi,
  X,
};
