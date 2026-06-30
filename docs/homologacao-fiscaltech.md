# Homologação — API FiscalTech (Pedágio Simples)

Checklist para validar a integração com a Central de Pagamentos Free Flow v1.1.0.

Documentação oficial: https://api-docs.fiscaltech.com.br/central-pagamentos-freeflow-V1_1_0.html

## Pré-requisitos

1. Variáveis configuradas no Vercel (ou `.env.local` para testes locais):

```bash
FISCALTECH_BASE_URL=http://central-pagamentos.fiscaltech.ind.br/api/v1/central-pagamentos
FISCALTECH_PORTAL_ID=movemais_pedagio_simples
FISCALTECH_API_KEY=...
FISCALTECH_SECRET=...
EXPO_PUBLIC_DATA_SOURCE=fiscaltech
EXPO_PUBLIC_BFF_URL=https://seu-preview.vercel.app
```

2. Placas de teste fornecidas pela concessionária/FiscalTech no ambiente de homologação.

3. Smoke test do BFF:

```bash
npm run homolog:smoke -- PLACA_TESTE
```

## Fase A — BFF isolado

| # | Cenário | Comando / ação | Resultado esperado |
|---|---------|----------------|-------------------|
| A1 | Assinatura HMAC inválida | Alterar `FISCALTECH_SECRET` temporariamente | 401/403 |
| A2 | Consulta débitos válida | `npm run homolog:smoke -- PLACA` | 200 + `resultados` |
| A3 | Placa sem débito | Smoke com placa inexistente | 200 + lista vazia |
| A4 | Placa inválida | Smoke inclui `abc-1d23` | 400 `REQUISICAO_INVALIDA` |

## Fase B — Fluxo feliz

| # | Cenário | Resultado esperado |
|---|---------|-------------------|
| B1 | App lista débitos reais por placa cadastrada | Passagens aparecem no dashboard |
| B2 | Selecionar transações `disponivel=true` | Seleção habilitada |
| B3 | Iniciar pagamento Pix/cartão | Reserva criada + countdown visível |
| B4 | Confirmar pagamento simulado | Status `CONFIRMADA` + `protocolo` |
| B5 | Reconsultar débitos | Transações pagas não retornam como pendentes |

## Fase C — Falhas operacionais

| # | Cenário | Resultado esperado |
|---|---------|-------------------|
| C1 | Cancelar reserva antes de confirmar | Status `CANCELADA` |
| C2 | Confirmar reserva expirada | 422 `RESERVA_EXPIRADA` + mensagem amigável |
| C3 | Transação reservada por outro portal | 409 + opção de atualizar débitos |
| C4 | Valor alterado após consulta | `VALOR_ALTERADO` + refresh |
| C5 | Retry de confirmação (mesmo idempotency key) | Resposta idempotente |
| C6 | Transação `disponivel=false` | Exibida como indisponível, não selecionável |

## Fase D — App E2E (Vercel preview)

| # | Cenário | Resultado esperado |
|---|---------|-------------------|
| D1 | Cadastro de placa | Lookup + sync de débitos |
| D2 | Pagamento Pix simulado | Reserva + confirmar real |
| D3 | Pagamento cartão simulado | `CARTAO_CREDITO` confirmado |
| D4 | Modo mock (`EXPO_PUBLIC_DATA_SOURCE=mock`) | Fluxo offline inalterado |

## Endpoints expostos pelo BFF

| BFF | FiscalTech |
|-----|------------|
| `POST /api/debitos` | `POST /debitos` |
| `GET /api/placas-com-debito` | `GET /placas-com-debito` |
| `POST /api/reservas` | `POST /reservas` |
| `GET /api/reservas/:id` | `GET /reservas/:id` |
| `POST /api/reservas/:id/confirmar` | `POST /reservas/:id/confirmar` |
| `POST /api/reservas/:id/cancelar` | `POST /reservas/:id/cancelar` |

## Deploy Vercel

1. Conectar repositório ao Vercel.
2. Configurar variáveis de ambiente no painel (Production + Preview).
3. Deploy: build estático Expo + funções em `/api`.
4. Validar preview URL com `EXPO_PUBLIC_BFF_URL` apontando para o mesmo domínio.

## Observações de segurança

- Nunca commitar `FISCALTECH_API_KEY` ou `FISCALTECH_SECRET`.
- Rotacionar credenciais se expostas em canais não seguros.
- Homologação usa HTTP na API FiscalTech; apenas o BFF (HTTPS) deve ser exposto ao app.
