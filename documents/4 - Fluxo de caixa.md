# Fluxo de Caixa

Página: **`/fluxo-de-caixa`**

Análise operacional do dinheiro: o que entrou, o que saiu, resultado por categoria, posição de curto prazo e projecção.

---

## Contexto do projecto (regras de domínio)

Estas regras aplicam-se a **todas** as abas:

| Conceito | No sistema |
|----------|------------|
| Tipos | `RECEITA` · `DESPESA` |
| Situações persistidas | `PAGO` · `PENDENTE` |
| “Vencido” | **Não é enum** — é `PENDENTE` + `data_vencimento < hoje` (já usado nos alertas do dashboard) |
| Moeda | **MT** (Metical) |
| Período | Filtro global no topo (semana / mês / trimestre / ano / personalizado) |
| Export | CSV na 1.ª fase; Excel depois |
| Prefixo API | `/api/analitics/...` |

Categorias têm `credito` / `debito` e hierarquia pai/filho, mas **não** têm natureza contabilística (directa vs operacional). Por isso o DRE é um **mini DRE**.

---

## Abas

| Aba | Estado | Endpoint |
|-----|--------|----------|
| Fluxo Diário | Feito | `GET /analitics/fluxo-diario` |
| Mini DRE | Por fazer | `GET /analitics/dre` |
| Capital de Giro | Por fazer | `GET /analitics/capital-giro` |
| Recebimentos vs Pagamentos | Por fazer | `GET /analitics/recebimentos-pagamentos` |
| Projecção de Caixa | Por fazer | `GET /analitics/projecao-caixa` |

---

## 2. Mini DRE — [ ]

Resultado do período por categoria (só `PAGO`).

### O que mostra
- Receitas totais, agrupadas por categoria
- Despesas totais, agrupadas por categoria
- **Resultado líquido** = Receitas − Despesas

> Sem lucro bruto / operacional — o modelo não distingue despesas directas de operacionais.

### Regras
- Mesmo período global da página
- Só `PAGO`
- Sem categoria → `"Sem categoria"`

### Layout

```
RECEITAS TOTAIS                          MT 45.000,00
  ├─ Vendas                              MT 30.000,00
  ├─ Serviços                            MT 12.000,00
  └─ Outras                               MT 3.000,00

DESPESAS TOTAIS                         (MT 28.000,00)
  ├─ Fornecedores                       (MT 10.000,00)
  ├─ Salários                            (MT 8.000,00)
  └─ Administrativas                     (MT 5.000,00)

─────────────────────────────────────────────────────
RESULTADO LÍQUIDO                        MT 17.000,00
```

### UI
- Positivos a verde; negativos a vermelho com parênteses
- Resultado em destaque
- Clicar categoria → lançamentos (descrição, conta, valor, data)
- Export CSV

### API
`GET /api/analitics/dre?de=&ate=&incluirDetalhes=true`

---

## 3. Capital de Giro — [ ]

Posição de curto prazo com base em títulos **ainda em aberto e não vencidos**.

### O que mostra
- **Activo circulante** = `RECEITA` + `PENDENTE` + `data_vencimento >= hoje`
- **Passivo circulante** = `DESPESA` + `PENDENTE` + `data_vencimento >= hoje`
- **Capital de giro** = Activo − Passivo
- **Liquidez corrente** = Activo ÷ Passivo (se passivo = 0, mostrar `—`)

> Não é um balanço contabilístico completo — é a leitura possível com lançamentos.

### UI
- 4 cartões KPI
- Lista opcional: top títulos a receber / a pagar (valor + vencimento)
- Export CSV

### API
`GET /api/analitics/capital-giro`

*(Sem filtro de período obrigatório: reflecte a posição actual. Opcional: `ate=` para “posição à data”.)*

---

## 4. Recebimentos vs Pagamentos — [ ]

Eficiência: o que estava previsto vs o que foi liquidado no período.

### Métricas (no período)

**Recebimentos (`RECEITA`)**
| Métrica | Critério |
|---------|----------|
| Total previsto | `PENDENTE` (vencimento no período) |
| Total recebido | `PAGO` (data de lançamento/pagamento no período) |
| Taxa de recebimento | Recebido ÷ (Recebido + Previsto) |
| Em atraso | `PENDENTE` + `data_vencimento < hoje` |

**Pagamentos (`DESPESA`)** — mesma lógica.

### UI
- Duas colunas 50/50 (Recebimentos | Pagamentos)
- Barra de progresso da taxa
- Gráfico de barras: Previsto vs Realizado por mês do período
- Clicar “Em atraso” → `/lancamentos` com `situacao=PENDENTE` (vencidos calculados no ecrã ou via query de datas)
- Export CSV

### API
`GET /api/analitics/recebimentos-pagamentos?de=&ate=`

---

## 5. Projecção de Caixa (30 / 60 / 90 dias) — [ ]

Olhar para a frente com base em títulos `PENDENTE` futuros + saldo actual.

### O que mostra
| Período | Entradas | Saídas | Saldo projectado | Risco |
|---------|----------|--------|------------------|-------|
| 30 dias | … | … | … | Baixo / Médio / Alto |
| 60 dias | … | … | … | … |
| 90 dias | … | … | … | … |

### Regras
- **Saldo inicial** = soma de `PAGO` até hoje (mesma lógica do fluxo diário)
- **Entradas previstas** = `RECEITA` + `PENDENTE` com `data_vencimento` nos próximos N dias
- **Saídas previstas** = `DESPESA` + `PENDENTE` com `data_vencimento` nos próximos N dias
- **Saldo projectado** = Saldo inicial + Entradas − Saídas (acumulado por horizonte)
- **Risco** = baseado em valor já vencido (`PENDENTE` + vencimento &lt; hoje):
  - Baixo: vencido = 0 ou &lt; 10% do saldo inicial
  - Médio: 10–30%
  - Alto: &gt; 30% (ou saldo projectado negativo)

### UI
- Tabela dos 3 horizontes
- Destaque se saldo projectado &lt; 0
- Export CSV

### API
`GET /api/analitics/projecao-caixa`

---

## Ordem de implementação sugerida

1. **Mini DRE** — reutiliza padrão do fluxo diário (período + PAGO + detalhes)
2. **Recebimentos vs Pagamentos** — usa `PENDENTE`/`PAGO` e a noção de vencido já existente nos alertas
3. **Projecção de Caixa** — extensão natural do saldo + pendentes futuros
4. **Capital de Giro** — agregado simples da posição actual
5. Polimento: Excel real + cor condicional nos KPIs do fluxo diário

---

## Checklist

### Shell da página
- [x] Rota `/fluxo-de-caixa`
- [x] Filtro de período global
- [x] Abas (4 ainda desactivadas)
- [x] Export CSV no Fluxo Diário

### Relatórios
- [x] Fluxo Diário
- [ ] Mini DRE
- [ ] Capital de Giro
- [ ] Recebimentos vs Pagamentos
- [ ] Projecção de Caixa
