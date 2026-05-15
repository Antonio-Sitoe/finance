# 3️⃣ Gestão de clientes

CRUD completo.

### Funcionalidades

* [x] Criar cliente
* [x] Editar cliente
* [x] Listar clientes
* [x] Desativar cliente
* [x] Ver detalhes do cliente

---

### Filtros
* [x] Buscar por nome
* [x] Filtrar por status

---

# 4️⃣ Gestão de contactos

Contactos vinculados ao cliente.

### Funcionalidades

* [ ] Criar contacto
* [ ] Editar contacto
* [ ] Listar contactos do cliente
* [ ] Desativar contacto
* [ ] Ver detalhes do contacto

---

### Filtros

* [ ] Buscar por nome
* [ ] Filtrar por departamento
* [ ] Filtrar por situação
* [ ] Filtrar por cliente

---

### Campos

```text
nome
departamento
email
cpf
telefone
situacao
cliente
```

---

### Endpoints Avançados

**CRUD básico**
- `GET /contacts`: listagem com filtros (cliente_id, departamento, situacao, q full-text), ordenação, paginação page/limit
- `GET /contacts/{id}`: obter contacto (opcional ?include=client para join)
- `POST /contacts`: criar contacto
- `PUT /contacts/{id}` / `PATCH /contacts/{id}`: atualizar
- `DELETE /contacts/{id}`: remover (ou soft-delete se preferir)

**Endpoints relacionados a cliente**
- `GET /clients/{clientId}/contacts`: contactos do cliente (usa JOIN)
- `POST /clients/{clientId}/contacts`: criar contacto associado (suportar transação quando criar cliente+contactos)
- `GET /clients/{clientId}/contacts/count` ou `GET /contacts/stats/count-by-client`: contagem por cliente

**Operações em massa / integração**
- `POST /contacts/bulk`: criar/atualizar em lote (CSV/JSON), com validação por linha e resumo de erros
- `POST /contacts/import` / `GET /contacts/export`: import/export CSV/Excel

**Pesquisa / UX**
- `GET /contacts/search?q=...`: pesquisa por nome/email/telefone/cpf com highlight
- `GET /contacts/autocomplete?q=...`: para suggestions em UI

**Estatísticas / Relatórios**
- `GET /contacts/stats/count-by-client`: quantos contactos por cliente (top N)
- `GET /contacts/stats/top-clients-by-contacts?limit=10`: top 10 clientes
- `GET /contacts/stats/by-department`: distribuição por departamento
- `GET /contacts/stats/missing-info`: contactos sem email ou telefone
- `GET /contacts/stats/recent?days=30`: contactos adicionados/alterados nos últimos N dias
- `GET /clients/{id}/primary-contact`: contacto principal
- `GET /contacts/stats/multiple-without-primary`: clientes com >1 contacto sem contacto "principal"

**Transações**
- Endpoints que criam cliente + contactos devem usar transação (veja 21.transacoes2.md)

---

# 5️⃣ Gestão de fornecedores

CRUD igual ao cliente.

### Funcionalidades

* [ ] Criar fornecedor
* [ ] Editar fornecedor
* [ ] Listar fornecedores
* [ ] Desativar fornecedor

---

Filtros:

* [ ] Nome
* [ ] CNPJ
* [ ] Cidade

---

# 6️⃣ Gestão de contas (bancárias / caixa)

Representa contas financeiras.

### Funcionalidades

* [ ] Criar conta
* [ ] Editar conta
* [ ] Listar contas
* [ ] Desativar conta

---

Campos:

```text
nome
agencia
conta_corrente
observacao
situacao
```

---

# 7️⃣ Gestão de categorias financeiras

Categorias hierárquicas.

### Funcionalidades

* [ ] Criar categoria
* [ ] Editar categoria
* [ ] Excluir categoria
* [ ] Listar categorias
* [ ] Criar subcategoria

---

Tipos:

* [ ] Receita
* [ ] Despesa

Campos:

```text
nome
descricao
categoria pai
tipo
situacao
```

---
