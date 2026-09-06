# Transações SQL

Material de estudo e prática de transações (ACID) no contexto do sistema financeiro.

## Ordem sugerida

| # | Ficheiro | Nível |
|---|---|---|
| 0 | [00-apostila-acid.md](./00-apostila-acid.md) | Teoria — ACID, COMMIT/ROLLBACK, isolamento |
| 1 | [01-checklist-produto.md](./01-checklist-produto.md) | Checklist do produto (transferência, endpoints) |
| 2 | [02-exercicios-iniciante.md](./02-exercicios-iniciante.md) | Exercícios 1–10 |
| 3 | [03-exercicios-intermediario.md](./03-exercicios-intermediario.md) | Exercícios 11–20 |
| 4 | [04-exercicios-avancado.md](./04-exercicios-avancado.md) | Exercícios 21–30 (concorrência) |

## Como praticar

1. Lê a apostila (ACID + comandos).
2. Faz os exercícios **iniciante** no `psql` (uma sessão).
3. Passa ao **intermediário** (validações e várias tabelas).
4. No **avançado**, abre **duas** sessões `psql` para simular concorrência.

## Nota

Isto é sobre **transações de base de dados** (`BEGIN` / `COMMIT` / `ROLLBACK`), não sobre o ecrã de lançamentos do frontend.
