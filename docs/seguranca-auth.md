# Camada de segurança — autenticação

## Visão geral

O app separa **consulta gratuita** (sem login) de **pagamento** (com cadastro obrigatório).

| Etapa | Rota | Autenticação |
|-------|------|--------------|
| Splash / entrada | `/splash` | Não |
| Consulta de placa | `/consulta-placa` | Não |
| Resultado dos débitos | `/consulta-resultado` | Não |
| Cadastro (dados + senha) | `/cadastro`, `/cadastro/senha` | Não (até concluir) |
| Login | `/login` | Não (até concluir) |
| Dashboard e pagamento | `/(tabs)`, `/pagar-*`, `/api/reservas/*` | Sim |

## Princípios de segurança

- **Senha**: hash com `scrypt` no BFF — nunca persiste em texto plano.
- **Sessão**: cookie `HttpOnly` + `SameSite=Lax` (`ps_session`), assinado com HMAC no servidor.
- **Frontend**: não armazena token JWT, senha nem dados sensíveis; apenas chama o BFF com `credentials: 'include'`.
- **Reservas/pagamento FiscalTech**: rotas `/api/reservas/*` exigem sessão válida.

## Variáveis de ambiente

```bash
# Mínimo 32 caracteres — obrigatório em produção
AUTH_SECRET=
```

Configure `AUTH_SECRET` no Vercel (Production + Preview) antes do deploy.

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cadastro completo (dados + senha + veículo opcional) |
| POST | `/api/auth/login` | Login com CPF + senha |
| GET | `/api/auth/me` | Usuário da sessão atual |
| POST | `/api/auth/logout` | Encerra sessão |

## Cadastro — regras

- **CPF** (obrigatório), **nome**, **data de nascimento**, **telefone** (obrigatório)
- **E-mail** opcional
- **Senha**: 6–32 caracteres, com letra maiúscula **ou** caractere especial
- Opção de cadastrar a placa já consultada na etapa da senha

## Homologação

O store de usuários usa memória do runtime serverless (adequado para homologação). Para produção, substituir `api/_lib/auth/users.ts` por persistência em banco (Postgres/Supabase).

## Teste local

Com app e BFF no mesmo origin (`npm run dev` + proxy Vercel ou deploy preview), cookies funcionam automaticamente. Em dev cross-origin (`localhost:8081` → `vercel.app`), o CORS está configurado com `credentials: true`.
