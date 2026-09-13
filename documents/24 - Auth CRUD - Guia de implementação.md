# Guia de implementação — Auth, JWT e roles dinâmicas

Guia passo a passo do plano [23 - Auth CRUD.md](23%20-%20Auth%20CRUD.md).
O plano diz **o quê** e **porquê**; este guia diz **como**, em que ordem, e como verificar cada passo antes de avançar.

Factos do projecto: [Auth/0.begging.md](Auth/0.begging.md).

> **Regra de ouro:** não avances para o passo seguinte sem o ✅ do anterior.
> Cada sprint termina num estado que compila e corre.

---

## Estado actual

| Área | Estado | Onde |
| ---- | ------ | ---- |
| Backend auth (JWT, security) | ✅ | [Auth/1.1–1.6](Auth/1.5-1.6.md) |
| Seed admin (`V4`) | ✅ | `admin@finance.com` / `Admin@123` |
| Angular (login/sessão/ecrãs) | ✅ | [Auth/1.7-1.8.md](Auth/1.7-1.8.md) |
| Forgot/reset (link no console) | ✅ | [Auth/1.9.md](Auth/1.9.md) |
| Roles dinâmicas | ⬜ Próximo | Sprint 2 ↓ |

**Login:** `admin@finance.com` / `Admin@123` — UI `/signin` ou:

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@finance.com","senha":"Admin@123"}'
```

**Reset:** `POST /api/auth/forgot-password` → copiar URL do log do backend → `/reset-password?token=...`

---

# Sprint 1 — Auth a funcionar ✅

Objectivo cumprido: API protegida + login Angular + reset via log.

Arquivo: [1.1-1.2](Auth/1.1-1.2.md) · [1.3-1.4](Auth/1.3-1.4.md) · [1.5-1.6](Auth/1.5-1.6.md) · [1.7-1.8](Auth/1.7-1.8.md) · [1.9](Auth/1.9.md)

---

# Sprint 2 — Modelo de roles

**Objectivo:** matriz de permissões na BD, filtro que a aplica, API para o admin.

> Migrations: `V4` = seed admin (já feito). Roles = **`V5`**.

## Passo 2.1 — Migration V5

`V5__roles_dinamicas.sql`:

```sql
CREATE TABLE role (
    id          BIGSERIAL PRIMARY KEY,
    codigo      VARCHAR(50)  NOT NULL UNIQUE,
    nome        VARCHAR(100) NOT NULL,
    descricao   VARCHAR(255),
    sistema     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL
);

CREATE TABLE permissao (
    id           BIGSERIAL PRIMARY KEY,
    codigo       VARCHAR(120) NOT NULL UNIQUE,   -- clientes.create
    modulo       VARCHAR(60)  NOT NULL,          -- "Clientes"
    acao         VARCHAR(60)  NOT NULL,          -- "create"
    metodo       VARCHAR(10)  NOT NULL,          -- POST
    path_pattern VARCHAR(255) NOT NULL,          -- /clientes
    descricao    VARCHAR(255),
    created_at   TIMESTAMP    NOT NULL,
    updated_at   TIMESTAMP    NOT NULL
);

CREATE TABLE role_permissao (
    role_id      BIGINT NOT NULL REFERENCES role(id) ON DELETE CASCADE,
    permissao_id BIGINT NOT NULL REFERENCES permissao(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permissao_id)
);

-- seeds
INSERT INTO role (codigo, nome, descricao, sistema, created_at, updated_at)
VALUES ('ADMIN', 'Administrador', 'Acesso total', TRUE, now(), now()),
       ('USER',  'Utilizador',    'Leitura do financeiro', FALSE, now(), now());

-- migração dos users actuais
ALTER TABLE usuario ADD COLUMN role_id BIGINT;
UPDATE usuario u SET role_id = r.id
FROM role r WHERE r.codigo = u.perfil::text;
ALTER TABLE usuario ALTER COLUMN role_id SET NOT NULL;
ALTER TABLE usuario ADD CONSTRAINT fk_usuario_role FOREIGN KEY (role_id) REFERENCES role(id);
ALTER TABLE usuario DROP COLUMN perfil;
```

> ⚠️ Depois desta migration, o enum `Perfil` deixa de ser usado na entidade. Apagar o campo `perfil` de `Usuario`, dos DTOs, do `UsuarioService.listar` (filtro) e do `UsuarioMapper` — tudo **no mesmo commit**, senão o `validate` rebenta.

## Passo 2.2 — Entidades

`modules/roles/model/`: `Role` (`codigo`, `nome`, `descricao`, `sistema`, `@ManyToMany` para `Permissao` via `role_permissao`) e `Permissao` (`codigo`, `modulo`, `acao`, `metodo`, `pathPattern`, `descricao`). Ambas `extends BaseEntity`.

`Usuario`: trocar `private Perfil perfil` por:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "role_id", nullable = false)
private Role role;
```

Actualizar `JwtService.gerarAccessToken` para `usuario.getRole().getCodigo()` (hoje usa `perfil.name()`).

## Passo 2.3 — Sync do catálogo no startup

`modules/roles/service/PermissionCatalogSync.java`:

```java
@Component
@RequiredArgsConstructor
public class PermissionCatalogSync implements ApplicationRunner {

    private final RequestMappingHandlerMapping handlerMapping;
    private final PermissaoRepository permissaoRepository;

    private static final Set<String> PUBLICOS = Set.of(
            "POST /api/auth/login", "POST /api/auth/forgot-password",
            "POST /api/auth/reset-password", "POST /api/auth/refresh");

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        handlerMapping.getHandlerMethods().forEach((info, handlerMethod) -> {
            // 1. saltar /auth/** públicos, swagger, actuator
            // 2. saltar /auth/me, /auth/change-password, /auth/logout (autenticado sem checkbox)
            // 3. para cada (método HTTP, path):
            //      codigo = primeiroSegmentoDoPath + "." + nomeDoMetodoJava
            //      modulo = primeiroSegmentoDoPath capitalizado
            //      upsert em permissao (ON CONFLICT actualizar metodo/path)
        });
    }
}
```

Notas:

- Os paths aqui **já incluem `/api`** (o `RequestMappingHandlerMapping` vê o path final). Guardar `path_pattern` com `/api/clientes` ou fazer strip — escolher uma convenção e ser consistente com o filtro do passo 2.4.
- Endpoint novo aparece sozinho no próximo arranque — é o upsert que garante isso.

✅ **Verificar:** arrancar → `SELECT modulo, count(*) FROM permissao GROUP BY modulo;` mostra os ~80 endpoints agrupados.

## Passo 2.4 — Filtro de autorização + cache

`modules/roles/security/PermissionAuthorizationFilter.java`, registado **depois** do `JwtAuthenticationFilter`:

```
1. Rota pública ou /auth/me|change-password|logout → passa
2. Sem autenticação → passa (o entry point devolve 401)
3. Role do user tem sistema = true → passa (bypass ADMIN)
4. Resolver o handler para o request → codigo da permissão
5. Permissões da role (cache Caffeine por roleId) contêm o codigo → passa
6. Senão → 403 com mensagem clara
```

Cache: juntar `com.github.ben-manes.caffeine:caffeine` ao `pom.xml`. Cache `LoadingCache<Long, Set<String>>` roleId → códigos. **Invalidar no `PUT /roles/{id}`** (`cache.invalidate(roleId)`).

Para resolver o handler dentro do filtro: injectar `RequestMappingHandlerMapping` e chamar `getHandler(request)` — ou, mais simples, reconstruir o `codigo` a partir do path + método com a mesma regra do sync (recomendado: mesma regra = menos acoplamento).

✅ **Verificar:**

- ADMIN entra em tudo.
- Criar na BD uma role sem `clientes.create`, atribuir a um user → `POST /api/clientes` → 403; `GET /api/clientes` → 200 (se `clientes.find` marcado).

## Passo 2.5 — API `/roles` e `/permissoes`

`modules/roles/controller/RoleController.java` (só ADMIN — ver regra abaixo):

| Método               | Notas                                                                         |
| -------------------- | ----------------------------------------------------------------------------- |
| `GET /roles`         | lista com nº de users por role                                                |
| `POST /roles`        | criar vazia; `sistema` sempre `false`                                         |
| `GET /roles/{id}`    | role + árvore `modulo → [{ codigo, acao, metodo, path, granted }]`            |
| `PUT /roles/{id}`    | nome/descrição + `permissaoIds`; recusar se `sistema = true`; invalidar cache |
| `DELETE /roles/{id}` | só se `sistema = false` **e** 0 users                                         |
| `GET /permissoes`    | catálogo agrupado por módulo                                                  |

Regras a implementar no service:

- Não editar matriz nem apagar a role `sistema = true`.
- User não pode remover a **própria** role ADMIN.

Como “só ADMIN” ainda não tem anotação própria: na v1, validar no filtro do passo 2.4 que `roles.*` e `permissoes.*` só passam com bypass (não criar linhas `permissao` para estes endpoints — excluí-los do catálogo no sync).

✅ **Verificar (checkpoint Sprint 2):** curl com token ADMIN cobre o CRUD de roles; `GET /api/permissoes` devolve os módulos; desmarcar uma permissão → 403 imediato (cache invalidada).

---

# Sprint 3 — UI admin tipo Strapi

## Passo 3.1 — Página lista de roles

`pages/roles/roles-list/` + rota `roles` em `app.routes.ts` (dentro do `AppLayoutComponent`, com `authGuard`). Reutilizar os componentes de tabela de `shared/components/ui/table` como em `users`. Colunas: nome, descrição, nº users, acções (editar/apagar). Botão “Add new role” → modal ou rota de detalhe nova.

## Passo 3.2 — Página detalhe (matriz de checkboxes)

`pages/roles/role-detail/`:

1. `GET /api/permissoes` → accordion por módulo.
2. Se `id` existe: `GET /api/roles/{id}` → marcar os `granted`.
3. “Select all” por módulo.
4. Save → `PUT /api/roles/{id}` (ou `POST` + `PUT` para role nova).
5. Role `sistema = true` → matriz em read-only com aviso “ADMIN tem acesso total”.

## Passo 3.3 — Select de role no formulário de users

No form de criar/editar user (`shared/components/users/...`): substituir o select do enum `perfil` por um select que carrega `GET /api/roles`. O `UsuarioRequestDTO` passa a ter `roleId`.

## Passo 3.4 — Directiva `*hasPermission`

`shared/directives/has-permission.directive.ts`:

```ts
@Directive({ selector: '[hasPermission]', standalone: true })
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef)
  private viewContainer = inject(ViewContainerRef)
  private auth = inject(AuthService)

  @Input() set hasPermission(codigo: string) {
    const isAdmin = this.auth.currentUser()?.role === 'ADMIN'
    if (isAdmin || this.auth.permissoes().includes(codigo)) {
      this.viewContainer.createEmbeddedView(this.templateRef)
    } else {
      this.viewContainer.clear()
    }
  }
}
```

Aplicar nos botões: `<button *hasPermission="'clientes.create'">Novo cliente</button>`.

## Passo 3.5 — Sidebar e rotas filtradas

- Em `app-sidebar`: cada item de menu ganha um `modulo`; mostrar só se `permissoes()` contém `{modulo}.find` (ou se ADMIN).
- Items Users e Roles: só ADMIN.
- Guard extra nas rotas sensíveis (`users`, `roles`): `canActivate` que verifica `role === 'ADMIN'`.

✅ **Verificar (checkpoint Sprint 3 = critério de aceite do plano):**

1. Login ADMIN → `/roles` → “Add new role” **Operador lançamentos**.
2. Marcar só Lançamentos (create, find, findOne, update, situacao) + find/findOne de Clientes, Categorias, Contas, Fornecedores.
3. Criar o user operador com essa role.
4. Login operador: vê e edita lançamentos; lista clientes **sem** botão “Novo cliente”; `POST /api/clientes` → 403; menus Users/Roles/Relatórios escondidos.

---

# Sprint 4 — Endurecer

1. **Rate limit** em `/api/auth/login` e `/api/auth/forgot-password` (Bucket4j ou filtro simples com cache Caffeine por IP: ex. 5 tentativas/minuto).
2. **Refresh em cookie HttpOnly**: `POST /auth/login` faz `Set-Cookie: refresh_token=...; HttpOnly; SameSite=Strict`; `/auth/refresh` lê o cookie. Frontend deixa de guardar refresh no storage. CORS já tem `allowCredentials=true` — no Angular, `withCredentials: true` nesses pedidos.
3. **Último ADMIN**: em `desativar`/`activarOuDesativar` e no update de role, recusar se for o último user ATIVO com role `sistema`.
4. **Access token só em memória**: remover `sessionStorage`; no F5, o guard chama `refresh()` (cookie) antes de `loadMe()`.
5. **Testes** (`spring-boot-starter-security-test` + `webmvc-test` já estão no pom):
   - 401 sem token; 403 sem permissão; ADMIN passa em tudo;
   - desmarcar checkbox fecha o endpoint (cache invalidada);
   - reset expira ao fim de 1h e não pode ser reutilizado;
   - refresh rodado não pode ser reutilizado.

---

# Armadilhas conhecidas (deste projeto)

| Armadilha | Solução |
| --------- | ------- |
| Security matcher sem `/api` → tudo 401/403 | Matchers sempre com `/api/...` |
| Boot 4: `flyway-core` sozinho não corre | Usar `spring-boot-starter-flyway` |
| `ddl-auto: validate` rebenta após V5 | Mudar entidade + DTOs + mapper no mesmo commit da migration |
| Nomes de tabela entidade ≠ migration | `@Table` = singular (`refresh_token`, não `refresh_tokens`) |
| `Jwts.parser()` não existe no 0.11.5 | Usar `parserBuilder()` |
| Segredo JWT curto / multilinha no `.env` | Uma linha: `openssl rand -base64 64 \| tr -d '\n'` |
| `jwt` / `frontend` sob `spring:` no yaml | Propriedades na **raiz** (`jwt.secret`, não `spring.jwt.secret`) |
| F5 no Angular perde o user | Guard chama `loadMe()` (Sprint 1) / `refresh()` (Sprint 4) |
| Sync do catálogo cria permissões para `/roles` | Excluir `roles.*`/`permissoes.*` do catálogo; só bypass ADMIN |
| `perfil` ainda referenciado no frontend | Select de roles substitui o enum no Sprint 3.3 |
| Logout só limpa o cliente | Chamar `POST /auth/logout` para revogar o refresh na BD |
| IDE gera `.class` com “Unresolved compilation problems” | `./mvnw compile` / Rebuild Project |

---

# Ordem de commits sugerida

1. ~~`V3` + entidades de token + config JWT~~ ✅
2. ~~`JwtService` + `AuthService` + `AuthController`~~ ✅
3. ~~Filtro JWT + `SecurityConfig` fechado~~ ✅ ← API protegida
4. ~~`V4` seed admin~~ ✅
5. ~~Angular: service + interceptor + guard + ecrãs ligados~~ ✅
6. ~~Forgot/reset (link no console)~~ ✅
7. `V5` ← **agora** + entidades role/permissao + migração de dados
8. Sync do catálogo + filtro de permissões + cache
9. API `/roles` + `/permissoes`
10. UI roles (lista + matriz) + select de role em users
11. Directiva + sidebar + guards de rota
12. Sprint 4 (rate limit, cookies, testes)
