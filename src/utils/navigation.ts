import { router, type Href } from 'expo-router';

type NavigateBackOptions = {
  fallback?: Href;
  params?: Record<string, string | undefined>;
};

/** Volta com segurança; usa fallback quando não há tela anterior na pilha. */
export function navigateBack({ fallback = '/', params }: NavigateBackOptions = {}) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  if (params) {
    router.replace({ pathname: fallback as string, params } as never);
    return;
  }

  router.replace(fallback);
}

/** Encerra fluxos modais e retorna à home. */
export function navigateHome() {
  if (router.canDismiss()) {
    router.dismissAll();
    return;
  }

  router.replace('/');
}
