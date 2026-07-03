/**
 * Fase de testes: exibe o onboarding em todo acesso ao app.
 * Defina como false antes de liberar apenas no 1º acesso.
 */
export const FORCE_ONBOARDING_EVERY_SESSION = false;

export function shouldShowOnboarding(hasCompleted: boolean): boolean {
  if (FORCE_ONBOARDING_EVERY_SESSION) return true;
  return !hasCompleted;
}
