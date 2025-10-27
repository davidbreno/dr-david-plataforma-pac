# Odonto Manager

Painel completo para gestao de consultorios odontologicos. O projeto utiliza Next.js 16, Prisma e Postgres (Vercel Postgres ou qualquer instancia compatível) para entregar:

- **Dashboard** com indicadores financeiros, agenda e tarefas.
- **Pacientes** com cadastro completo, anexos e historico clinico.
- **Agenda** com consultas e status.
- **Financeiro** com receitas e despesas.
- **Anamnese** com modelos dinamicos.
- **Estoque** com formulários separados para implante, cirurgia e dentistica.

## Requisitos

- Node.js 20+
- Banco Postgres acessivel (Vercel Postgres ou outro)

## Configuracao

1. Duplique `.env.example` para `.env` e preencha com suas credenciais:

   ```ini
   DATABASE_URL="postgres://user:password@host:5432/database"
   SHADOW_DATABASE_URL="postgres://user:password@host:5432/database_shadow"

   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="gere-um-segredo-seguro"
   ```

2. Instale dependencias:

   ```bash
   npm install
   ```

3. Gere o client Prisma e aplique o schema:

   ```bash
   npm run db:push
   ```

4. (Opcional) Gere uma migracao versionada:

   ```bash
   npm run db:migrate
   ```

5. Popular dados iniciais (apenas usuario admin e modelos de anamnese):

   ```bash
   npm run seed
   ```

   Isso cria:

   - **Email**: `contato@drdavidbreno.com`
   - **Senha**: `admin123`

6. Inicie o projeto:

   ```bash
   npm run dev
   ```

   Acesse `http://localhost:3000/login` e autentique com as credenciais acima.

## Resetar base de dados

Para limpar completamente a base (ideal quando quiser começar do zero ou antes de subir para producao):

```bash
npm run db:reset
```

O comando `prisma migrate reset` remove todas as tabelas, recria o schema e executa o seed automaticamente.

## Subir para Vercel

1. Crie um projeto na Vercel e associe o repositório.
2. Configure variaveis de ambiente (`DATABASE_URL`, `SHADOW_DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`).
3. Adicione um banco Postgres (Vercel Postgres ou outra instancia externa).
4. Execute `npm run db:push` e `npm run seed` apontando para o banco de producao (pode ser via GitHub Actions, CLI local ou Vercel CLI).

## Scripts uteis

| Script              | Descricao                                                |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Ambiente de desenvolvimento                              |
| `npm run build`     | Build de producao                                        |
| `npm run start`     | Servidor Next em modo producao                           |
| `npm run lint`      | ESLint                                                   |
| `npm run db:push`   | Sincroniza schema Prisma com o Postgres                  |
| `npm run db:migrate`| Cria migracao interativa                                 |
| `npm run db:reset`  | Reseta banco (drop + migrate + seed)                     |
| `npm run db:studio` | Abre Prisma Studio                                       |
| `npm run seed`      | Executa seed inicial                                     |

## Observacoes

- Nenhum paciente, consulta ou lancamento financeiro demo e criado automaticamente. Tudo comeca limpo para usar em producao.
- O modulo de estoque usa estado local; para persistir em banco basta criar tabelas e APIs utilizando Prisma.
- Ajuste placeholders de email, nome e branding conforme necessario.
# dr-david-plataforma-pac
