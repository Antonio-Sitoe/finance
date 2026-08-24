# Plano de Logging — Sistema Finance

## Estado actual

O projeto já tem logging no `GlobalExceptionHandler` via SLF4J (`LoggerFactory`). O que falta é logging **nos services e controllers** para rastrear operações de negócio.

---

## Objectivo

Ter visibilidade sobre:
- Quem criou / alterou / desactivou cada recurso
- Operações pesadas (bulk import, exportação CSV, relatórios)
- Erros de negócio antes de chegarem ao handler global
- Performance de queries lentas

---

## Níveis de log a usar

| Nível | Quando usar |
|---|---|
| `DEBUG` | Detalhes internos (query params, valores calculados) — só em dev |
| `INFO` | Operações concluídas com sucesso (criação, actualização, listagem) |
| `WARN` | Situações inesperadas mas recuperáveis (tentativa de duplicado, recurso não encontrado) |
| `ERROR` | Falhas não esperadas (já tratado no GlobalExceptionHandler) |

---

## O que adicionar em cada camada

### Services — padrão a seguir

```java
private static final Logger log = LoggerFactory.getLogger(LancamentoService.class);

// Criar
log.info("Criando lancamento: tipo={}, valor={}, contaId={}", data.getTipo(), data.getValor(), data.getContaId());
// (após save)
log.info("Lancamento criado com id={}", saved.getId());

// Actualizar
log.info("Actualizando lancamento id={}", id);

// Desactivar / activar
log.info("Alterando situacao do lancamento id={} para {}", id, novaSituacao);

// Listar (apenas DEBUG para não poluir)
log.debug("Listando lancamentos com filtros: tipo={}, situacao={}, page={}", tipo, situacao, paginationRequest.getPage());

// Operações bulk
log.info("Iniciando importacao bulk: {} registos recebidos", rows.size());
log.info("Importacao bulk concluida: {} sucesso, {} erros", sucessos, erros);
```

### Controllers — logging mínimo

Os controllers não precisam de logging extenso — o service já regista. Apenas anotar quando há decisões de roteamento incomuns.

---

## Módulos prioritários para implementar

### 1. LancamentoService (maior impacto)
- `criar()` — INFO com tipo, valor, contaId
- `criarParcelado()` — INFO com total de parcelas criadas
- `bulkImport()` — INFO com total recebido / sucesso / erro
- `exportCsv()` — INFO com total de registos exportados

### 2. ContaService
- `criar()` / `atualizar()` — INFO com nome da conta
- `activarOuDesativar()` — INFO com novo estado

### 3. ClienteService / FornecedorService
- `criar()` / `atualizar()` — INFO com email do cliente/fornecedor

### 4. UsuarioService
- `criar()` — INFO (sem logar a senha nunca)
- `atualizar()` — INFO

### 5. RelatorioService / CashFlowService
- `relatorioAnual()`, `dashboard()`, `dre()` — DEBUG com parâmetros recebidos e INFO com duração aproximada

---

## Configuração do Logback (application.yaml)

Adicionar ao `application.yaml`:

```yaml
logging:
  level:
    root: INFO
    com.finance.finance: DEBUG          # Logs internos do projecto em DEBUG
    org.hibernate.SQL: WARN             # Desligar SQL em produção
    org.hibernate.type.descriptor: WARN
  pattern:
    console: "%d{HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

Em produção, mudar `com.finance.finance` para `INFO` e desligar o `show-sql`.

---

## Campos a NÃO logar (segurança)

- `senha` / passwords
- Tokens JWT (quando implementados)
- Dados completos de cartão (se aplicável no futuro)
- `DB_PASSWORD` e outros secrets

---

## Exemplo de implementação em LancamentoService

```java
@Service
@RequiredArgsConstructor
public class LancamentoService {

    private static final Logger log = LoggerFactory.getLogger(LancamentoService.class);

    @Transactional
    public LancamentoResponseDTO criar(LancamentoRequestDto data) {
        log.info("Criando lancamento: tipo={}, valor={}, contaId={}",
                data.getTipo(), data.getValor(), data.getContaId());

        // ... lógica de negócio ...

        Lancamento saved = lancamentoRepository.save(lancamento);
        log.info("Lancamento criado com sucesso: id={}", saved.getId());
        return LancamentoMapper.toResponse(saved);
    }

    @Transactional
    public BulkResponseDTO bulkImport(List<LancamentoCsvRow> rows) {
        log.info("Iniciando importacao bulk com {} registos", rows.size());
        // ... lógica ...
        log.info("Importacao bulk concluida: sucesso={}, erros={}", sucessos, erros.size());
        return new BulkResponseDTO(sucessos, erros);
    }
}
```

---

## Próximos passos

1. Adicionar `Logger` a cada service (LancamentoService primeiro)
2. Configurar levels no `application.yaml`
3. Em produção: considerar envio de logs para serviço centralizado (ex: Papertrail, Datadog, Loki)
