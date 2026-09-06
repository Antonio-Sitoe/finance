# 🔟 Relatórios

## Página: `/relatorios`

Página única com abas horizontais. Filtro de período global no topo (aplicado a todas as abas). Botão "Exportar" contextual à aba activa.

---

### Aba 1 — Títulos e Recebíveis

> Cobranças, parcelas vencidas, devedores e recebíveis futuros.

- [x] **Títulos vencidos** — id cliente/fornecedor, número da parcela, data vencimento, soma total por cliente

- [x] **Contas a receber** — cliente, descrição, valor pendente, data vencimento, dias em atraso
- [x] **Contas a pagar** — fornecedor/descrição, valor a pagar, data vencimento, status de pagamento
- [x] **Títulos futuros para banco** — PENDENTE com vencimento > hoje; parcela, soma por cliente; para apresentar a banco em pedido de crédito/investimento
- [x] **Maiores devedores** — clientes com maior soma de valor pendente, ordenados decrescente
- [x] **Melhores pagadores** — clientes com maior soma de valor pago (situação = PAGO), parcelas liquidadas

- [x] **Duplicatas vencidas por cliente** — clientes com >1 parcela vencida, soma total

---

### Aba 2 — Clientes

> Perfil e comportamento financeiro dos clientes.

**Análise geral**

- [x] **Clientes ATIVO vs INATIVO** — contagem e percentual por situação
- [x] **Classificação por nota** — NORMAL (0–3), MASTER (4–5), VIP (6–10): contagem e recebíveis pendentes por grupo
- [x] **Clientes com dados incompletos** — sem email ou sem telefone
- [x] **Clientes com múltiplos contactos** — contagem de clientes com mais de 1 contacto

---

**Análise financeira**

- [x] **Total faturado por cliente** — receitas totais ordenadas do maior para o menor (+ % recebido e prazo até próximo vencimento pendente)
- [x] **Evolução mensal de recebimentos** — últimos 12 meses: soma por mês e variação % mês a mês

---

### Aba 3 — Fornecedores

> Gastos com fornecedores e análise de parcelamento.

- [x] **Fornecedores com maior gasto** — nome e valor total gasto, ordenado decrescente
- [x] **Ranking por valor a pagar (pendente)** — nome, soma pendente, número de lançamentos
- [x] **Análise de parcelamento** — média de parcelas por fornecedor e quantos optam por >3 parcelas
- [x] **Evolução mensal de pagamentos** — últimos 12 meses, soma por mês, top 3 categorias associadas

---
