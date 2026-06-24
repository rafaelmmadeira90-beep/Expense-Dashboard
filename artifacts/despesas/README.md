# Dashboard de Prestação de Contas

> Controle financeiro, despesas corporativas e relatórios gerenciais.

Aplicação web para registro e acompanhamento de despesas, com indicadores em tempo real, gráficos analíticos, filtros avançados e exportação para Excel e PDF.

---

## Funcionalidades

- **Cadastro de despesas** — Descrição, valor, data, categoria e status
- **Indicadores em tempo real** — Total geral, total pago, total pendente e total cancelado
- **Gráficos** — Distribuição por categoria (donut) e por status (barras)
- **Filtros avançados** — Por status, categoria, período (data inicial/final) e busca por descrição
- **Exportar para Excel** — Gera arquivo `.xlsx` com resumo e lançamentos filtrados
- **Exportar para PDF** — Abre janela de impressão com relatório formatado, incluindo resumo financeiro no topo
- **Persistência local** — Dados salvos no `localStorage` do navegador, sem necessidade de backend
- **Editar e excluir** — Cada lançamento pode ser editado ou removido individualmente

## Categorias disponíveis

Alimentação · Transporte · Moradia · Saúde · Lazer · Educação · Imóvel · Outros

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Framework | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build | [Vite](https://vitejs.dev/) |
| Estilo | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Gráficos | [Recharts](https://recharts.org/) |
| Exportação Excel | [SheetJS (xlsx)](https://sheetjs.com/) |
| Exportação PDF | `window.print()` com HTML estilizado |
| Persistência | `localStorage` do navegador |
| Gerenciador de pacotes | [pnpm](https://pnpm.io/) |

## Estrutura do projeto

```
artifacts/despesas/
├── src/
│   ├── components/
│   │   ├── expense-charts.tsx   # Gráficos por categoria e status
│   │   ├── expense-form.tsx     # Formulário de cadastro/edição
│   │   ├── expense-table.tsx    # Tabela com filtros avançados
│   │   └── summary-cards.tsx   # Cards de indicadores
│   ├── hooks/
│   │   └── use-expenses.ts     # Estado global + persistência localStorage
│   ├── lib/
│   │   ├── constants.ts        # Categorias e status disponíveis
│   │   ├── export-utils.ts     # Lógica de exportação Excel e PDF
│   │   ├── formatters.ts       # Formatação de moeda e datas
│   │   ├── types.ts            # Tipos TypeScript compartilhados
│   │   └── utils.ts            # Utilitários de classe CSS
│   └── pages/
│       └── dashboard.tsx       # Página principal, orquestra filtros e exports
├── index.html
├── package.json
└── vite.config.ts
```

## Como executar localmente

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm --filter @workspace/despesas run dev
```

Acesse em `http://localhost:5173` (ou a porta exibida no terminal).

## Exportação

Os botões **Exportar Excel** e **Exportar PDF** consideram os filtros ativos no momento da exportação. O relatório inclui:

- Data de geração
- Período filtrado
- Resumo com total geral, pago, pendente e cancelado
- Tabela com todos os lançamentos visíveis

---

Desenvolvido com [Replit](https://replit.com/).
