
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

### LEVANTAMENTOS DE RELATORIOS DE TITULOS FUTUROS (PARCELA E SOMA TOTAL) - A EMPRESA QUER REALIZAR INVESTIMENTOS E QUER FAZER IMPRESTIMO BANCARIO E TER UM CAPITAL PARA INVESTIR EM UM PROJECTO, O BANCO SOLICITA TODOS OS RECEBIVEIS DA EMPRESA, OU SEJA TUDO AQUILO QUE OS CLIENTES SE COMPROMETEM EM PAGAR, CRIAR UMA LISTAGEM DE TUDO QUE PRECISA SER PAGO, PARA PODER ENTREGAR AO BANCO PARA PODER TER O INVESTIMENTO.


### GERAR RELATORIOS DE MAIORES DEVEDORES E PAGADORES (QUER SE INICIAR UM PROCESSO DE COBRANCA PARA PESSOAS QUE ESTAO A DEVER, QUEREM PRIVILEGIAR OS CLIENTES QUE SEMPRE PAGAM EM DIA, OU DAR PRESENTE AOS CLIENTES QUE PAGEM EM DIA)