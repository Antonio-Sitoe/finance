# 3️⃣ Gestão de clientes

CRUD completo.

### Funcionalidades frontend

- [x] Criar cliente
- [x] Editar cliente
- [x] Listar clientes
- [x] Desativar cliente
- [x] Ver detalhes do cliente

### Filtros

- [x] Buscar por nome
- [x] Filtrar por status
      [x] - Estatisticas de clientes

---
# 4️⃣ Gestão de contactos

Contactos vinculados ao cliente.

### Funcionalidades

- [x] Criar contacto `POST /contacts`: criar contacto
- [x] Editar contacto
- [x] Listar contactos do cliente `GET /contacts`: listagem com filtros (cliente_id, departamento, situacao, q full-tet), ordenação, paginação page/limit
- [x] Desativar contacto
- [x] Ver detalhes do contacto - `GET /contacts/{id}`: obter contacto (opcional ?include=client para join)
- [] criar contacto vinculado a empresa

---
### Filtros
- [x] Buscar por nome
- [x] Filtrar por departamento
- [x] Filtrar por situação


**Estatísticas por contactos / Relatórios**

- [x]`GET /contacts/stats/count-by-client`: quantos contactos por cliente (top N)

---

# 5️⃣ Gestão de fornecedores (back and front)

CRUD igual ao cliente.

### Funcionalidades

- [x] Criar fornecedor
- [x] Editar fornecedor
- [x] Listar fornecedores
- [x] Desativar fornecedor

---

Filtros:

- [x] Nome
- [x] Estatisticas de fornecedores

---


# 6️⃣ Gestão de contas (bancárias / caixa)

Representa contas financeiras.

### Funcionalidades

- [x] Criar conta
- [x] Editar conta
- [x] Listar contas
- [x] Desativar conta

---

# 7️⃣ Gestão de categorias financeiras

Categorias hierárquicas.

### Funcionalidades

- [x] desenhar UIS
- [x] Criar categoria
- [x] Editar categoria
- [x] Excluir categoria
- [x] Listar categorias
- [x] Criar subcategoria
- [x] Estatisticas


---

# 1️⃣1️⃣ Pesquisa Global

Pesquisa unificada em todo o sistema. Acessível pela topbar em qualquer página.

* [x] Buscar cliente (por nome ou email)
* [x] Buscar fornecedor (por nome)
* [x] Buscar lançamento (por descrição)

Retorna até 5 resultados por entidade com id, tipo, título, subtítulo e URL
de navegação directa para o registo.

**Endpoint:** `GET /analitics/search?q={termo}`

**Dois modos:**
- Dropdown rápido na topbar (resultados inline ao digitar)
- Página completa `/search?q={termo}` ao pressionar Enter


----
# 8️⃣ Gestão de lançamentos financeiros

Esse é **o módulo principal do sistema**.

### Parcelamento

* [x] Criar lançamento parcelado
* [x] Gerar parcelas automaticamente

### Filtros
Muito importantes.
* [x] Filtrar por categoria
* [x] Filtrar por cliente
* [x] Filtrar por fornecedor
* [x] Filtrar por conta
* [x] Filtrar por status

### Funcionalidades

* [X] Criar lançamento
* [X] Editar lançamento
* [X] Excluir lançamento
* [X] Marcar como pago
* [X] Marcar como pendente
* [X]  criar/atualizar em lote (CSV/JSON), com validação por linha e resumo de erros
* [X] `GET /lancamentos/export`: import/export CSV/Excel



---------------
# 2️⃣ Dashboard — Tela Inicial do Sistema

Tela inicial do sistema. Acessível por ADMIN e USER.
Responde às perguntas mais urgentes do dia sem precisar de navegar.

---

## Bloco 1 — KPIs Principais (6 indicadores)

* [x] Total de receitas do mês (lançamentos RECEITA + PAGO)
* [x] Total de despesas do mês (lançamentos DESPESA + PAGO)
* [x] Saldo actual (total acumulado de todas as contas)

* [x] Resultado do mês (receitas − despesas) ← **adicionar ao backend** (`resultadoMes` no DashboardDTO)
* [x] Contas a pagar (lançamentos DESPESA + PENDENTE)
* [x] Contas a receber (lançamentos RECEITA + PENDENTE)

**Endpoint actual:** `GET /analitics/dashboard`
**Pendente:** adicionar campo `resultadoMes` ao `DashboardDTO`

---

## Bloco 2 — Alertas de Acção

Elementos que exigem atenção imediata. Cada alerta tem link directo
para a lista de lançamentos com o filtro correspondente pré-aplicado.

* [x] Receitas vencidas — count + valor total (RECEITA + PENDENTE + vencimento < hoje)
* [x] Despesas vencidas — count + valor total (DESPESA + PENDENTE + vencimento < hoje)
* [x] Vencimentos hoje — lista dos lançamentos que vencem exactamente hoje

**Cálculo:** frontend via `GET /lancamentos` com filtros de data e situação.

---

## Bloco 3 — Contexto Financeiro

* [x] Saldo por conta bancária (mini lista com nome + saldo de cada conta)
  → **novo endpoint necessário:** `GET /analitics/saldo-por-conta`

* [x] Evolução dos últimos 6 meses — gráfico receitas vs despesas
  → via `GET /analitics/relatorio-anual` (frontend usa só os últimos 6 meses)
  
* [x] Top 3 categorias de despesa do mês
  → via `GET /analitics/relatorio-categoria`
 
---

## Bloco 4 — Operacional

* [x] Acções rápidas: + Novo Lançamento, + Nova Despesa, Importar CSV
* [x] Últimos 5 lançamentos registados no sistema

---


Tela para visualizar movimentações.

### Funcionalidades

* [x] Listar lançamentos por período
* [x] Calcular saldo
* [x] Mostrar receitas
* [x] Mostrar despesas

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
