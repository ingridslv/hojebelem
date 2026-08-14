# Hoje Belém

Plataforma mobile-first para descoberta e divulgação de eventos em Belém/PA.

## Desenvolvimento

1. Copie `.env.example` para `.env`.
2. Rode `docker compose up -d postgres`.
3. Rode `npm install`, `npx prisma migrate dev` e `npm run db:seed`.
4. Inicie com `npm run dev` e acesse `http://localhost:3000`.

O seed cria o administrador `admin@hojebelem.local` com a senha temporária `MudeEstaSenha123!`. Troque-a fora do ambiente local.

Para subir app e banco juntos: `docker compose up --build`.

## Produção

Configure `DATABASE_URL` com a conexão PostgreSQL do Railway, além de `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL` e as credenciais Google OAuth. Execute `prisma migrate deploy` antes de iniciar a aplicação.
