# README Color David

Este guia explica **onde ficam todas as cores principais do projeto** e como alterar cada grupo (barra lateral, topbar, cartões, formulários, etc.). Sempre que possível, altere os _tokens_ definidos em `app/globals.css` — eles alimentam todo o tema claro/escuro.

---

## 1. Paletas Globais (tema claro e escuro)

Arquivo: `app/globals.css`

- Seção `:root { ... }` (linhas 3–20): define a paleta do **tema claro**. Principais variáveis:
  - `--background`, `--background-gradient`, `--foreground`
  - `--surface`, `--surface-muted`, `--surface-contrast`
  - `--primary`, `--primary-foreground`, `--accent`
  - `--muted`, `--success`, `--warning`, `--danger`, `--border`
- Seção `[data-theme="dark"] { ... }` (linhas 22–39): mesma estrutura para o **tema escuro**.
- Seção `@theme inline` (linhas 41–52): conecta as variáveis aos tokens usados pelo Tailwind.
- O `body` (linhas 54–59) aplica `background` e `color` baseados nos tokens.

> **Dica:** alterar a cor aqui propaga para quase tudo (sidebar, topbar, cards, inputs, botões, etc.) porque as classes `bg-white`, `text-white/60`, `border-white/20` foram sobrescritas para usar esses tokens.

### 1.1 Sobrescritas de utilitários

A partir da linha 61 de `app/globals.css` há uma série de classes mapeadas:

- `.bg-white`, `.bg-white/95`, `.bg-white/90`, `.bg-white/10` → superfícies/claro.
- `.border-white/10`, `.border-white/20` → bordas neutras.
- `.text-white`, `.text-white/70`, `.text-white/40` → diferentes opacidades da fonte principal.
- Overrides de tons escuros antigos (`.bg-[#151515]`, `.bg-[#1f1f1f]`, etc.) para usar `--surface-muted`.

Altere os tokens globais sempre que for possível, recorrendo aos overrides apenas para ajustes pontuais.

---

## 2. Tema Dinâmico (change de claro ↔ escuro)

- Provider: `src/components/providers/theme-provider.tsx`
  - Guarda o tema ativo (`light`/`dark`) no `localStorage`.
  - Aplica o atributo `data-theme` no `<html>`.
- O toggle fica na Topbar (veja seção 3.2).

Se você quiser forçar um tema ou ajustar o comportamento padrão (ex.: iniciar sempre no escuro), altere a função `getInitialTheme` no provider.

---

## 3. Layout Principal

### 3.1 Sidebar

Arquivo: `src/components/layout/sidebar.tsx`

- Fundo da barra: classe `bg-[#111214]` (linha 64). Você pode trocar por um token (`bg-surface`, `bg-surface-muted`) se quiser seguir a paleta global.
- Botão de workspace (linhas 67–80): usa borda `border-white/10` e um _badge_ com gradiente suave. Ajuste aqui para mudar a cor do cabeçalho.
- Campo de busca (linhas 82–88): borda `border-white/10`, preenchimento `bg-white/5`.
- Seções de navegação:
  - Títulos (linhas 96–97): `text-white/35`.
  - Item ativo (linhas 110–121): `bg-white/10`, borda `border-primary/40`, `bg-primary/20` no ícone.
  - Item inativo (linhas 110–121): `text-white/60`, `hover:bg-white/5`.
  - Pontinho de destaque (`Agenda`, `Estoque`): `bg-[#9b5bff]` (linha 128).
- Rodapé (linhas 139–187):
  - Links usam `bg-white/5`.
  - Card “Plano Premium” (linhas 176–187) — personalize fundo, borda e `text-primary`.

### 3.2 Topbar

Arquivo: `src/components/layout/topbar.tsx`

- Fundo: `bg-white/95` + `border-white/20` (linha 27).
- Texto “Seja bem vindo”: `text-accent`.
- Busca: `border-white/20`, `bg-white/90`, placeholder `text-white/40`.
- Botões:
  - “Buscar”: `bg-primary`, hover `bg-primary/90` (linhas 45–52).
  - “Nova sessão”: mesma lógica de `primary` (linhas 57–61).
  - Toggle de tema: `border-white/20` + `bg-white/90` (linhas 63–71).
  - Sino: `border-white/20`, `bg-white/90`, bolinha `bg-danger` (linhas 73–79).

### 3.3 App Shell & páginas internas

Arquivo: `src/components/layout/app-shell.tsx`

- Wrapper principal usa `text-foreground`. Os conteúdos internos (cards do dashboard, etc.) recebem as classes `bg-white` / `bg-white/10`, então seguem os tokens globais.

---

## 4. Cartões, Cards e Superfícies

### 4.1 Dashboard

Arquivo: `app/(app)/dashboard/page.tsx`

- A maioria dos cards usa `bg-white` ou `bg-white/10` + bordas `border-white/10`. Troque esses utilitários para tokens diferentes caso queira temas específicos por seção.
- Ícones usam `text-primary` ou `text-white/70`.
- Badges (`Badge` componente) respeitam as variantes definidas em `src/components/ui/badge.tsx` (se precisar trocar, edite lá).

### 4.2 Layout de Estoque

Arquivo: `app/(app)/inventory/layout.tsx`

- Cabeçalho: `bg-white/95`, `border-white/20`, sombra `rgba(13,15,14,0.12)` (linha 21).
- Tabs:
  - Ativo (linha 33): `bg-primary` + `shadow-sm`.
  - Inativo: `bg-white/20`, `text-white/70`, hover `bg-white/30`.

### 4.3 Cartões de Inventário

Arquivos:

- `app/(app)/inventory/implante/page.tsx`
- `app/(app)/inventory/cirurgia/page.tsx`
- `app/(app)/inventory/dentistica/page.tsx`

Os formulários/listas usam utilitários (`bg-white`, `bg-white/10`, `border-white/10`). Ajuste direto na classe ou, de preferência, altere os tokens globais.

---

## 5. Formulários e Componentes Reutilizáveis

- **Botões**: `src/components/ui/button.tsx` (linhas 9–32).
  - `variant.primary`: `bg-primary` + hover `bg-primary/90`.
  - `secondary`: `bg-surface-muted`.
  - `ghost`: `text-accent` + `hover:bg-white/10`.
  - `outline`: `border-white/30`.
- **Input**: `src/components/ui/input.tsx`
  - Fundo `bg-white`, borda `border-white/20`, placeholder `text-white/40`.
- **Textarea**: `src/components/ui/textarea.tsx`
  - Mesmo padrão do input.

Altere aqui para mudar todos os formulários de uma vez.

---

## 6. Tela de Login

Arquivo: `app/(auth)/login/page.tsx`

- Container principal: `border-white/20 bg-white` (linha 18).
- Painel esquerdo (gradiente hero): `linear-gradient` usando `var(--background-muted)` e `var(--surface-contrast)` (linhas 19–33).
- Coluna direita: `bg-white/95`.
- Ícones e listas usam `bg-white/15`, `border-white/30`, `text-white/75`.

Troque o gradiente para alterar totalmente o visual da área ilustrativa.

---

## 7. Outros Pontos Importantes

- **Toggle de tema**: já citado, mas se quiser trocar o ícone de sol/lua edite `src/components/layout/topbar.tsx` (linhas 63–71).
- **Assets fixos (logos, ilustrações)**: pasta `public/`. Trocar a imagem pode mudar a paleta percebida da sidebar/login.
- **Sombras**: definidas em utilitários no próprio componente (ex.: `shadow-[0_0_45px_rgba(...)]`). Procure por `shadow-[` para ajustar.

---

## 8. Checklist rápido de “onde alterar o quê”

| Área | Arquivo / Local | Observação |
| --- | --- | --- |
| Fundo geral, cores de texto | `app/globals.css` (tokens) | impacta tudo |
| Tema escuro específica | `app/globals.css` `[data-theme="dark"]` | mesma estrutura do claro |
| Sidebar (cores, gradientes) | `src/components/layout/sidebar.tsx` | inclui tabs, badge, rodapé |
| Topbar (fundo, busca, botões) | `src/components/layout/topbar.tsx` | toggle de tema aqui |
| Cards do Dashboard | `app/(app)/dashboard/page.tsx` | usa `bg-white`/`bg-white/10` |
| Tabs do Estoque | `app/(app)/inventory/layout.tsx` | chips ativo/inativo |
| Inputs/Textareas/Buttons | `src/components/ui/input.tsx`, `textarea.tsx`, `button.tsx` | modificações globais |
| Tela de Login | `app/(auth)/login/page.tsx` | gradiente hero + coluna de formulário |

---

## 9. Dicas finais

1. **Comece sempre pelos tokens** em `app/globals.css`. Ajustar `--primary` e `--surface` já troca a maior parte do site.
2. Quando precisar de uma cor exclusiva (ex.: badge roxo na sidebar), localize o hex diretamente no componente.
3. Teste os dois temas (`clear`/`dark`) após mudanças — alguns tokens são compartilhados, outros possuem par próprio.
4. Se o projeto ficar com cores desalinhadas, faça um `grep`/`rg` por `bg-[#`, `text-[#` para encontrar valores hardcoded e trocar por tokens.

Com isso você tem o mapa completo para ajustar a identidade visual da aplicação. Bons ajustes! 🎨
