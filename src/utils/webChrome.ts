import { useEffect } from 'react';
import { Platform } from 'react-native';
import { usePathname } from 'expo-router';

const DARK_BG = '#000000';
const LIGHT_BG = '#F2F2F7';

/** Rotas com visual escuro edge-to-edge (imagem full screen). */
const DARK_ROUTES = new Set(['/onboarding']);

/**
 * Controla, no web (PWA iOS), o fundo do documento e o theme-color por rota.
 * A partir do iOS 26 a status bar deriva a cor do background do html/body,
 * então manter esses valores corretos evita tarja cinza/preta no topo.
 */
export function useWebChrome() {
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const bg = DARK_ROUTES.has(pathname) ? DARK_BG : LIGHT_BG;

    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);

    const html = document.documentElement;
    const { body } = document;
    const root = document.getElementById('root');

    html.style.backgroundColor = bg;
    body.style.backgroundColor = bg;
    if (root) root.style.backgroundColor = bg;

    // Altura/overflow são controlados por useWebViewportLock — não resetar aqui.
    for (const el of [html, body, root]) {
      if (!el) continue;
      el.style.removeProperty('margin');
      el.style.removeProperty('padding');
    }
  }, [pathname]);
}
