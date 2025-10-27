# Comandos Úteis – Plataforma Odonto Dr. David

Guia rápido com os principais comandos do projeto, do Git ao Next.js/Prisma, com o que cada um faz.

## Pré‑requisitos
- Node.js LTS (20.x recomendado). Se usar Windows, instale o Visual C++ 2015–2022 e .NET Desktop Runtime caso rode Next 16 com SWC nativo.
- npm (ou pnpm/yarn, se preferir).

## Clonar e instalar dependências
`ash
# Clonar o repositório (exemplo)
git clone https://github.com/davidbreno/Plataforma-Odonto-Dr.david.git
cd Plataforma-Odonto-Dr.david/odonto-manager

# Instalar pacotes	npm install
# (opcional) Caso existam conflitos de peer deps
npm install --legacy-peer-deps
`

## Variáveis de ambiente (.env)
Crie o arquivo .env (baseie-se em .env.example) com:
- DATABASE_URL e SHADOW_DATABASE_URL: Postgres (Render/Vercel etc.).
- NEXTAUTH_URL: ex.: http://localhost:3000.
- NEXTAUTH_SECRET: string aleatória segura.
- BLOB_READ_WRITE_TOKEN: token do Vercel Blob (para uploads), se for usar.

## Next.js (desenvolvimento e build)
`ash
# Desenvolvimento (Webpack / SWC em WASM forçado no package.json)
npm run dev
# Build de produção
npm run build
# Servir build de produção
npm run start
# Lint do código
npm run lint
`

## Prisma (ORM / banco de dados)
`ash
# Gerar o cliente do Prisma (após alterar schema)
npx prisma generate

# Sincronizar o schema com o banco (aplica CREATE/ALTER conforme schema)
npm run db:push          # atalho para: prisma db push

# Resetar o banco (zera tabelas e reaplica schema)
npx prisma db push --force-reset

# Criar migração interativa (se preferir migrações nomeadas)
npm run db:migrate       # atalho para: prisma migrate dev

# Abrir o Prisma Studio (interface web para ver/editar dados)
npm run db:studio        # atalho para: prisma studio

# Popular dados de exemplo (admin, pacientes, templates)
npm run seed             # executa prisma/seed.ts (TSX)
`

### Script para enriquecer a anamnese
`ash
# Adiciona perguntas ao modelo "Anamnese Odontologica Completa"
npx tsx prisma/update_anamnesis_template.ts
`

## Git (fluxo básico)
`ash
# Iniciar repositório local na pasta do projeto
git init -b main

# Adicionar repositório remoto (GitHub)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git

# Ver o status de arquivos
git status

# Adicionar todos os arquivos
git add .

# Criar commit
git commit -m "mensagem do commit"

# Enviar para o remoto / criar branch no GitHub
git push -u origin main

# Atualizar local a partir do remoto
git pull origin main
`

## Observações e resolução de problemas
- SWC/Turbopack (Windows): se o Next 16 reclamar de DLL do SWC ou do Turbopack, use o script dev já configurado com Webpack/SWC em WASM (via cross-env NEXT_DISABLE_TURBO=1 NEXT_DISABLE_SWC_BINARY=1).
- Server Actions (Next 15): Actions passadas a <form action={...}> precisam:
  - Ser inline com 'use server' dentro da função, ou
  - Ser funções definidas no mesmo arquivo Server Component com 'use server' no corpo.
- Nunca commitar .env (o .gitignore já ignora .env*).

## Scripts disponíveis (package.json)
`ash
npm run dev          # next dev (desenvolvimento)
npm run build        # next build (produção)
npm run start        # next start (servir build de produção)
npm run lint         # eslint
npm run db:generate  # prisma generate
npm run db:migrate   # prisma migrate dev
npm run db:push      # prisma db push
npm run db:studio    # prisma studio
npm run seed         # executa prisma/seed.ts via tsx
`

---
Qualquer ajuste que queira automatizar (scripts extras, Actions de deploy, seed customizado), posso configurar para você.
