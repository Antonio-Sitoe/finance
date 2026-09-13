# Autenticação, autorização e roles dinâmicas

Auth completa **no próprio Spring + Angular** (sem Keycloak).
JWT, reset de senha, e RBAC dinâmico no estilo Strapi: o ADMIN cria roles e marca checkboxes **por endpoint**.

---

## Objectivo

- Qualquer pedido autenticado (excepto `/auth/me`, change-password, logout) exige uma permissão.
- Role **ADMIN** (`sistema = true`) faz tudo e ignora a matriz.
- O ADMIN pode criar uma role “Operador de lançamentos” que lista clientes mas não cria, e só opera lançamentos.
- Utilizador tem **uma** role. As permissões não vão no JWT — vêm de `/auth/me` + cache no servidor.

```
Utilizador ──1:1── Role ──N:N── Permissão (um método de controller)
                    │
                    └── ADMIN é especial: bypass total
```

---

## Estado actual vs o que falta

| Já existe | Falta |
|---|---|
| CRUD de utilizadores, senha com BCrypt | Login real, JWT, refresh, logout |
| Ecrãs de login / esqueci / reset (ainda simulados) | Email + tokens de reset |
| Enum `Perfil` `ADMIN` / `USER` | Roles dinâmicas + matriz de permissões |
| `SecurityConfig` em `permitAll()` | Filtro JWT + filtro de permissão |
| Gestão de users no Angular | Página **Roles** com checkboxes por módulo |
| JWT no `pom.xml` | Emissão, refresh e interceptor no frontend |

~80 endpoints em 11 controllers. A UI agrupa **por módulo**, um checkbox **por método**.

---

## Decisões fechadas

| Tema | Decisão |
|---|---|
| Keycloak | Não. A matriz é nossa, na nossa BD. |
| Granularidade | 1 checkbox = 1 método de controller, agrupado por módulo. |
| Permissões no JWT | Não. `/auth/me` + cache Caffeine por `roleId`. |
| User com N roles | Não na v1. Uma role por user. |
| Role ADMIN | `sistema = true`, bypass total, não editável / não apagável. |
| Público | Só login, forgot, reset, refresh. |
| Email | SMTP real; em local, logar o link se não houver SMTP. |
| Gestão de `/usuarios` e `/roles` | Só ADMIN na v1. |

---

## Modelo de dados (Flyway)

```sql
role (
  id, codigo UNIQUE, nome, descricao,
  sistema BOOLEAN,          -- true só para ADMIN
  created_at, updated_at
)

permissao (
  id,
  codigo UNIQUE,            -- ex: clientes.create
  modulo,                   -- "Clientes"
  acao,                     -- "create"
  metodo,                   -- POST
  path_pattern,             -- /clientes
  descricao
)

role_permissao (role_id, permissao_id)

-- substitui usuario.perfil:
usuario.role_id → role(id)
usuario.ultimo_acesso TIMESTAMP

password_reset_token (
  id, usuario_id, token_hash, expires_at, used_at
)

refresh_token (
  id, usuario_id, token_hash, expires_at, revoked_at
)
```

**Seed**
- Role `ADMIN` (`sistema = true`) — sem linhas em `role_permissao`; o código trata-a como “tudo”.
- Role `USER` (editável) — leitura do financeiro, sem gestão de users/roles.
- Catálogo de `permissao`: uma linha por handler Spring (sync no startup).

**Migração dos users actuais:** `ADMIN` → role ADMIN; `USER` → role USER; drop da coluna `perfil`.

---

## Catálogo de permissões

No arranque, `PermissionCatalogSync` lê o `RequestMappingHandlerMapping` e faz upsert em `permissao`.

| Handler | codigo | modulo | acao |
|---|---|---|---|
| `POST /clientes` | `clientes.create` | Clientes | create |
| `GET /clientes` | `clientes.find` | Clientes | find |
| `GET /clientes/{id}` | `clientes.findOne` | Clientes | findOne |
| `PATCH /clientes/{id}` | `clientes.update` | Clientes | update |
| `PATCH /clientes/{id}/situacao` | `clientes.situacao` | Clientes | situacao |
| `POST /lancamentos` | `lancamentos.create` | Lançamentos | create |
| `GET /analitics/dashboard` | `analitics.dashboard` | Relatórios | dashboard |

`codigo` = `{primeiro-segmento-do-path}.{nomeDoMetodoJava}` (ou `@Permission("clientes.create")` no método).

**Públicos (fora do catálogo)**
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/refresh`
- swagger / actuator (se existirem)

**Autenticado, sem checkbox**
- `GET/PATCH /auth/me`
- `POST /auth/change-password`
- `POST /auth/logout`

Endpoint novo aparece sozinho na página de roles no próximo arranque.

---

## Autenticação (JWT)

### Endpoints (`AuthController` em `/auth`)

| Método | Função |
|---|---|
| `POST /auth/login` | email + senha → access JWT (15 min) + refresh (7 dias) |
| `POST /auth/refresh` | troca refresh; rota o token antigo |
| `POST /auth/logout` | revoga o refresh na BD |
| `GET /auth/me` | perfil + role + `permissoes[]` + `ultimoAcesso` |
| `PATCH /auth/me` | nome e email próprios |
| `POST /auth/change-password` | senha actual + nova + confirmação |
| `POST /auth/forgot-password` | pede reset |
| `POST /auth/reset-password` | aplica o token |

### Login
1. Buscar user por email.
2. Recusar se inexistente, `INATIVO` ou senha inválida — **mesma mensagem**.
3. `BCrypt.matches`.
4. Gravar `ultimo_acesso = now()`.
5. Access JWT: `sub` = userId, claims `email`, `role` (codigo). Sem lista de permissões no token.
6. Refresh: UUID, guardar **hash** na tabela, devolver o valor cru uma vez.

### SecurityFilterChain
- Stateless.
- JWT filter → `SecurityContext`.
- `PermissionAuthorizationFilter`:
  1. Rota pública → passa.
  2. Role `sistema` (ADMIN) → passa.
  3. Resolve o handler → `codigo` da permissão.
  4. Role tem a permissão (cache por `roleId`) → passa.
  5. Senão → **403**.
- Invalidar cache quando o admin grava a role.

---

## Esqueci a senha / reset

Ecrãs `/forgot-password` e `/reset-password` já existem (ainda simulados).

1. User pede reset com o email.
2. Backend **sempre 200** (não revelar se o email existe).
3. Se o user existe e está ATIVO: token (32 bytes), **hash** + `expires_at` (1h), invalidar tokens anteriores.
4. Email com `{FRONTEND_URL}/reset-password?token=...`
5. Angular lê o query param → `POST /auth/reset-password`.
6. Validar hash + expiração + `used_at IS NULL`, gravar senha (BCrypt), marcar used, **revogar todos os refresh**.

**Email:** `spring-boot-starter-mail` + SMTP no `.env`. Em local, se SMTP não estiver configurado, **logar o link** no consola.

---

## API de roles (só ADMIN)

| Método | Função |
|---|---|
| `GET /roles` | lista (nome, descrição, nº users, sistema) |
| `POST /roles` | criar role vazia |
| `GET /roles/{id}` | role + árvore `modulo → [{ codigo, acao, metodo, path, granted }]` |
| `PUT /roles/{id}` | nome/descrição + `permissaoIds` marcados |
| `DELETE /roles/{id}` | só se `sistema = false` e 0 users |
| `GET /permissoes` | catálogo agrupado por módulo |

Regras:
- Não apagar / não editar a matriz da role `ADMIN`.
- Não criar segunda role `sistema`.
- User não pode remover a própria role ADMIN.
- Formulário de user: select de roles (`GET /roles`) em vez do enum `perfil`.

---

## Frontend

### Página `/roles` (só ADMIN)

**Lista**
- Nome, descrição, nº de users, editar/apagar
- Botão “Add new role”

**Detalhe** (matriz tipo Strapi)
- Nome + descrição
- Accordion por módulo: Clientes, Lançamentos, Fornecedores, …
- Checkboxes `create`, `find`, `update`, `delete`, … + “Select all”
- Save → `PUT /roles/{id}`

### Auth no Angular
1. `AuthService`: access em memória; refresh em cookie HttpOnly (ideal).
2. Interceptor: `Authorization: Bearer`; em 401 tenta refresh uma vez; senão → `/signin`.
3. `authGuard` no `AppLayoutComponent`.
4. Bootstrap / login → `GET /auth/me` → signal `permissoes[]`.
5. `*hasPermission="'clientes.create'"` esconde “Novo”.
6. Sidebar: esconde item se não houver nenhum `find` daquele módulo.
7. `/users` e `/roles` só ADMIN.

Login / forgot / reset: trocar os `setTimeout` por API. Reset lê `token` da query string.

---

## Checklist

### Autenticação
* [ ] Login com email e senha
* [ ] Logout (revogar refresh)
* [ ] Sessão com token JWT (15 min)
* [ ] Refresh token (7 dias, rotação)
* [ ] `GET /auth/me` + último acesso
* [ ] Alterar a própria password
* [ ] Esqueci a senha (email + token 1h)
* [ ] Reset password (`/reset-password?token=`)

### Gestão de utilizadores (ADMIN)
* [x] Criar utilizador (nome, email, senha, situação)
* [x] Editar utilizador
* [x] Desactivar utilizador (soft delete → INATIVO)
* [x] Listar utilizadores com paginação
* [x] Ver detalhe de utilizador por ID
* [ ] Trocar enum `perfil` por select de role dinâmica

### Roles dinâmicas (ADMIN)
* [ ] Tabelas `role`, `permissao`, `role_permissao`
* [ ] Sync do catálogo no startup
* [ ] CRUD de roles
* [ ] Página lista de roles
* [ ] Página detalhe com checkboxes por endpoint, agrupados por módulo
* [ ] Filtro de autorização (ADMIN bypass; resto valida permissão)
* [ ] Cache de permissões por role (invalidar no save)
* [ ] Directiva `*hasPermission` + sidebar/rotas filtradas
* [ ] Seed: ADMIN, USER, role exemplo “Operador de lançamentos”

### Perfil do utilizador (qualquer autenticado)
* [ ] Ver o próprio perfil (nome, email, role, situação, data de criação)
* [ ] Editar o próprio nome e email
* [ ] Ver data e hora do último acesso

### UI — estado dos prompts
* [x] Tela de Login + Esqueci a Password (ainda simulada)
* [x] Tela de Reset Password (ainda simulada)
* [x] Gestão de Utilizadores
* [x] Perfil do Utilizador
* [ ] Ligar login / forgot / reset à API
* [ ] Página de Roles (matriz de permissões)

---

## Sprints

### Sprint 1 — Auth a funcionar (sem roles dinâmicas ainda)
1. Tabelas `refresh_token`, `password_reset_token`, coluna `ultimo_acesso`.
2. `AuthController` + `JwtService` + filtro JWT.
3. Fechar `SecurityConfig`: público só login/reset/refresh; resto autenticado.
4. Ligar login / logout / me / change-password no Angular.
5. Guards nas rotas da app.
6. Forgot + reset + mail (ou log do link em local).

Resultado: ninguém entra sem senha; o CRUD financeiro deixa de estar aberto.

### Sprint 2 — Modelo de roles
1. Tabelas `role`, `permissao`, `role_permissao`.
2. Migrar `usuario.perfil` → `role_id`.
3. Sync do catálogo no startup.
4. Filtro de autorização por permissão + bypass ADMIN.
5. Cache por role; invalidar no save.
6. API `/roles` e `/permissoes`.

### Sprint 3 — UI admin tipo Strapi
1. Página lista + detalhe com checkboxes agrupados.
2. Users: select de role dinâmica.
3. Directiva de permissão nos botões (criar/editar/apagar).
4. Sidebar e rotas filtradas.
5. Seed da role exemplo “Operador de lançamentos”.

### Sprint 4 — Endurecer
1. Rate limit em login e forgot-password.
2. Rotação de refresh; revogar todos no reset de senha.
3. Não permitir desactivar o último ADMIN.
4. Testes: 401 sem token, 403 sem permissão, ADMIN passa, desmarcar checkbox fecha o endpoint, reset expira.

---

## Critério de aceite (exemplo)

1. Login ADMIN → `/roles` → **Add new role** “Operador lançamentos”.
2. Marcar só:
   - Lançamentos: create, find, findOne, update, situacao
   - Clientes / Categorias / Contas / Fornecedores: find, findOne
3. Save.
4. Em Users, criar o operador com essa role.
5. Login com o operador:
   - vê Lançamentos, cria e edita
   - lista clientes mas o botão “Novo cliente” não aparece; `POST /clientes` devolve 403
   - menu Users / Roles / Relatórios não aparece
