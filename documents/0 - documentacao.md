# 3️⃣ Gestão de clientes

CRUD completo.

### Funcionalidades frontend

- [x] Criar cliente
- [x] Editar cliente
- [x] Listar clientes
- [x] Desativar cliente
- [x] Ver detalhes do cliente

### Filtros

- [x] Buscar por nome
- [x] Filtrar por status
      [x] - Estatisticas de clientes

---
# 4️⃣ Gestão de contactos

Contactos vinculados ao cliente.

### Funcionalidades

- [x] Criar contacto `POST /contacts`: criar contacto
- [x] Editar contacto
- [x] Listar contactos do cliente `GET /contacts`: listagem com filtros (cliente_id, departamento, situacao, q full-tet), ordenação, paginação page/limit
- [x] Desativar contacto
- [x] Ver detalhes do contacto - `GET /contacts/{id}`: obter contacto (opcional ?include=client para join)
- [] criar contacto vinculado a empresa

---
### Filtros
- [x] Buscar por nome
- [x] Filtrar por departamento
- [x] Filtrar por situação


**Estatísticas por contactos / Relatórios**

- [x]`GET /contacts/stats/count-by-client`: quantos contactos por cliente (top N)

---

# 5️⃣ Gestão de fornecedores (back and front)

CRUD igual ao cliente.

### Funcionalidades

- [x] Criar fornecedor
- [x] Editar fornecedor
- [x] Listar fornecedores
- [x] Desativar fornecedor

---

Filtros:

- [x] Nome
- [x] Estatisticas de fornecedores

---


# 6️⃣ Gestão de contas (bancárias / caixa)

Representa contas financeiras.

### Funcionalidades

- [x] Criar conta
- [x] Editar conta
- [x] Listar contas
- [x] Desativar conta

---
