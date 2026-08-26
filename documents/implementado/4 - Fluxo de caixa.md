# Fluxo de Caixa

**Base path:** `GET /api/cash-flow/...`

---

## 1. Fluxo Diário — [x] Backend ✅ | Frontend ✅

Movimentações dia a dia para o período indicado, com saldo acumulado.

### Lógica
- Considera apenas lançamentos `situacao = PAGO`
- **Saldo inicial** = soma de todos os lançamentos PAGO com `data_lancamento < de`
- **Entradas/saídas** por dia = agrupamento por `data_lancamento` no período
- **Saldo acumulado** = saldo inicial + entradas − saídas, propagado dia a dia

### API
```
GET /api/cash-flow/fluxo-diario?de=2025-05-01&ate=2025-05-31&incluirDetalhes=true
```

**Parâmetros:**
| Param | Tipo | Obrigatório | Default |
|---|---|---|---|
| `de` | `LocalDate` | Sim | — |
| `ate` | `LocalDate` | Sim | — |
| `incluirDetalhes` | `boolean` | Não | `true` |

**Resposta `FluxoDiarioDTO`:**
```json
{
  "de": "2025-05-01",
  "ate": "2025-05-31",
  "saldoInicial": 5000.00,
  "totalEntradas": 12000.00,
  "totalSaidas": 8000.00,
  "saldoFinal": 9000.00,
  "dias": [
    {
      "dia": "2025-05-01",
      "entradas": 3000.00,
      "saidas": 1500.00,
      "saldoAcumulado": 6500.00,
      "lancamentos": [...]
    }
  ]
}
```

---

## 2. Mini DRE — [x] Backend ✅ | Frontend ✅

Demonstração de Resultado do período: receitas vs despesas por categoria.

### Lógica
- Considera apenas lançamentos `situacao = PAGO` e `data_lancamento` no período
- Agrupa por categoria e tipo (RECEITA / DESPESA)
- Calcula % de participação de cada categoria no total
- **Resultado líquido** = total receitas − total despesas
- **Margem** = resultado ÷ total receitas × 100

### API
```
GET /api/cash-flow/dre?de=2025-05-01&ate=2025-05-31
```

**Resposta `DreDTO`:**
```json
{
  "de": "2025-05-01",
  "ate": "2025-05-31",
  "resumo": {
    "totalReceitas": 15000.00,
    "totalDespesas": 10000.00,
    "resultadoLiquido": 5000.00,
    "margemPercentual": 33.3
  },
  "receitas": [ { "categoriaId": 1, "nome": "Vendas", "total": 15000.00, "percentual": 100.0, "lancamentos": [...] } ],
  "despesas": [ { "categoriaId": 2, "nome": "Salários", "total": 8000.00, "percentual": 80.0, "lancamentos": [...] } ]
}
```

---

## 3. Capital de Giro — [x] Backend ✅ | Frontend ✅

Posição de curto prazo com base em títulos **em aberto e não vencidos**.

### Lógica
- **Activo circulante** = soma de `RECEITA + PENDENTE + data_vencimento >= hoje`
- **Passivo circulante** = soma de `DESPESA + PENDENTE + data_vencimento >= hoje`
- **Capital de giro** = Activo − Passivo
- **Liquidez corrente** = Activo ÷ Passivo (se passivo = 0 → `null`)
- Top títulos a receber / a pagar (ordenados por valor decrescente)

> Não é um balanço contabilístico completo — é a leitura possível com os lançamentos existentes.

### API
```
GET /api/cash-flow/capital-giro
```
*(Sem parâmetros — reflecte a posição actual)*

**Resposta `CapitalGiroDTO`:**
```json
{
  "activoCirculante": 20000.00,
  "passivoCirculante": 12000.00,
  "capitalDeGiro": 8000.00,
  "liquidezCorrente": 1.67,
  "titulosAReceber": [ { "descricao": "...", "valor": 5000.00, "vencimento": "2025-06-15", "cliente": "..." } ],
  "titulosAPagar": [ { "descricao": "...", "valor": 3000.00, "vencimento": "2025-06-10", "fornecedor": "..." } ]
}
```

---

## 4. Recebimentos vs Pagamentos — [x] Backend ✅ | Frontend ✅

Eficiência: o que estava previsto vs o que foi liquidado no período.

### Lógica

**Recebimentos (`RECEITA`):**
- **Previsto** = `PENDENTE` com `data_vencimento` no período
- **Realizado** = `PAGO` com `data_lancamento` no período
- **Taxa** = Realizado ÷ (Realizado + Previsto) × 100
- **Em atraso** = `PENDENTE` + `data_vencimento < hoje` (posição actual, não filtrada por período)

**Pagamentos (`DESPESA`)** — mesma lógica.

**Evolução mensal** = Previsto vs Realizado por mês dentro do período (para gráfico de barras).

### API
```
GET /api/cash-flow/recebimentos-pagamentos?de=2025-01-01&ate=2025-05-31
```

**Resposta `InnerRecebimentosPagamentosDTO`:**
```json
{
  "de": "2025-01-01",
  "ate": "2025-05-31",
  "recebimentos": {
    "previsto": 30000.00,
    "realizado": 22000.00,
    "taxaPercentual": 42.3,
    "emAtraso": 5000.00
  },
  "pagamentos": {
    "previsto": 20000.00,
    "realizado": 18000.00,
    "taxaPercentual": 47.4,
    "emAtraso": 1200.00
  },
  "evolucaoMensal": [
    { "mes": "2025-01", "previsto": 6000.00, "realizado": 4500.00 }
  ]
}
```

---

## 5. Projecção de Caixa (30 / 60 / 90 dias) — [x] Backend ✅ | Frontend ✅

Olhar para a frente com base em títulos `PENDENTE` futuros + saldo actual.

### Lógica
- **Saldo actual** = soma de todos os lançamentos `PAGO` (RECEITA − DESPESA)
- **Entradas/saídas previstas** por horizonte = `PENDENTE` com `data_vencimento` nos próximos N dias
- **Saldo projectado** = Saldo actual + Entradas − Saídas (por horizonte)
- **Risco de inadimplência** = Total vencido (`RECEITA + PENDENTE + vencido`) ÷ saldo actual × 100
- **Horizonte activo de referência** = 90 dias (variação percentual calculada com base no H90)

**Classificação de risco por horizonte:**
| Condição | Risco |
|---|---|
| Saldo projectado < 0 OU risco > 30% | ALTO |
| Risco entre 10% e 30% | MEDIO |
| Risco < 10% | BAIXO |

**Risco por devedor:**
| Dias até vencimento | Risco |
|---|---|
| Já vencido (< 0 dias) | ALTO |
| 0 – 30 dias | MEDIO |
| > 30 dias | BAIXO |

**Insights automáticos gerados:**
- Saldo projectado negativo → alerta
- Títulos vencidos em aberto → alerta com % do saldo
- Entradas > saídas → oportunidade
- Saídas > entradas → alerta

### API
```
GET /api/cash-flow/projecao-caixa
```
*(Sem parâmetros — usa hoje como referência)*

**Resposta `ProjecaoCaixaDTO`:**
```json
{
  "horizonteActivo": 90,
  "saldoAtual": 10000.00,
  "entradasPrevistas": 15000.00,
  "saidasPrevistas": 8000.00,
  "saldoProjetado": 17000.00,
  "variacaoPercentual": 70.0,
  "riscoInadimplenciaPercentual": 5.0,
  "impactoRisco": 500.00,
  "horizontes": [
    { "dias": 30, "entradas": 4000.00, "saidas": 2000.00, "saldoProjetado": 12000.00, "risco": "BAIXO", "riscoPercentual": 5.0 },
    { "dias": 60, "entradas": 9000.00, "saidas": 5000.00, "saldoProjetado": 14000.00, "risco": "BAIXO", "riscoPercentual": 5.0 },
    { "dias": 90, "entradas": 15000.00, "saidas": 8000.00, "saldoProjetado": 17000.00, "risco": "BAIXO", "riscoPercentual": 5.0 }
  ],
  "insights": [
    { "tipo": "oportunidade", "titulo": "Fluxo positivo previsto", "descricao": "..." }
  ],
  "principaisDevedores": [
    { "id": 1, "nome": "Cliente X", "valor": 3000.00, "venceEmDias": 15, "risco": "MEDIO" }
  ]
}
```

---

## Checklist

### Backend
- [x] Fluxo Diário — `GET /api/cash-flow/fluxo-diario`
- [x] Mini DRE — `GET /api/cash-flow/dre`
- [x] Capital de Giro — `GET /api/cash-flow/capital-giro`
- [x] Recebimentos vs Pagamentos — `GET /api/cash-flow/recebimentos-pagamentos`
- [x] Projecção de Caixa — `GET /api/cash-flow/projecao-caixa`

### Frontend
- [x] Rota `/fluxo-de-caixa`
- [x] Filtro de período global
- [x] Abas (tabs)
- [x] Fluxo Diário
- [x] Mini DRE
- [x] Capital de Giro
- [x] Recebimentos vs Pagamentos
- [x] Projecção de Caixa
