# Odonto Manager – Architecture Overview

## Objetivo
Construir uma plataforma web moderna para clínicas odontológicas cobrindo:
- Gestão de pacientes (cadastro, linha do tempo clínica, anexos de arquivos).
- Agenda com visualização semanal/diária e controle de status/pagamentos.
- Formulários de anamnese configuráveis com templates específicos de odontologia.
- Painel financeiro (receitas, despesas, repasses) e relatórios com gráficos.
- Indicadores executivos em um painel inicial (KPIs, próximos atendimentos, tarefas).

## Stack Proposta
- **Next.js 14 (App Router + TypeScript + Tailwind CSS)** para o front‑end SPA/SSR.
- **Prisma ORM** conectado ao **Vercel Postgres**.
- **NextAuth** (Credentials + OAuth opcional) com middleware para proteger rotas.
- **shadcn/ui + Tailwind** para componentes modernos reutilizáveis.
- **Zod** para validação de formulários e server actions.
- **TanStack Query (React Query)** para estados de dados client-side quando necessário.
- **@vercel/blob** para armazenamento de anexos (PDFs, imagens) com fallback local em dev.
- **Recharts** para visualizações analíticas (financeiro, relatórios).

## Módulos Principais
- **Autenticação & Controle de Acesso**
  - Login com e-mail/senha (hash Argon2).
  - Perfis: administrador, dentista, recepção (feature flag futura).
- **Dashboard**
  - Próximos atendimentos, tarefas, financeiro rápido, indicadores de pacientes.
  - Cards configuráveis com filtros (por profissional, período).
- **Pacientes**
  - CRUD de pacientes, contatos, convênios.
  - Linha do tempo clínica (consultas, anotações, anexos).
  - Upload/download de anexos via Blob Storage.
- **Anamnese**
  - Templates pré-carregados (adulto, infantil, ortodôntica etc).
  - Questões com tipos: texto, sim/não, múltipla escolha, rating.
  - Registro de respostas por paciente/sessão com flag de pagamento (sim/não).
- **Agenda**
  - Visualização semanal (calendário) e diária.
  - Criação/Edição de consultas, integrações futuras com Google Calendar.
- **Financeiro**
  - Lançamento de receitas/despesas, status (pago, pendente, parcial).
  - Relatórios por período, exportação CSV (futuro).
- **Relatórios & Analytics**
  - Gráficos de pacientes por status/faixa etária, evolução financeira, produtividade.

## Fluxo de Dados
1. Usuário autentica via NextAuth → session JWT + cookies protegidos.
2. Server Actions / Route Handlers aplicam validações (Zod) e acessam Prisma.
3. Prisma mapeia modelos:
   - `User`, `Patient`, `Contact`, `Appointment`, `Task`, `AnamnesisTemplate`, `AnamnesisQuestion`, `AnamnesisResponse`, `Attachment`, `FinancialTransaction`, `Notification`.
4. Uploads de arquivos:
   - Cliente envia `FormData` → `POST /api/uploads` → `@vercel/blob` → URL retornada e persistida.
5. Componentes cliente consomem dados via Server Components + client wrappers (React Query para filtros em tempo real).

## Layout & UX
- Sidebar fixa com seções (Painel, Pacientes, Agenda, Financeiro, Relatórios, Marketing, Configurações).
- Header com busca global, switch profissional, ícones de notificações, avatar.
- Cards e tabelas inspirados no PsicoManager, porém com linguagem visual odontológica (tons azul/verde, ícones dentários).
- Componentes reutilizáveis: `DataTable`, `KpiCard`, `Timeline`, `CalendarWeek`, `AttachmentGrid`, `AnamnesisForm`.

## Deploy & Infra
- Deploy no Vercel (build Next.js).
- Banco Vercel Postgres (DATABASE_URL + shadow DB para Prisma).
- Token `BLOB_READ_WRITE_TOKEN` para uploads.
- Variáveis adicionais: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `SMTP_*` (para e-mails futuros).

## Próximos Passos Técnicos
1. Adicionar dependências (Prisma, NextAuth, shadcn/ui, Zod, React Query, Recharts, @vercel/blob, upload utilities).
2. Configurar Prisma schema + migrações iniciais.
3. Implementar layout base com sidebar responsiva e cabeçalho.
4. Codificar módulos prioritários (Pacientes, Anamnese, Agenda, Financeiro).
5. Implementar seeds iniciais para dados demo (templates de anamnese, usuários).
6. Criar documentação de setup e scripts (migrations, seeding, lint/test).
