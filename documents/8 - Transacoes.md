# 8️⃣ Transações (ACID)

Implementação de transações para garantir integridade e consistência dos dados financeiros.

---

## Conceitos Fundamentais

### Propriedades ACID

* [ ] Atomicidade - Tudo ou nada (commit/rollback)
* [ ] Consistência - Dados em estado válido após transação
* [ ] Isolamento - Transações não interferem entre si
* [ ] Durabilidade - Dados persistem após confirmação

---

## Transações Básicas

### Operações Simples

* [ ] Inserção de cliente com transação
* [ ] Inserção de cliente com rollback
* [ ] Atualização de telefone de cliente
* [ ] Exclusão de contato com rollback
* [ ] Alteração de nota de fornecedor
* [ ] Atualização de saldo com commit

---

## Transações Financeiras Críticas

### Operações com Múltiplas Tabelas

* [ ] Transferência de saldo entre contas (atomicidade garantida)
* [ ] Inserção de lançamento com atualização de saldo
* [ ] Inserção de múltiplos lançamentos com validação
* [ ] Inserção de cliente com múltiplos contactos
* [ ] Registro de pagamento parcial
* [ ] Cancelamento de lançamento com reversão de saldo

---

## Transações com Validação

### Validação de Regras Financeiras

* [ ] Atualização condicional de saldo (sem saldo negativo)
* [ ] Transferência entre contas com limite
* [ ] Parcelamento de lançamento em múltiplas parcelas
* [ ] Atualização de categoria com verificação débito/crédito
* [ ] Atualização em massa de clientes (sem lançamentos pendentes)
* [ ] Criação de lançamento e contacto simultâneos

---

## Níveis de Isolamento

### Configuração de Isolamento

* [ ] READ UNCOMMITTED - Leituras não confirmadas
* [ ] READ COMMITTED - Apenas dados confirmados (padrão)
* [ ] REPEATABLE READ - Evita leituras não repetíveis
* [ ] SERIALIZABLE - Ordem lógica completa (mais seguro)

---

## Problemas de Concorrência

### Cenários de Teste

* [ ] Dirty Read (Leitura Suja) - transação lê dado não confirmado
* [ ] Non-Repeatable Read - mesmo SELECT retorna valores diferentes
* [ ] Phantom Read - novas linhas aparecem entre leituras
* [ ] Lost Update (Atualização Perdida) - atualizações simultâneas sem controle
* [ ] Resolver Lost Update com SELECT FOR UPDATE

---

## Boas Práticas

### Implementação e Segurança

* [ ] Não deixar transações abertas por muito tempo
* [ ] Validar dados antes de iniciar transação
* [ ] Registrar/logar transações críticas
* [ ] Usar nível de isolamento adequado
* [ ] Evitar misturar muitas tabelas desnecessariamente
* [ ] Implementar retry logic para deadlocks
* [ ] Implementar exception handling apropriado

---

## Endpoints de Transação (Backend)

### Operações Transacionais

* [ ] `POST /transactions/transfer` - transferência entre contas
* [ ] `POST /transactions/payment` - registrar pagamento com validação
* [ ] `POST /clients` - criar cliente com contactos (transação)
* [ ] `POST /lancamentos/parcel` - criar lançamento parcelado
* [ ] `PUT /lancamentos/{id}/cancel` - cancelar com reversão
* [ ] `POST /lancamentos/bulk` - inserção em lote com transação

---

## Testes de Transação

### Validação e QA

* [ ] Teste commit com sucesso
* [ ] Teste rollback após erro
* [ ] Teste atomicidade em múltiplas tabelas
* [ ] Teste isolamento entre transações concorrentes
* [ ] Teste durabilidade após falha
* [ ] Teste deadlock handling
* [ ] Teste performance com transações longas
* [ ] Teste validação de dados antes de commit

---

## Exercícios Práticos (30 Exercícios)

### Exercícios Básicos (1-10)

* [ ] Ex. 1 - Inserção de cliente com commit
* [ ] Ex. 2 - Inserção de cliente com rollback
* [ ] Ex. 3 - Atualização de telefone de cliente
* [ ] Ex. 4 - Exclusão de contato com rollback
* [ ] Ex. 5 - Alteração de nota de fornecedor
* [ ] Ex. 6 - Transferência de saldo entre contas
* [ ] Ex. 7 - Inserção de lançamento com atualização de conta
* [ ] Ex. 8 - Inserção de múltiplos lançamentos com validação
* [ ] Ex. 9 - Atualização de categoria com rollback condicional
* [ ] Ex. 10 - Alteração de situação de cliente com validação

---

### Exercícios Intermediários (11-20)

* [ ] Ex. 11 - Atualização condicional de saldo (sem saldo negativo)
* [ ] Ex. 12 - Inserção de cliente com múltiplos contactos
* [ ] Ex. 13 - Registro de pagamento parcial
* [ ] Ex. 14 - Cancelamento de lançamento com reversão
* [ ] Ex. 15 - Transferência entre contas com limite
* [ ] Ex. 16 - Atualização em massa de clientes inativos
* [ ] Ex. 17 - Parcelamento de lançamento em múltiplas parcelas
* [ ] Ex. 18 - Atualização de categoria com verificação débito/crédito
* [ ] Ex. 19 - Registro de pagamentos de múltiplos clientes
* [ ] Ex. 20 - Ajuste de saldo com backup de segurança

---

### Exercícios Avançados (21-30)

* [ ] Ex. 21 - Teste de LOST UPDATE (duas transações concorrentes)
* [ ] Ex. 22 - Resolver LOST UPDATE com SELECT FOR UPDATE
* [ ] Ex. 23 - Simular DIRTY READs com READ UNCOMMITTED
* [ ] Ex. 24 - Evitar DIRTY READs com READ COMMITTED
* [ ] Ex. 25 - Simular NON-REPEATABLE READ
* [ ] Ex. 26 - Resolver NON-REPEATABLE READ com REPEATABLE READ
* [ ] Ex. 27 - Testar PHANTOM READ (inserção fantasma)
* [ ] Ex. 28 - Evitar PHANTOM READ usando SERIALIZABLE
* [ ] Ex. 29 - Testar Deadlock com duas transações cruzadas
* [ ] Ex. 30 - Resolver deadlock reorganizando operações

---
