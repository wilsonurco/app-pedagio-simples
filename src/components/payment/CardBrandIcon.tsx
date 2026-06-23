import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';

import { type CardBrand } from '@/utils/cardFormat';

type CardBrandIconProps = {
  brand: CardBrand;
  size?: number;
  faded?: boolean;
};

export const CARD_BRANDS_DISPLAY: CardBrand[] = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard'];

export function CardBrandIcon({ brand, size = 28, faded = false }: CardBrandIconProps) {
  const opacity = faded ? 0.28 : 1;

  return (
    <Svg width={size} height={size * 0.64} viewBox="0 0 44 28" opacity={opacity}>
      {brand === 'Visa' && <VisaMark />}
      {brand === 'Mastercard' && <MastercardMark />}
      {brand === 'Elo' && <EloMark />}
      {brand === 'Amex' && <AmexMark />}
      {brand === 'Hipercard' && <HipercardMark />}
      {brand === 'Outro' && <GenericMark />}
    </Svg>
  );
}

function VisaMark() {
  return (
    <>
      <Rect x={0} y={0} width={44} height={28} rx={4} fill="#1A1F71" />
      <SvgText
        x={22}
        y={19}
        fill="#FFFFFF"
        fontSize={11}
        fontWeight="700"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        VISA
      </SvgText>
    </>
  );
}

function MastercardMark() {
  return (
    <>
      <Rect x={0} y={0} width={44} height={28} rx={4} fill="#FFFFFF" />
      <Circle cx={18} cy={14} r={8} fill="#EB001B" />
      <Circle cx={26} cy={14} r={8} fill="#F79E1B" fillOpacity={0.92} />
    </>
  );
}

function EloMark() {
  return (
    <>
      <Rect x={0} y={0} width={44} height={28} rx={4} fill="#000000" />
      <Circle cx={14} cy={14} r={6} fill="#FFCB05" />
      <Circle cx={22} cy={14} r={6} fill="#00A4E0" />
      <Circle cx={30} cy={14} r={6} fill="#EF4123" />
    </>
  );
}

function AmexMark() {
  return (
    <>
      <Rect x={0} y={0} width={44} height={28} rx={4} fill="#2E77BC" />
      <SvgText
        x={22}
        y={18}
        fill="#FFFFFF"
        fontSize={8}
        fontWeight="700"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        AMEX
      </SvgText>
    </>
  );
}

function HipercardMark() {
  return (
    <>
      <Rect x={0} y={0} width={44} height={28} rx={4} fill="#822124" />
      <SvgText
        x={22}
        y={17}
        fill="#FFFFFF"
        fontSize={6.5}
        fontWeight="700"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
      >
        HIPER
      </SvgText>
    </>
  );
}

function GenericMark() {
  return (
    <>
      <Rect x={0} y={0} width={44} height={28} rx={4} fill="#E5E5EA" />
      <Rect x={8} y={8} width={28} height={12} rx={2} fill="#C7C7CC" />
    </>
  );
}
