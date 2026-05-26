# 9️⃣ Fluxo de caixa

Tela para visualizar movimentações.

### Funcionalidades

* [ ] Listar lançamentos por período
* [ ] Calcular saldo
* [ ] Mostrar receitas
* [ ] Mostrar despesas

### Relatório de Fluxo de Caixa Diário
Gerar um relatório que mostre o fluxo de caixa diário com excell:

- Data
- Entradas (total de créditos do dia)
- Saídas (total de débitos do dia)
- Saldo do dia
- Saldo acumulado

Por exemplo:
| Data       | Entradas | Saídas  | Saldo Dia | Saldo Acumulado |
|------------|----------|---------|-----------|-----------------|
| 2025-12-01 | 5000.00  | 2000.00 | 3000.00   | 3000.00         |

Objetivo: Mostrar dia a dia o que entrou e saiu, e como o saldo evoluiu.

Layout desta aba:

Faixa de KPIs no topo (4 cartões): Saldo Inicial do Período | Total de Entradas | Total de Saídas | Saldo Final
Entradas em verde, Saídas em vermelho, Saldo com cor condicional (verde se positivo, vermelho se negativo)
Tabela principal abaixo, uma linha por dia do período seleccionado:
Data	Entradas	Saídas	Saldo do Dia	Saldo Acumulado
01/05/2025	5.000,00	2.000,00	+3.000,00	3.000,00
Linhas com Saldo do Dia negativo destacadas em vermelho suave
Dias sem movimento mostrados com traço (—) e saldo acumulado continuado
Linha de totais fixada no rodapé da tabela
Interações:

Clicar numa linha expande um painel inline listando os lançamentos individuais daquele dia (descrição, conta, categoria, valor, situação)
Botão "Exportar Excel" gera o ficheiro com a tabela completa



### Relatório de Demonstrativo de Resultado (DRE)
Gerar um relatório contábil que mostre (EXCELL):

- Receitas por categoria
- Despesas por categoria
- Lucro Bruto (Receitas - Despesas Diretas)
- Despesas Operacionais
- Lucro Operacional
- Lucro Líquido

Objetivo: Visão contabilística: receitas por categoria vs despesas por categoria, até ao lucro líquido.

Layout desta aba:

Estrutura em árvore / lista hierárquica, semelhante a um extrato contabilístico:

RECEITAS TOTAIS                          R$ 45.000,00
  ├─ Vendas de Produtos                  R$ 30.000,00
  ├─ Serviços Prestados                  R$ 12.000,00
  └─ Outras Receitas                      R$ 3.000,00

DESPESAS TOTAIS                         (R$ 28.000,00)
  ├─ Custo de Mercadorias                (R$ 10.000,00)
  ├─ Salários e Encargos                  (R$ 8.000,00)
  └─ Despesas Administrativas             (R$ 5.000,00)

─────────────────────────────────────────────────────
RESULTADO OPERACIONAL                    R$ 17.000,00
Cada categoria é expansível para ver os lançamentos individuais
Valores positivos em verde, negativos em vermelho com parênteses
Resultado final em destaque, fonte maior, fundo diferenciado
Interações:

Clicar numa categoria expande os lançamentos que a compõem
Botão "Exportar" gera o DRE em formato Excel



### Relatório de Capital de Giro (EXCELL)
Gerar um relatório que mostre:

- Ativo Circulante (contas a receber não vencidas)
- Passivo Circulante (contas a pagar não vencidas)
- Capital de Giro (Ativo - Passivo)
- Índice de Liquidez Geral

### Relatório de Análise de Recebimentos e Pagamentos
Gerar um relatório que compare:

- Total a Receber (pendente)
- Total Recebido (pago)
- Taxa de Recebimento (Recebido / A Receber)
- Total a Pagar (pendente)
- Total Pago (pago)
- Taxa de Pagamento (Pago / A Pagar)

Por exemplo:
| Métrica | Valor |
|---------|-------|
| Total a Receber | 15000.00 |
| Taxa de Recebimento | 75% |

Objetivo: Comparar eficiência de cobrança e de pagamento — quanto estava previsto vs quanto foi efectivamente processado.

Layout desta aba:

Duas secções lado a lado (50/50):
Recebimentos (RECEITA)

Métrica	Valor
Total Previsto (PENDENTE)	R$ 15.000,00
Total Recebido (PAGO)	R$ 11.250,00
Taxa de Recebimento	75%
Em atraso (VENCIDO)	R$ 2.500,00
Barra de progresso visual: 75% preenchida em verde, restante em cinza
Pagamentos (DESPESA)

Métrica	Valor
Total Previsto (PENDENTE)	R$ 8.000,00
Total Pago (PAGO)	R$ 6.400,00
Taxa de Pagamento	80%
Em atraso (VENCIDO)	R$ 800,00
Barra de progresso visual: 80% preenchida em azul, restante em cinza

Abaixo: gráfico de barras agrupadas mostrando Previsto vs Realizado para cada mês do período seleccionado (eixo X = meses, eixo Y = valores)

Interações:

Clicar em "Em atraso" navega para Lançamentos com filtro VENCIDO pré-aplicado

### Relatório de Projeção de Caixa (30, 60, 90 dias) (EXCEL)
Gerar um relatório de projeção futura mostrando:

- Saldo inicial
- Entradas previstas (próximos 30, 60, 90 dias)
- Saídas previstas (próximos 30, 60, 90 dias)
- Saldo projetado para cada período
- Risco de inadimplência (contas vencidas)

Por exemplo:
| Período | Entradas | Saídas | Saldo Projetado | Risco |
|---------|----------|--------|-----------------|-------|
| 30 dias | 8000.00 | 5000.00 | 12000.00 | Baixo |


---

### Indicadores

* [ ] Saldo inicial
* [ ] Entradas
* [ ] Saídas
* [ ] Saldo final

---