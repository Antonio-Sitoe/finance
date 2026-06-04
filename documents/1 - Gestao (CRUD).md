# 4️⃣ Gestão de contactos

Contactos vinculados ao cliente.

### Funcionalidades

- [x] Criar contacto `POST /contacts`: criar contacto
- [x] Editar contacto
- [x] Listar contactos do cliente `GET /contacts`: listagem com filtros (cliente_id, departamento, situacao, q full-text), ordenação, paginação page/limit
- [x] Desativar contacto
- [x] Ver detalhes do contacto - `GET /contacts/{id}`: obter contacto (opcional ?include=client para join)

---

### Filtros

- [x] Buscar por nome
- [x] Filtrar por departamento
- [x] Filtrar por situação
- [x] Filtrar por cliente

**Estatísticas / Relatórios**

- [x]`GET /contacts/stats/count-by-client`: quantos contactos por cliente (top N)

---

# 5️⃣ Gestão de fornecedores

CRUD igual ao cliente.

### Funcionalidades

- [x] Criar fornecedor
- [x] Editar fornecedor
- [x] Listar fornecedores
- [x] Desativar fornecedor

---

Filtros:

- [x] Nome

---

# 6️⃣ Gestão de contas (bancárias / caixa)

Representa contas financeiras.

### Funcionalidades

- [x] Criar conta
- [x] Editar conta
- [x] Listar contas
- [x] Desativar conta

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

- [x] Criar categoria
- [x] Editar categoria
- [x] Excluir categoria
- [x] Listar categorias
- [x] Criar subcategoria
