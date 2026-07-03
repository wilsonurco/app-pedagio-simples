import { useEffect } from 'react';
import { Platform } from 'react-native';

function isIosPwaStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    nav.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

function getLockedHeight(): number {
  // No PWA iOS, visualViewport.height fica menor que a tela e deixa faixa cinza abaixo do app.
  if (isIosPwaStandalone()) {
    return window.innerHeight;
  }
  return window.visualViewport?.height ?? window.innerHeight;
}

/**
 * Trava html/body/#root na altura real da viewport no web.
 * No PWA standalone do iOS, visualViewport menor que innerHeight deixa faixa cinza
 * (#F2F2F7 do body) abaixo do footer.
 */
export function useWebViewportLock() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const html = document.documentElement;
    const { body } = document;

    const apply = () => {
      const height = getLockedHeight();
      const px = `${height}px`;

      html.style.setProperty('--app-height', px);
      html.style.height = px;
      html.style.minHeight = px;
      html.style.maxHeight = px;
      html.style.overflow = 'hidden';

      body.style.height = px;
      body.style.minHeight = px;
      body.style.maxHeight = px;
      body.style.overflow = 'hidden';
      body.style.margin = '0';

      const root = document.getElementById('root');
      if (root) {
        root.style.height = px;
        root.style.minHeight = px;
        root.style.maxHeight = px;
        root.style.overflow = 'hidden';
        root.style.display = 'flex';
        root.style.flexDirection = 'column';
      }
    };

    apply();
    window.visualViewport?.addEventListener('resize', apply);
    window.visualViewport?.addEventListener('scroll', apply);
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);

    return () => {
      window.visualViewport?.removeEventListener('resize', apply);
      window.visualViewport?.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);

      for (const el of [html, body, document.getElementById('root')]) {
        if (!el) continue;
        el.style.removeProperty('height');
        el.style.removeProperty('min-height');
        el.style.removeProperty('max-height');
        el.style.removeProperty('overflow');
        el.style.removeProperty('display');
        el.style.removeProperty('flex-direction');
      }
      html.style.removeProperty('--app-height');
    };
  }, []);
}
