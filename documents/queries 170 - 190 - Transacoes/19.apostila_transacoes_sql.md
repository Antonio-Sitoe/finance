# Apostila: Transações em SQL

## 1. Introdução às Transações
Transações são conjuntos de operações SQL que devem ser executadas como uma única unidade lógica de trabalho. O objetivo é garantir **integridade**, **consistência** e **segurança** dos dados, mesmo em situações de falhas no sistema, concorrência ou cancelamento.

Uma transação deve ser **completa, correta e segura**.

---

## 2. Conceito de ACID
Uma transação é considerada confiável quando segue as propriedades **ACID**:

### 2.1 Atomicidade
Tudo ou nada. Se uma operação falhar, toda a transação é revertida.

### 2.2 Consistência
Após a transação, os dados permanecem em um estado válido, seguindo regras e restrições do banco.

### 2.3 Isolamento
Transações concorrentes não interferem umas nas outras.

### 2.4 Durabilidade
Depois de concluída (COMMIT), a transação permanece salva, mesmo em caso de falhas.

---

## 3. Comandos Básicos de Transação
A maioria dos bancos de dados (PostgreSQL, MySQL, SQL Server, Oracle) utiliza estes comandos:

### 3.1 `BEGIN` ou `START TRANSACTION`
Inicia uma transação.

### 3.2 `COMMIT`
Confirma todas as operações realizadas na transação.

### 3.3 `ROLLBACK`
Desfaz todas as operações realizadas desde o início da transação.

---

## 4. Exemplo Simples de Transação
Imagine mover saldo entre duas contas bancárias:

```sql
BEGIN;

UPDATE conta SET saldo = saldo - 200 WHERE id = 1;
UPDATE conta SET saldo = saldo + 200 WHERE id = 2;

COMMIT;
```
Se algo falhar durante o processo, usamos:
```sql
ROLLBACK;
```

---

## 5. Transações com Verificação de Erros
É recomendado validar antes de aplicar alterações:

```sql
BEGIN;

UPDATE conta SET saldo = saldo - 500 WHERE id = 3;

-- Verificação (exemplo conceitual)
-- Se saldo ficar negativo, fazemos rollback

ROLLBACK;
```

---

## 6. Níveis de Isolamento
Controlam como transações simultâneas enxergam os dados.

1. **READ UNCOMMITTED** – pode ler dados não confirmados (sujo).
2. **READ COMMITTED** – só lê dados confirmados. (Padrão PostgreSQL)
3. **REPEATABLE READ** – evita leituras não repetíveis.
4. **SERIALIZABLE** – garante ordem lógica; o mais seguro.

Exemplo:
```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

---

## 7. Problemas Resolvidos por Transações
Sem transações, diversos erros poderiam ocorrer:

### 7.1 Dirty Read (Leitura Suja)
Uma transação lê algo que ainda não foi confirmado.

### 7.2 Non-Repeatable Read
Uma linha é alterada por outra transação enquanto você a lê.

### 7.3 Phantom Read
Novas linhas aparecem entre leituras consecutivas.

### 7.4 Lost Update (Atualização Perdida)
Atualizações simultâneas sem controle de concorrência.

---

## 8. Transações em Manipulação de Lançamentos
Exemplo aplicado ao contexto de um sistema financeiro:

```sql
BEGIN;

INSERT INTO lancamento (parcela, total_parcela, valor, id_cliente, id_categoria, id_conta)
VALUES (1, 3, 150.00, 12, 4, 2);

UPDATE conta
SET saldo = saldo - 150.00
WHERE id = 2;

COMMIT;
```

Se a inserção for bem-sucedida, mas o update falhar → rollback.

---

## 9. Boas Práticas
- Não deixar transações abertas por muito tempo.
- Validar dados antes de iniciar uma transação.
- Evitar misturar muitas tabelas sem necessidade.
- Usar o nível de isolamento adequado ao caso.
- Logar transações críticas.

---

## 10. Conclusão
Transações são essenciais para garantir segurança, consistência e controle em sistemas que manipulam dados críticos. Entender como iniciar, confirmar, desfazer e isolar transações é fundamental para qualquer desenvolvedor SQL.

Se quiser, posso adicionar exercícios, exemplos avançados ou uma seção sobre transações com stored procedures.

