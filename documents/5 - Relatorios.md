# 🔟 Relatórios

## Página: `/relatorios`

Página única com abas horizontais. Filtro de período global no topo (aplicado a todas as abas). Botão "Exportar" contextual à aba activa.

### UI — Estado dos prompts

- [ ] Relatórios → prompt a gerar

---

### Aba 1 — Títulos e Recebíveis

> Cobranças, parcelas vencidas, devedores e recebíveis futuros.

- [x] **Títulos vencidos** — id cliente/fornecedor, número da parcela, data vencimento, soma total por cliente

- [x] **Contas a receber** — cliente, descrição, valor pendente, data vencimento, dias em atraso
- [x] **Contas a pagar** — fornecedor/descrição, valor a pagar, data vencimento, status de pagamento
- [x] **Títulos futuros para banco** — PENDENTE com vencimento > hoje; parcela, soma por cliente; para apresentar a banco em pedido de crédito/investimento
- [x] **Maiores devedores** — clientes com maior soma de valor pendente, ordenados decrescente
- [x] **Melhores pagadores** — clientes com maior soma de valor pago (situação = PAGO), parcelas liquidadas

- [ ] **Duplicatas vencidas por cliente** — clientes com >1 parcela vencida, soma total
- [ ] **Taxa de recuperação** — clientes com parcelas vencidas que pagaram nos últimos 30 dias

---

### Aba 2 — Clientes

> Perfil e comportamento financeiro dos clientes.

**Análise geral**

- [ ] **Clientes ATIVO vs INATIVO** — contagem e percentual por situação
- [ ] **Classificação por nota** — NORMAL (nota 0–3) vs VIP (nota 4–5): contagem e recebíveis pendentes por grupo
- [ ] **Clientes com dados incompletos** — sem email ou sem telefone, com quantidade de lançamentos associados
- [ ] **Clientes com múltiplos contactos sem principal** — listar para acção comercial

**Análise financeira**

- [ ] **Total faturado por cliente** — receitas totais ordenadas do maior para o menor
- [ ] **Valor devido vs recebido** — por cliente: total pendente e total pago lado a lado
- [ ] **Consolidado de clientes** — nome, email, telefone, total lançamentos, valor devido, valor recebido
- [ ] **Tempo médio de pagamento** — média de dias entre data_lancamento e data_vencimento nos lançamentos PAGO
- [ ] **DSO (Days Sales Outstanding)** — média ponderada de dias até recebimento por cliente
- [ ] **Evolução mensal de recebimentos** — últimos 12 meses: soma por mês e variação % mês a mês

---

### Aba 3 — Fornecedores

> Gastos com fornecedores e análise de parcelamento.

- [ ] **Fornecedores com maior gasto** — nome e valor total gasto, ordenado decrescente
- [ ] **Ranking por valor a pagar (pendente)** — nome, soma pendente, número de lançamentos
- [ ] **Análise de parcelamento** — média de parcelas por fornecedor e quantos optam por >3 parcelas
- [ ] **Fornecedores sem website ou sem email** — lista com soma de pagamentos realizados e pendentes
- [ ] **Evolução mensal de pagamentos** — últimos 12 meses, soma por mês, top 3 categorias associadas

---

### Aba 4 — Categorias

> Onde o dinheiro é gasto e como as categorias se distribuem.

- [ ] **Gastos por categoria** — nome da categoria e valor total gasto, tabela simples ordenada decrescente
- [ ] **Distribuição débitos vs créditos** — por categoria: total débito, total crédito, saldo e percentuais
- [ ] **Média de valor por lançamento** — média do valor agrupada por categoria
- [ ] **Movimentação por categoria** — total de movimentações, soma dos valores, tipo (débito/crédito)
- [ ] **Análise pai/filho** — soma por categoria pai e top 5 categorias filhas com maior volume
- [ ] **PAGO vs PENDENTE por categoria** — no último trimestre: percentual de cada situação por categoria
- [ ] **Lançamentos sem categoria** — listar e somar por conta para mapear classificações pendentes

---

### Aba 5 — Contas Bancárias

> Saldo real de cada conta bancária.

- [ ] **Saldo por conta** — nome, agência, conta corrente, total entradas, total saídas, saldo final
- [ ] **Fluxo previsto por conta** — próximos 30 dias: entradas e saídas pendentes agrupadas por conta

---

### Aba 6 — Lançamentos

> Anomalias e tendências nos lançamentos registados.

- [ ] **Contas vencidas** — descrição, valor, data vencimento, dias em atraso (PENDENTE + vencimento < hoje)
- [ ] **Receitas por período** — soma de RECEITA agrupada por mês/período seleccionado
- [ ] **Despesas por período** — soma de DESPESA agrupada por mês/período seleccionado
- [ ] **Lançamentos grandes (outliers)** — valor acima da média + 2× desvio padrão; incluir cliente/fornecedor e categoria
- [ ] **Evolução mensal de pagamentos a fornecedores** — últimos 12 meses, soma por mês, top 3 categorias

---

### Aba 7 — Risco

> Identificar clientes de risco para cobrança ou fidelização.

- [ ] **Score de risco por cliente** — nota do cliente + atraso médio → nível: Baixo / Médio / Alto
- [ ] **Clientes por nível de risco** — lista por nível com soma de pendentes e dias médios de atraso
