# Relatórios — backlog restante

Continuidade de `implementado/5 - Relatorios.md` (Abas 1–2 feitas; Aba 3 Fornecedores ainda pendente lá).

**Entrega (padrão):** 1 query → 1 endpoint → export Excel no backend → botão de download no frontend.  
Filtro de período global (`de` / `ate`) quando fizer sentido.

---

### Aba 4 — Categorias

> Onde o dinheiro é gasto e como as categorias se distribuem.

- [ ] **Gastos por categoria** — nome da categoria e valor total gasto; ordenado decrescente
- [ ] **Distribuição débitos vs créditos** — por categoria: total débito, total crédito, saldo e percentuais
- [ ] **Média de valor por lançamento** — média do valor agrupada por categoria
- [ ] **Movimentação por categoria** — total de movimentações, soma dos valores, tipo (débito/crédito)
- [ ] **Análise pai/filho** — soma por categoria pai e top 5 categorias filhas com maior volume
- [ ] **PAGO vs PENDENTE por categoria** — último trimestre: percentual de cada situação por categoria
- [ ] **Lançamentos sem categoria** — listar e somar por conta (classificações pendentes)

---

### Aba 5 — Contas bancárias

> Saldo real de cada conta bancária.

- [ ] **Saldo por conta** — nome, agência, conta corrente, total entradas, total saídas, saldo final
- [ ] **Fluxo previsto por conta** — próximos 30 dias: entradas e saídas pendentes agrupadas por conta

---

### Aba 6 — Lançamentos

> Anomalias e tendências nos lançamentos registados.

- [ ] **Contas vencidas** — descrição, valor, data vencimento, dias em atraso (`PENDENTE` + vencimento &lt; hoje)
- [ ] **Receitas por período** — soma de `RECEITA` agrupada por mês / período seleccionado
- [ ] **Despesas por período** — soma de `DESPESA` agrupada por mês / período seleccionado
- [ ] **Lançamentos grandes (outliers)** — valor acima da média + 2× desvio padrão; incluir cliente/fornecedor e categoria
- [ ] **Evolução mensal de pagamentos a fornecedores** — últimos 12 meses, soma por mês, top 3 categorias

---

### Aba 7 — Risco

> Identificar clientes de risco para cobrança ou fidelização.

- [ ] **Score de risco por cliente** — nota do cliente + atraso médio → nível: Baixo / Médio / Alto
- [ ] **Clientes por nível de risco** — lista por nível com soma de pendentes e dias médios de atraso
