## Controle de Ativos

Esboço básico de sistema web para:
- Controle de Estoque
- Controle de Ferramentas/Equipamentos
- Controle de Veículos

Tecnologias: Next.js (App Router) + TypeScript + Tailwind + Prisma + SQLite.

## Rodando localmente

Pré-requisitos:
- Node.js LTS instalado

### 1) Instalar dependências

```bash
npm install
```

### 2) Banco de dados

O projeto usa SQLite via Prisma. A URL está em `.env`:

```env
DATABASE_URL="file:./dev.db"
```

Para (re)gerar/migrar:

```bash
npx prisma migrate dev
```

### 3) Subir o servidor

Em alguns Windows o `node` pode não estar disponível no PATH imediatamente após instalar.
Se isso acontecer, use os scripts `*:win`.

```bash
# padrão
npm run dev

# Windows (sem depender do PATH do node)
npm run dev:win
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abra http://localhost:3000

## Módulos

- Estoque: `/estoque`
- Ferramentas/Equipamentos: `/ferramentas`
- Veículos: `/veiculos`

## API (CRUD básico)

- Estoque: `GET/POST /api/estoque`, `GET/PATCH/DELETE /api/estoque/:id`
- Ferramentas: `GET/POST /api/ferramentas`, `GET/PATCH/DELETE /api/ferramentas/:id`
- Veículos: `GET/POST /api/veiculos`, `GET/PATCH/DELETE /api/veiculos/:id`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
