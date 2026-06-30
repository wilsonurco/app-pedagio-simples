# Deploy e variáveis — Vercel

## Variáveis obrigatórias (server-side)

| Variável | Exemplo homolog |
|----------|-----------------|
| `FISCALTECH_BASE_URL` | `http://central-pagamentos.fiscaltech.ind.br/api/v1/central-pagamentos` |
| `FISCALTECH_PORTAL_ID` | `movemais_pedagio_simples` |
| `FISCALTECH_API_KEY` | *(fornecida pela concessionária)* |
| `FISCALTECH_SECRET` | *(fornecida pela concessionária)* |

## Variáveis do app (client-side)

| Variável | Valor homolog | Valor demo local |
|----------|---------------|------------------|
| `EXPO_PUBLIC_DATA_SOURCE` | `fiscaltech` | `mock` |
| `EXPO_PUBLIC_BFF_URL` | `https://app-pedagio-simples.vercel.app` | vazio (usa `window.location.origin` no web) |

## Ativar homologação no Vercel

1. Copie `.env.example` → `.env.local` e preencha `FISCALTECH_API_KEY` e `FISCALTECH_SECRET`
2. Sincronize para **Production** e **Development**:
   ```bash
   npm run vercel:sync-homolog
   ```
3. **Redeploy obrigatório** — `EXPO_PUBLIC_*` entra no build do Expo:
   ```bash
   npx vercel --prod
   ```
   Ou faça push da branch com o código da integração FiscalTech.
4. Valide em https://app-pedagio-simples.vercel.app
5. Execute o checklist em [`homologacao-fiscaltech.md`](./homologacao-fiscaltech.md)

### Preview (opcional)

Para deploys de preview por branch, adicione as mesmas variáveis manualmente em **Settings → Environment Variables → Preview** no dashboard Vercel.

## Teste local do BFF

```bash
cp .env.example .env.local
# preencher credenciais
npx vercel dev
```

Smoke test direto na API FiscalTech:

```bash
npm run homolog:smoke -- PLACA_TESTE
```
