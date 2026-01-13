# Guia de Deploy no Netlify

Este guia explica como colocar o seu projeto **Sermonia** no ar usando a Netlify.

## Pré-requisitos

1.  **Banco de Dados na Nuvem**: Como seu projeto usa Prisma e Postgres, você precisa de um banco de dados acessível pela internet.
    *   Recomendação: [Neon](https://neon.tech/), [Supabase](https://supabase.com/) ou [Railway](https://railway.app/).
    *   Obtenha a `DATABASE_URL` do seu banco na nuvem (ex: `postgres://user:pass@host:port/db`).
    *   **Importante**: Execute `npx prisma db push` ou `npx prisma migrate deploy` usando a URL do banco da nuvem para criar as tabelas lá.

2.  **Código no GitHub**: Seu projeto deve estar em um repositório no GitHub.

## Passo a Passo (Via Painel Netlify)

1.  Acesse [netlify.com](https://www.netlify.com/) e faça login.
2.  Clique em **"Add new site"** > **"Import from an existing project"**.
3.  Escolha **GitHub**.
4.  Autorize o Netlify e selecione o repositório do `sermonia2026`.
5.  **Configurações de Build**:
    *   **Build command**: `npm run build` (já deve vir preenchido).
    *   **Publish directory**: `.next` (ou deixe o padrão que o Netlify detectar).
6.  **Environment variables (Variáveis de Ambiente)**:
    *   Clique em **"Add a variable"**.
    *   Adicione `DATABASE_URL` e cole a URL do seu banco de dados na nuvem.
    *   Adicione outras variáveis que você usa no `.env` local (ex: `NEXTAUTH_SECRET`, `NEXTAUTH_URL` - para o Netlify, `NEXTAUTH_URL` geralmente não é necessário se usar a URL automática, mas é bom definir a URL final do site quando tiver).
7.  Clique em **"Deploy"**.

## Passo a Passo (Via CLI - Linha de Comando)

Se preferir fazer tudo pelo terminal:

1.  Instale a CLI do Netlify:
    ```bash
    npm install netlify-cli -g
    ```
2.  Faça login:
    ```bash
    netlify login
    ```
3.  Inicialize o site:
    ```bash
    netlify init
    ```
    *   Siga as instruções (Create & configure a new site).
    *   Team: Selecione seu time.
    *   Site name: Escolha um nome ou deixe em branco.
    *   Build command: `npm run build`.
    *   Directory to deploy: `.next`.
4.  Configure as variáveis de ambiente:
    ```bash
    netlify env:set DATABASE_URL "sua_url_do_banco_aqui"
    ```
5.  Faça o deploy:
    ```bash
    netlify deploy --prod
    ```

## Observações Importantes

*   **Erro de Build**: Se der erro de build relacionado a tipos ou lint, você pode adicionar `CI=false` nas variáveis de ambiente para ignorar warnings, mas o ideal é corrigir os erros.
*   **Banco de Dados**: Certifique-se de que seu banco de dados aceita conexões externas (0.0.0.0/0 ou IPs do Netlify).
