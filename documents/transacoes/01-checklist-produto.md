# 8️⃣ Transações (ACID)

Implementação de transações para garantir integridade e consistência dos dados financeiros.

---

## Transferência entre Contas — UI ✅

Funcionalidade que permite mover saldo de uma conta bancária para outra
dentro do sistema de forma atómica — se algo falhar, nenhuma das contas
é afectada. O utilizador selecciona a conta de origem, a conta de destino,
o valor e uma descrição opcional. O sistema cria dois lançamentos
automaticamente: uma despesa na conta de origem e uma receita na conta
de destino, com a mesma data e valor.

### Endpoint

- [ ] `POST /transactions/transfer` — transferência atómica entre contas

### UI

- [x] Tela de Transferência entre Contas → **prompt gerado**

---

---

## Conceitos Fundamentais

### Propriedades ACID

- [ ] Atomicidade - Tudo ou nada (commit/rollback)
- [ ] Consistência - Dados em estado válido após transação
- [ ] Isolamento - Transações não interferem entre si
- [ ] Durabilidade - Dados persistem após confirmação

---

## Transações Básicas

### Operações Simples

- [ ] Inserção de cliente com transação
- [ ] Inserção de cliente com rollback
- [ ] Atualização de telefone de cliente
- [ ] Exclusão de contato com rollback
- [ ] Alteração de nota de fornecedor
- [ ] Atualização de saldo com commit

---

## Transações Financeiras Críticas

### Operações com Múltiplas Tabelas

- [ ] Transferência de saldo entre contas (atomicidade garantida)
- [ ] Inserção de lançamento com atualização de saldo
- [ ] Inserção de múltiplos lançamentos com validação
- [ ] Inserção de cliente com múltiplos contactos
- [ ] Registro de pagamento parcial
- [ ] Cancelamento de lançamento com reversão de saldo

---

## Transações com Validação

### Validação de Regras Financeiras

- [ ] Atualização condicional de saldo (sem saldo negativo)
- [ ] Transferência entre contas com limite
- [ ] Parcelamento de lançamento em múltiplas parcelas
- [ ] Atualização de categoria com verificação débito/crédito
- [ ] Atualização em massa de clientes (sem lançamentos pendentes)
- [ ] Criação de lançamento e contacto simultâneos

---

## Níveis de Isolamento

### Configuração de Isolamento

- [ ] READ UNCOMMITTED - Leituras não confirmadas
- [ ] READ COMMITTED - Apenas dados confirmados (padrão)
- [ ] REPEATABLE READ - Evita leituras não repetíveis
- [ ] SERIALIZABLE - Ordem lógica completa (mais seguro)

---

## Problemas de Concorrência

### Cenários de Teste

- [ ] Dirty Read (Leitura Suja) - transação lê dado não confirmado
- [ ] Non-Repeatable Read - mesmo SELECT retorna valores diferentes
- [ ] Phantom Read - novas linhas aparecem entre leituras
- [ ] Lost Update (Atualização Perdida) - atualizações simultâneas sem controle
- [ ] Resolver Lost Update com SELECT FOR UPDATE

---

## Boas Práticas

### Implementação e Segurança

- [ ] Não deixar transações abertas por muito tempo
- [ ] Validar dados antes de iniciar transação
- [ ] Registrar/logar transações críticas
- [ ] Usar nível de isolamento adequado
- [ ] Evitar misturar muitas tabelas desnecessariamente
- [ ] Implementar retry logic para deadlocks
- [ ] Implementar exception handling apropriado

---

## Endpoints de Transação (Backend)

### Operações Transacionais

- [ ] `POST /transactions/transfer` - transferência entre contas
- [ ] `POST /transactions/payment` - registrar pagamento com validação
- [ ] `POST /clients` - criar cliente com contactos (transação)
- [ ] `POST /lancamentos/parcel` - criar lançamento parcelado
- [ ] `PUT /lancamentos/{id}/cancel` - cancelar com reversão
- [ ] `POST /lancamentos/bulk` - inserção em lote com transação

---

## Testes de Transação

### Validação e QA

- [ ] Teste commit com sucesso
- [ ] Teste rollback após erro
- [ ] Teste atomicidade em múltiplas tabelas
- [ ] Teste isolamento entre transações concorrentes
- [ ] Teste durabilidade após falha
- [ ] Teste deadlock handling
- [ ] Teste performance com transações longas
- [ ] Teste validação de dados antes de commit

---
