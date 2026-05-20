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

* [x] Criar contacto  `POST /contacts`: criar contacto
* [x] Editar contacto
* [x] Listar contactos do cliente `GET /contacts`: listagem com filtros (cliente_id, departamento, situacao, q full-text), ordenação, paginação page/limit
* [x] Desativar contacto
* [x] Ver detalhes do contacto -  `GET /contacts/{id}`: obter contacto (opcional ?include=client para join)

---

### Filtros
* [x] Buscar por nome
* [x] Filtrar por departamento
* [x] Filtrar por situação
* [x] Filtrar por cliente


**Estatísticas / Relatórios**
- [x]`GET /contacts/stats/count-by-client`: quantos contactos por cliente (top N)
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
