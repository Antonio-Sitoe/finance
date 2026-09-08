---

## Ex. 1 — Inserção com COMMIT

**O que aprendes:** até ao `COMMIT`, outras sessões não vêem a linha.

1. `BEGIN`
2. `INSERT` num cliente
3. Noutra sessão: o `SELECT` ainda não encontra
4. `COMMIT` → passa a existir para todos

→ `01-insercao-cliente-commit.sql`

---

## Ex. 2 — Inserção com ROLLBACK

**O que aprendes:** `ROLLBACK` = deitar o rascunho fora; total de linhas não muda.

1. `BEGIN` + `INSERT`
2. Nesta sessão o registo aparece
3. `ROLLBACK`
4. O registo desaparece (também nesta sessão)

→ `02-insercao-cliente-rollback.sql`

---
