# Flyway — Controlo de Migrações de Base de Dados

## O que é o Flyway

Flyway é uma ferramenta de **versionamento de schema de base de dados**. Em vez de o Hibernate alterar as tabelas automaticamente (DDL auto), o Flyway controla **cada mudança** através de ficheiros SQL com versão numerada.

---

## Por que foi adicionado

| Antes (Hibernate `update`) | Depois (Flyway `validate`) |
|---|---|
| Hibernate altera tabelas automaticamente ao arrancar | Flyway aplica os ficheiros SQL em ordem |
| Alterações são imprevisíveis em produção | Cada alteração é registada e auditada |
| Impossível reverter mudanças | Histórico completo de migrações |
| Não há como recriar o schema noutro ambiente | Script V1 recria o schema do zero |

---

## Como funciona

### 1. Ficheiros de migração
Os ficheiros ficam em:
```
src/main/resources/db/migration/
```

### 2. Convenção de nomenclatura
```
V{versão}__{descrição}.sql
```

Exemplos:
```
V1__init.sql              ← Schema inicial (todas as tabelas)
V2__add_saldo_conta.sql   ← Adicionar coluna saldo à tabela contas
V3__index_lancamentos.sql ← Criar índice de performance
```

**Regras:**
- `V` maiúsculo
- Dois underscores `__` entre versão e descrição
- Versão pode ser `1`, `1.1`, `2`, etc.
- Descrição em snake_case

### 3. Tabela de controlo
O Flyway cria automaticamente a tabela `flyway_schema_history` na BD. Nunca editar esta tabela manualmente.

---

## Configuração no projeto

**pom.xml** — dependências já adicionadas:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

**application.yaml**:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate        # Hibernate só valida, não altera

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true   # Para BDs já existentes (criadas pelo Hibernate)
    baseline-version: 1         # Considera V1 como já aplicado na BD existente
```

---

## Comportamento por cenário

### BD já existente (servidor de desenvolvimento actual)
1. O Flyway detecta que a BD tem tabelas mas não tem `flyway_schema_history`
2. Com `baseline-on-migrate: true`, cria a tabela de histórico e marca como "já no V1"
3. **V1 não é executado** (a BD já tem o schema)
4. Futuras migrações (V2, V3…) são aplicadas normalmente

### BD nova (ex: novo ambiente, CI/CD, testes)
1. Flyway encontra BD vazia
2. Aplica `V1__init.sql` — cria todas as tabelas
3. Aplica V2, V3… em ordem
4. Regista tudo em `flyway_schema_history`

---

## Como criar uma nova migração

### Passo 1 — Criar o ficheiro SQL
```bash
# Exemplo: adicionar coluna observacao a lancamentos
touch src/main/resources/db/migration/V2__add_observacao_lancamentos.sql
```

```sql
-- V2__add_observacao_lancamentos.sql
ALTER TABLE lancamentos
    ADD COLUMN IF NOT EXISTS observacao TEXT;
```

### Passo 2 — Arrancar a aplicação
O Flyway aplica automaticamente ao iniciar o Spring Boot. Não é preciso fazer nada manualmente.

### Passo 3 — Verificar
```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

---

## Regras importantes

| Regra | Motivo |
|---|---|
| **Nunca editar um ficheiro V já aplicado** | O Flyway verifica o checksum e rejeita |
| **Versões devem ser crescentes** | Flyway aplica por ordem numérica |
| **Usar `IF NOT EXISTS` / `IF EXISTS`** | Torna os scripts mais seguros |
| **Testar em ambiente local antes de produção** | Scripts SQL não fazem rollback automático |
| **Commitar os ficheiros de migração com o código** | A migração vai com o PR que altera a entidade |

---

## Comandos úteis (Maven)

```bash
# Ver estado das migrações
./mvnw flyway:info

# Aplicar migrações pendentes manualmente (sem arrancar a app)
./mvnw flyway:migrate

# Validar se os checksum dos ficheiros batem com a BD
./mvnw flyway:validate

# Limpar toda a BD (⚠️ NUNCA em produção)
./mvnw flyway:clean
```

---

## Exemplos de migrações futuras

```sql
-- V2__add_index_lancamentos_vencimento.sql
CREATE INDEX IF NOT EXISTS idx_lancamentos_data_vencimento
    ON lancamentos(data_vencimento);

-- V3__add_saldo_inicial_conta.sql
ALTER TABLE contas
    ADD COLUMN IF NOT EXISTS saldo_inicial NUMERIC(10,2) NOT NULL DEFAULT 0;

-- V4__rename_nota_to_score.sql
ALTER TABLE clientes
    RENAME COLUMN nota TO score;
```
