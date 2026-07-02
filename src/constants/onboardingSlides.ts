export type OnboardingSlide = {
  id: string;
  image: number;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'consulta',
    image: require('@/assets/images/onboarding/onboarding-1-highway-gantry.png'),
    eyebrow: 'Passo 01',
    title: 'Consulte pelo número da',
    highlight: 'placa',
    description:
      'Informe a placa do veículo e veja quantas passagens de pedágio estão pendentes — sem ir à praça.',
  },
  {
    id: 'debitos',
    image: require('@/assets/images/onboarding/onboarding-2-plate-check.png'),
    eyebrow: 'Passo 02',
    title: 'Confira seus débitos de',
    highlight: 'pedágio',
    description:
      'Após criar sua conta, visualize cada passagem com data, pórtico e valor. Selecione o que deseja quitar.',
  },
  {
    id: 'pagamento',
    image: require('@/assets/images/onboarding/onboarding-3-open-road.png'),
    eyebrow: 'Passo 03',
    title: 'Pague e evite a multa de',
    highlight: 'evasão',
    description:
      'PIX com confirmação instantânea ou cartão de crédito. Com o pagamento confirmado, você segue livre na rodovia.',
  },
];
