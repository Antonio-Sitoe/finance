# Exercícios essenciais de transações

Só os casos que ensinam algo útil para o finance (e para o Spring `@Transactional`).
Corre **statement a statement**, não o ficheiro inteiro de uma vez.

No Spring: `BEGIN` ≈ entrar no `@Transactional` · `COMMIT` ≈ método ok · `ROLLBACK` ≈ excepção.

Scripts SQL: `backend/src/main/resources/db/transactios/`.

## Índice

- [x] Ex. 1 — COMMIT (ver que fica permanente)
- [x] Ex. 2 — ROLLBACK (ver que some tudo)
- [x] Ex. 3 — Transferência entre contas (2 escritas atómicas) ← liga ao produto
- [ ] Ex. 4 — Cliente + 2 contactos (2 tabelas)
- [ ] Ex. 5 — Parcelamento (N inserts, tudo ou nada)
- [ ] Ex. 6 — Lost update + `SELECT FOR UPDATE` (concorrência)

## Ex. 3 — Transferência entre contas (atómica)

**O que aprendes:** duas escritas têm de ir juntas — senão o dinheiro “desaparece”.  
No vosso modelo **não há coluna** `saldo` **em** `contas`: o saldo vem dos lançamentos. A transferência = 1 `DESPESA` na origem + 1 `RECEITA` no destino.

**Tabelas:** `lancamentos` (+ `contas` existentes)

1. Escolhe duas contas activas (`id` origem e destino).
2. `BEGIN`
3. `INSERT` despesa `PENDENTE`/`PAGO` na conta origem (valor X)
4. `INSERT` receita na conta destino (mesmo valor X, mesma descrição/base)
5. Se o 2.º insert falhar → `ROLLBACK` (a despesa também some)
6. Se ambos ok → `COMMIT`

**No Spring:** um método `@Transactional` que faz os dois `save` — é o futuro `POST /transactions/transfer`.

### Transferência entre contas

UI: já há prompt/tela.
Backend: ainda falta o endpoint atómico.

- [ ] `POST /api/lancamentos/transfer` (ou `/transactions/transfer`)
  - cria **DESPESA** na conta origem
  - cria **RECEITA** na conta destino
  - mesmo valor / descrição base / data
  - um único `@Transactional` — se o 2.º save falhar, o 1.º também reverte

---

## Ex. 4 — Cliente + múltiplos contactos

**O que aprendes:** atomicidade em **duas tabelas** relacionadas.

**Tabelas:** `clientes`, `contactos`

1. `BEGIN`
2. `INSERT` cliente → guarda o `id` (`RETURNING id`)
3. `INSERT` 2 contactos com esse `cliente_id`
4. Se o 2.º contacto falhar (email duplicado, etc.) → `ROLLBACK` (cliente também some)
5. Senão → `COMMIT`

**No Spring:** criar cliente + contactos no mesmo `@Transactional`.

---

## Ex. 5 — Parcelamento (tudo ou nada)

**O que aprendes:** N inserts na mesma tx — ou ficam as 3 parcelas, ou nenhuma.  
Já tens isto no app: `LancamentoService.criarParcelado` + `saveAll`.

**Tabela:** `lancamentos`

1. `BEGIN`
2. `INSERT` 3 linhas (parcela 1/3, 2/3, 3/3), mesmo cliente/conta/categoria, valores que somam o total
3. Se alguma falhar → `ROLLBACK`
4. Senão → `COMMIT`
5. Confirma com `SELECT` que existem exactamente 3 (ou 0)

---

## Ex. 6 — Lost update + `FOR UPDATE`

**O que aprendes:** duas sessões a actualizar a mesma linha podem pisar-se; `SELECT … FOR UPDATE` serializa.

Usa por exemplo a coluna `nota` de um `clientes` (qualquer linha estável).

### 6a — Ver o problema (duas sessões)

1. Sessão A: `BEGIN; SELECT nota FROM clientes WHERE id = ?;`
2. Sessão B: `BEGIN; SELECT nota FROM clientes WHERE id = ?;` (mesmo id)
3. A: `UPDATE … SET nota = <valor_lido_A + 1>; COMMIT;`
4. B: `UPDATE … SET nota = <valor_lido_B + 1>; COMMIT;`
5. O resultado final: só +1 em vez de +2? → lost update

### 6b — Corrigir

1. Sessão A: `BEGIN; SELECT nota FROM clientes WHERE id = ? FOR UPDATE;`
2. Sessão B tenta o mesmo `FOR UPDATE` → **espera**
3. A actualiza e `COMMIT`
4. B desbloqueia, lê o valor já actualizado, soma 1, `COMMIT`
5. Resultado: +2 correcto

**No Spring:** em updates críticos de saldo/contadores, locking pessimista (`LockModeType.PESSIMISTIC_WRITE`) ou update atómico (`SET nota = nota + 1`).

---
