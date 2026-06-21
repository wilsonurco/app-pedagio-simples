import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Configuração HTML global do web (PWA / modo app).
 * A barra do Safari só some quando o usuário abre via “Adicionar à Tela de Início”.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#5B2E8C" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pedágio Simples" />
        <meta name="application-name" content="Pedágio Simples" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                height: 100%;
                min-height: 100dvh;
              }
              body {
                margin: 0;
                overscroll-behavior: none;
                background-color: #F2F2F7;
                -webkit-tap-highlight-color: transparent;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
