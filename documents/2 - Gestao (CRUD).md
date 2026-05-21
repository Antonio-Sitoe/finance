
---
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

* [x] Criar lançamento
* [x] Editar lançamento
* [x] Excluir lançamento
* [x] Marcar como pago
* [x] Marcar como pendente
* [x]  criar/atualizar em lote (CSV/JSON), com validação por linha e resumo de erros

* [ ] `GET /lancamentos/export`: import/export CSV/Excel

* [ ] `POST /lancamentos/batch-update-status`: atualizar status de múltiplos lançamentos (marcar como pago/pendente em massa)

**Relatórios**
* [ ] `GET /lancamentos/relatorio/mensal`: análise mensal (total de lançamentos e somatório por mês)
* [ ]  `GET /lancamentos/relatorio/percentual`: percentual de lançamentos pagos vs pendentes
* [ ]  `GET /lancamentos/relatorio/por-categoria`: resumo de lançamentos por categoria

---
