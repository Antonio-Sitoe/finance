
# 🔟 Relatórios Exportação (Exportar CSV E Excel)

Relatórios simples.

### Relatório financeiro

* [ ] Receitas por período
* [ ] Despesas por período
* [ ] RELATORIOS DE TITULOS VENCIDOS, (PARCELA E SOMA TOTAL)

---

### Relatório por categoria

* [ ] Total gasto por categoria
* [ ] 3️⃣ Média de Valor por Categoria - Mostre a média do valor dos lançamentos agrupada por categoria.
---

### Relatório por cliente

* [ ] Total faturado por cliente
* [ ] 1️⃣ Classificação por Nota - Crie uma consulta que liste todos os clientes classificando-os como NORMAL (nota 0–3) ou VIP (nota 3–5).
* [ ] 2️⃣ Contagem de Clientes por Situação - ostre quantos clientes estão ATIVOS e quantos estão INATIVOS.


## Relatório de Saldo por Conta

Gere um relatório que mostre o saldo total de cada conta, considerando:

- Nome da conta
- Agência e conta corrente
- Total de débitos (WHERE debito = true)
- Total de créditos (WHERE credito = true)
- Saldo final (créditos - débitos)

## Relatório de Contas a Receber

Gere um relatório de contas a receber com:

- Nome do cliente
- Descrição do lançamento
- Valor pendente
- Data de vencimento
- Dias em atraso

## Relatório de Contas a Pagar

Gere um relatório de contas a pagar com:

- Nome do fornecedor
- Descrição do lançamento
- Valor a pagar
- Data de vencimento
- Status de pagamento

## Relatório de Movimentação por Categoria

Gere um relatório de movimentações agrupadas por categoria com:

- Nome da categoria
- Total de movimentações
- Soma dos valores
- Tipo (Débito/Crédito)

## Relatório Consolidado de Clientes

Gere um relatório consolidado de clientes com:

- Nome do cliente
- Email e telefone
- Total de lançamentos
- Valor total devido (pendentes)
- Valor total recebido (pagos)


###  Relatórios de Gastos por Categorias
Mostrar a categoria e o quanto a categoria gastou, mostrar a categoria e o gasto apenas.
Por exemplo:
| Categoria | Gasto |
|-----------|-------|
| Salário | 1400 |

### Relatórios de Receitas por Cliente
Mostrar o nome do cliente e o total de receitas recebidas, ordenado pelo maior valor.
Por exemplo:
| Cliente | Total Recebido |
|---------|----------------|
| Empresa A | 5000 |

### Relatórios de Fornecedores com Maior Gasto
Mostrar o nome do fornecedor e o valor total gasto com esse fornecedor, ordenado decrescente.
Por exemplo:
| Fornecedor | Total Gasto |
|------------|-------------|
| Fornecedor X | 3200 |

### Relatórios de Contas Vencidas

Mostrar a descrição do lançamento, o valor, a data de vencimento e quantos dias está em atraso, apenas os pendentes.
Por exemplo:
| Descrição | Valor | Data Vencimento | Dias em Atraso |
|-----------|-------|-----------------|----------------|
| Fatura 001 | 500 | 2025-11-15 | 17 |


### Relatórios de Saldo por Conta Bancária
Mostrar o nome da conta, agência, conta corrente e o saldo atual considerando todos os lançamentos.
Por exemplo:
| Conta | Agência | Conta Corrente | Saldo |
|-------|---------|----------------|-------|
| Conta Principal | 0001 | 123456-7 | 8750.50 |

---

- [ ] LEVANTAMENTOS DE RELATORIOS DE TITULOS FUTUROS (PARCELA E SOMA TOTAL) - A EMPRESA QUER REALIZAR INVESTIMENTOS E QUER FAZER IMPRESTIMO BANCARIO E TER UM CAPITAL PARA INVESTIR EM UM PROJECTO, O BANCO SOLICITA TODOS OS RECEBIVEIS DA EMPRESA, OU SEJA TUDO AQUILO QUE OS CLIENTES SE COMPROMETEM EM PAGAR, CRIAR UMA LISTAGEM DE TUDO QUE PRECISA SER PAGO, PARA PODER ENTREGAR AO BANCO PARA PODER TER O INVESTIMENTO.


- [ ] GERAR RELATORIOS DE MAIORES DEVEDORES E PAGADORES (QUER SE INICIAR UM PROCESSO DE COBRANCA PARA PESSOAS QUE ESTAO A DEVER, QUEREM PRIVILEGIAR OS CLIENTES QUE SEMPRE PAGAM EM DIA, OU DAR PRESENTE AOS CLIENTES QUE PAGEM EM DIA)

---

## 📊 Relatórios Estatísticos Avançados

### Relatório de Títulos / Recebíveis

* [ ] Títulos vencidos - lista com id_cliente/id_fornecedor, número da parcela, data_vencimento e soma total
* [ ] Títulos futuros (vencimento > hoje) - filtrar por situação PENDENTE, parcela e soma total por cliente
* [ ] Maiores devedores - clientes com maior soma de valor pendente, ordenados do maior para o menor
* [ ] Melhores pagadores - clientes com maior soma de valor pago (situação = PAGO), com parcelas liquidadas
* [ ] Aging de títulos - agrupar pendentes por faixa de atraso (0–30, 31–60, 61–90, >90 dias)
* [ ] Duplicatas/parcelas vencidas por cliente - listar clientes com >1 parcela vencida e soma total
* [ ] Taxa de recuperação - clientes com parcelas vencidas que pagaram nos últimos 30 dias

---

### Relatório de Fluxo de Caixa

* [ ] Fluxo de caixa previsto (recebíveis) - próximos 90 dias, soma diária/por mês por cliente
* [ ] Fluxo de saída (pagamentos a fornecedores) - próximos 60 dias, soma por fornecedor e categoria

---

### Relatório de Fornecedores

* [ ] Ranking de fornecedores por valor total a pagar - pendente, mostrando nome, soma e número de lançamentos
* [ ] Fornecedores sem website ou sem email - lista com soma de pagamentos realizados e pendentes
* [ ] Análise de parcelamento por fornecedor - média de parcelas e quantos optam por >3 parcelas

---

### Relatório de Categorias

* [ ] Distribuição de lançamentos por categoria - total débitos vs créditos, soma e percentuais
* [ ] Média de valor por categoria - média dos lançamentos agrupada por categoria
* [ ] Análise por categoria pai/filho - soma de valores por categoria pai e top 5 categorias
* [ ] Percentual de lançamentos PAGO vs PENDENTE por categoria no último trimestre
* [ ] Contas com lançamentos sem categoria - listar e soma por conta para mapear classificação pendente

---

### Relatório de Clientes - Análise Geral

* [ ] Percentual de clientes ATIVO vs INATIVO - contagem e média de nota por situação
* [ ] Classificação por nota - clientes NORMAL (0–3) vs VIP (4–5), contagem e recebíveis pendentes
* [ ] Clientes com dados incompletos - sem email ou sem telefone, com quantidade de lançamentos
* [ ] Clientes com múltiplos contactos sem contato principal - listar para ação comercial
* [ ] Contagem de clientes por situação - quantos ATIVOS e quantos INATIVOS

---

### Relatório de Clientes - Análise Financeira

* [ ] Tempo médio de pagamento por cliente - média de dias entre data_lancamento e data_vencimento (PAGO)
* [ ] DSO (Days Sales Outstanding) - calcular média ponderada de dias de recebimento para clientes
* [ ] Total faturado por cliente - receitas totais ordenadas pelo maior valor
* [ ] Valor total devido por cliente (pendentes) e valor total recebido (pagos)
* [ ] Evolução mensal de recebimentos - últimos 12 meses com soma por mês e variação %

---

### Relatório de Contactos

* [ ] Top 10 clientes por quantidade de contactos - incluir email e telefone dos contactos principais

---

### Relatório de Contas Bancárias

* [ ] Saldo por conta - soma de lançamentos (entradas/saídas) com saldo calculado por conta

---

### Relatório de Lançamentos

* [ ] Lançamentos grandes - todos com valor acima da média + 2*desvio padrão; incluir cliente/fornecedor e categoria
* [ ] Evolução mensal de pagamentos a fornecedores - últimos 12 meses com soma por mês e top 3 categorias
* [ ] Relatório de cancelamentos/alterações - contar clientes/fornecedores que mudaram situação no último ano

---

### Relatório de Risco

* [ ] Score de risco - combinar nota do cliente e atraso médio (baixa nota + alto atraso = alto risco)
* [ ] Clientes por nível de risco - listar clientes em cada nível (baixo, médio, alto)