# Consulta de CPF (BigDataCorp)

Integração de teste para preencher nome e data de nascimento no cadastro via dataset `basic_data` da BigDataCorp.

## Credenciais

1. Acesse o [BDC Center](https://bdc.bigdatacorp.com.br/) e crie um usuário de integração.
2. Gere um token JWT com `AccessToken` e `TokenId`.
3. Configure no Vercel (ou `.env.local` para BFF local):

```env
BIGDATACORP_BASE_URL=https://plataforma.bigdatacorp.com.br
BIGDATACORP_ACCESS_TOKEN=seu-access-token
BIGDATACORP_TOKEN_ID=seu-token-id
```

**Nunca** coloque essas variáveis no app Expo (`EXPO_PUBLIC_*`). A consulta passa pelo BFF em `POST /api/cpf/consultar`.

## Fluxo no app

1. Usuário informa o CPF na etapa 1 do cadastro.
2. O app chama o BFF, que consulta `POST /pessoas` com `Datasets: basic_data`.
3. Nome e data de nascimento são exibidos para confirmação.
4. Usuário informa telefone (e e-mail opcional) e segue para a etapa de senha.

## Limites

A conta gratuita oferece cerca de 500 consultas — adequado para testes de usabilidade nesta fase. Monitore o uso no BDC Center.

## Referência

- [Primeira consulta](https://docs.bigdatacorp.com.br/plataforma/reference/primeira-consulta)
- [Dados básicos (`basic_data`)](https://docs.bigdatacorp.com.br/plataforma/reference/pessoas-dados-cadastrais-basicos)
