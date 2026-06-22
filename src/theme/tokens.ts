/**
 * Design tokens Apple HIG para o Pedágio Simples.
 * Tint de marca: #5B2E8C (roxo).
 */

export const tint = '#5B2E8C';
export const tintPressed = '#4A2574';

export const colors = {
  tint,
  tintPressed,
  onTint: '#FFFFFF',

  // Labels (light mode)
  label: '#000000',
  secondaryLabel: '#3C3C43',
  tertiaryLabel: '#8E8E93',
  quaternaryLabel: '#C7C7CC',

  // Superfícies
  background: '#F2F2F7',
  secondaryBackground: '#FFFFFF',
  tertiaryBackground: '#F2F2F7',
  groupedBackground: '#F2F2F7',

  // Separadores e fills
  separator: '#C6C6C8',
  opaqueSeparator: '#C6C6C8',
  fill: 'rgba(120, 120, 128, 0.2)',

  // Estados semânticos
  systemGreen: '#34C759',
  systemOrange: '#FF9500',
  systemRed: '#FF3B30',
  systemBlue: '#007AFF',

  // Gráfico
  barActive: tint,
  barInactive: 'rgba(120, 120, 128, 0.16)',

  // Dashboard
  promoBackground: '#2A1F4E',
  promoAccent: '#7C5CBF',
  badgePurpleBg: 'rgba(91, 46, 140, 0.12)',
  badgeOrangeBg: 'rgba(255, 149, 0, 0.12)',
  badgeGreenBg: 'rgba(52, 199, 89, 0.12)',
  cardSelectedBorder: tint,
  cardSelectedBg: 'rgba(91, 46, 140, 0.04)',
  totalBarBackground: '#3D2066',
  payButtonBright: '#7C3AED',

  // Aliases legados (compatibilidade com componentes existentes)
  primary: tint,
  primaryPressed: tintPressed,
  onPrimary: '#FFFFFF',
  ink: '#000000',
  textSecondary: '#3C3C43',
  textMuted: '#8E8E93',
  surface: '#FFFFFF',
  border: '#C6C6C8',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Raios Apple: cantos contínuos, cards agrupados ~10pt */
export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

/** Escala tipográfica iOS (Dynamic Type base) */
export const fontSize = {
  caption2: 11,
  caption: 12,
  footnote: 13,
  subheadline: 15,
  callout: 16,
  body: 17,
  headline: 17,
  title3: 20,
  title2: 22,
  title1: 28,
  largeTitle: 34,
  // aliases
  small: 15,
  subtitle: 20,
  title: 22,
  display: 34,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
} as const;
