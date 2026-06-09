# 4️⃣ Gestão de contactos

Contactos vinculados ao cliente.

### Funcionalidades

- [] Criar contacto `POST /contacts`: criar contacto
- [] Editar contacto
- [] Listar contactos do cliente `GET /contacts`: listagem com filtros (cliente_id, departamento, situacao, q full-tet), ordenação, paginação page/limit
- [] Desativar contacto
- [] Ver detalhes do contacto - `GET /contacts/{id}`: obter contacto (opcional ?include=client para join)
- [] criar contacto vinculado a empresa

---

### Filtros

- [] Buscar por nome
- [] Filtrar por departamento
- [] Filtrar por situação
- [] Filtrar por cliente

**Estatísticas / Relatórios**

- []`GET /contacts/stats/count-by-client`: quantos contactos por cliente (top N)

---

# 5️⃣ Gestão de fornecedores

CRUD igual ao cliente.

### Funcionalidades

- [] Criar fornecedor
- [] Editar fornecedor
- [] Listar fornecedores
- [] Desativar fornecedor

---

Filtros:

- [] Nome

---

# 6️⃣ Gestão de contas (bancárias / caixa)

Representa contas financeiras.

### Funcionalidades

- [] Criar conta
- [] Editar conta
- [] Listar contas
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
