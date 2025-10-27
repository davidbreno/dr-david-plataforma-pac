# Guia de Cores — Onde trocar cada cor (página, linha e nome)

Este guia lista os principais pontos do projeto onde as cores são definidas, com o caminho do arquivo e a linha exata para edição. Sempre que possível, prefira alterar os tokens em `app/globals.css` — isso propaga o tema para o projeto todo.

Observação: numeração de linhas baseada no estado atual do repositório (pode mudar conforme commits futuros).

## Tema Global (recomendado)

- Paleta base e tokens
  - Arquivo: `app/globals.css`
  - Linhas relevantes:
    - 5: `--background`
    - 6: `--background-gradient`
    - 7: `--foreground`
    - 8: `--surface`
    - 9: `--surface-muted`
    - 10: `--primary`
    - 11: `--primary-foreground`
    - 12: `--accent`
    - 13: `--muted`
    - 14: `--success`
    - 15: `--warning`
    - 16: `--danger`
    - 17: `--border`
  - Aplicação no body
    - 39: `background: var(--background-gradient);`
    - 40: `color: var(--foreground);`

- Sobrescritas utilitárias (quando um componente usa classes como `bg-white` etc.)
  - 45: `.bg-white { background-color: var(--surface) }`
  - 49: `.bg-white/90`
  - 53: `.bg-white/10`
  - 57: `.bg-surface`
  - 61: `.bg-surface-muted`
  - 68: `.border-slate-100..400 => var(--border)`
  - 73: `.text-slate-900/800 => var(--foreground)`
  - 78: `.text-slate-700/600`
  - 83: `.text-slate-500/400 => var(--muted)`

## Layout principal

- Sidebar (fundo em degradê escuro)
  - Arquivo: `src/components/layout/sidebar.tsx`
  - 39: `from-[#0f0f0f] via-[#161616] to-[#202020]` — degradê do fundo
  - 83: `from-[#2a2a2a] to-[#3a3a3a]` — linha de acento à direita
  - Inativos/ativos do menu
    - 72: ativo `bg-white/10 text-white`
    - 73: inativo `text-white/60 hover:bg-white/5`

- Topbar (faixa superior)
  - Arquivo: `src/components/layout/topbar.tsx`
  - 29: `bg-[#161616]/95` — fundo da topbar
  - 44: caixa de busca `border-white/10 bg-[#1f1f1f]`
  - 56: botão buscar `bg-primary` (usa token global)
  - 67: botão “Nova sessão” `bg-primary`
  - 75: botão sininho `bg-[#1f1f1f] text-white/60`

## Estoque — abas e páginas

- Abas do Estoque (cor do chip ativo)
  - Arquivo: `app/(app)/inventory/layout.tsx`
  - 38: ativo `bg-[#c97c02] text-white` (trocar para o tom desejado)
  - 39: inativo `bg-[#e67c27] text-white/70` (trocar para outra base/hover)

- Implante — formulário e lista
  - Arquivo: `app/(app)/inventory/implante/page.tsx`
  - 161: wrapper do formulário `bg-[#151515]` (caixa do formulário)
  - 197–217: inputs usam tema global; borda/placeholder seguem tokens
  - 156/157: grid define largura da coluna do formulário (`lg:grid-cols-[300px_1fr]`)
  - 176/187/199/210: labels usam `text-white/70` (mudar aqui se quiser labels mais claras)
  - Lista de itens (cards)
    - 173: container da lista (grid em duas colunas a partir de `sm`)
    - 179: card do item `bg-[#181818] border-white/8`
    - 187: tag do tipo `bg-white/10`
    - 192: detalhe translúcido `bg-white/5`
    - 200: imagem do implante `width/height ~48` (ajuste conforme o PNG)
    - 205–212: botões edit/excluir seguem tokens (`bg-primary`, etc.)

- Cirurgia
  - Arquivo: `app/(app)/inventory/cirurgia/page.tsx`
  - Cores seguem os mesmos tokens do tema; o card usa o mesmo padrão de `bg-[#151515]` quando renderizado (se quiser um tom específico, replicar os ajustes do arquivo de implante).

- Dentística
  - Arquivo: `app/(app)/inventory/dentistica/page.tsx`
  - Segue a mesma linha do formulário/itens; altere como no Implante.

## Tela de Login

- Arquivo: `app/(auth)/login/page.tsx`
  - 12: container `border-white/10 bg-[#151515]/90`
  - 13: banner do lado esquerdo `from-[#0d0d0d] via-[#161616] to-[#212121]`
  - 43: coluna direita `bg-[#151515]/90`
  - Para tema claro/escuro, priorize os tokens em `globals.css`.

## Como escolher onde alterar

1. Procure primeiro em `app/globals.css` e ajuste os tokens.
2. Para pontos “fixos” (ex.: vinho da aba ativa):
   - `app/(app)/inventory/layout.tsx:38` (ativo)
   - `app/(app)/inventory/layout.tsx:39` (inativo)
3. Para fundos de cartões/caixas:
   - Formulários: `bg-[#151515]` (implante 161)
   - Itens da lista: `bg-[#181818]` (implante 179)
4. Para gradientes da sidebar/topbar:
   - Sidebar: `src/components/layout/sidebar.tsx:39`
   - Topbar: `src/components/layout/topbar.tsx:29`

## Dicas

- Se você quer trocar todas as instâncias de uma cor (ex.: `#151515`), um “Find in Files” pelo hex resolve rápido. 
- Para manter consistência, mover cores fixas para tokens em `globals.css` e usar classes utilitárias que referenciem esses tokens (ex.: `.bg-white` já mapeado para `--surface`).

