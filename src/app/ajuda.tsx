import { ProfileDetailScreen } from '@/components/ProfileDetailScreen';

export default function HelpScreen() {
  return (
    <ProfileDetailScreen
      title="Ajuda e suporte"
      description="Tire dúvidas e fale com a gente"
      icon="help-outline"
      items={[
        'Perguntas frequentes',
        'Falar com suporte',
        'Termos de uso',
        'Política de privacidade',
      ]}
    />
  );
}
