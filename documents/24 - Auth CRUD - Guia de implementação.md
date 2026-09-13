# Guia de implementação — Auth, JWT e roles dinâmicas

Guia passo a passo do plano [23 - Auth CRUD.md](23%20-%20Auth%20CRUD.md).
O plano diz **o quê** e **porquê**; este guia diz **como**, em que ordem, e como verificar cada passo antes de avançar.

> **Regra de ouro:** não avances para o passo seguinte sem o ✅ do anterior.
> Cada sprint termina num estado que compila e corre.

---

## Antes de começar — factos deste projeto

| Facto | Consequência no guia |
|---|---|
| `ApiPrefixConfig` junta `/api` a todos os `@RestController` | Rotas públicas são `/api/auth/login`, não `/auth/login` |
| Servidor na porta **8081** | Testes: `http://localhost:8081/api/...` |
| Config vem de `.env` (`spring.config.import`) | Segredos JWT e SMTP vão para o `.env`, nunca no código |
| `ddl-auto: validate` | As entidades têm de bater **exactamente** com as migrations Flyway |
| Flyway em `db/migration`, último é `V2` | Próximas migrations: `V3` (tokens), `V4` (roles) |
| JJWT **0.11.5** já no `pom.xml` | API antiga: `Jwts.parserBuilder()` — ver snippets abaixo |
| Lombok em todo o lado | Usar `@RequiredArgsConstructor`, `@Getter/@Setter` como no resto do código |
| `Usuario` tem `perfil` (enum) e estende `BaseEntity` | Sprint 2 substitui `perfil` por `role_id` |
| CORS já permite `http://localhost:4200` com credenciais | Cookies HttpOnly funcionam sem mexer no CORS |
| Módulo `modules/auth` já existe (CRUD de `Usuario`) | Auth novo entra **nesse** módulo; roles vão para `modules/roles` |

Cria uma branch: `git checkout -b feat/auth`.

---

# Sprint 1 — Auth a funcionar

**Objectivo:** ninguém entra sem senha; CRUD financeiro deixa de estar aberto.

## Passo 1.1 — Migration V3 (tokens + último acesso)

Criar `backend/src/main/resources/db/migration/V3__auth_tokens.sql`:

```sql
ALTER TABLE usuario ADD COLUMN ultimo_acesso TIMESTAMP;

CREATE TABLE refresh_token (
    id          BIGSERIAL PRIMARY KEY,
    usuario_id  BIGINT       NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    expires_at  TIMESTAMP    NOT NULL,
    revoked_at  TIMESTAMP,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL
);
CREATE INDEX idx_refresh_token_usuario ON refresh_token(usuario_id);

CREATE TABLE password_reset_token (
    id          BIGSERIAL PRIMARY KEY,
    usuario_id  BIGINT       NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL,
    expires_at  TIMESTAMP    NOT NULL,
    used_at     TIMESTAMP,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL
);
CREATE INDEX idx_reset_token_usuario ON password_reset_token(usuario_id);
```

✅ **Verificar:** `./mvnw spring-boot:run` arranca sem erro Flyway; no Postgres, `\d refresh_token` existe.

## Passo 1.2 — Config: segredo JWT e mail no `.env`

Gerar o segredo (512 bits para HS256):

```bash
openssl rand -base64 64
```

Juntar ao `.env` (na raiz do `backend/` ou do repo — o `application.yaml` já importa ambos):

```properties
JWT_SECRET=<colar-o-base64-aqui>
JWT_ACCESS_TTL_MINUTES=15
JWT_REFRESH_TTL_DAYS=7
FRONTEND_URL=http://localhost:4200
# SMTP opcional — se faltar, o link de reset é logado na consola
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
```

Juntar ao `application.yaml`:

```yaml
jwt:
  secret: ${JWT_SECRET}
  access-ttl-minutes: ${JWT_ACCESS_TTL_MINUTES:15}
  refresh-ttl-days: ${JWT_REFRESH_TTL_DAYS:7}

frontend:
  url: ${FRONTEND_URL:http://localhost:4200}
```

Dependência de mail no `pom.xml` (usada só no passo 1.9, mas já fica):

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

✅ **Verificar:** app arranca com as novas propriedades (não há uso ainda — só não pode falhar o placeholder).

## Passo 1.3 — Entidades e repositórios de tokens

Em `modules/auth/model/`:

- `RefreshToken extends BaseEntity`: `id`, `usuario` (`@ManyToOne(fetch = LAZY)` + `@JoinColumn(name = "usuario_id")`), `tokenHash`, `expiresAt` (`LocalDateTime`), `revokedAt`.
- `PasswordResetToken extends BaseEntity`: igual, mas `usedAt` em vez de `revokedAt`.

> ⚠️ `ddl-auto: validate`: os nomes de coluna têm de corresponder (`tokenHash` → `token_hash`, etc.). O Spring faz o mapeamento camelCase→snake_case sozinho.

Em `modules/auth/repository/`:

- `RefreshTokenRepository extends JpaRepository<RefreshToken, Long>` com `Optional<RefreshToken> findByTokenHash(String hash)` e `List<RefreshToken> findAllByUsuarioIdAndRevokedAtIsNull(Long usuarioId)`.
- `PasswordResetTokenRepository` com `Optional<PasswordResetToken> findByTokenHash(String hash)`.

✅ **Verificar:** app arranca — o `validate` confirma que entidade ↔ tabela batem certo.

## Passo 1.4 — JwtService

`modules/auth/security/JwtService.java`. **Atenção: JJWT 0.11.5** — a API é `parserBuilder()`, não `parser()`:

```java
package com.finance.finance.modules.auth.security;

import com.finance.finance.modules.auth.model.Usuario;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final Key key;
    private final long accessTtlMillis;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.access-ttl-minutes}") long accessTtlMinutes) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.accessTtlMillis = accessTtlMinutes * 60_000L;
    }

    public String gerarAccessToken(Usuario usuario) {
        Date agora = new Date();
        return Jwts.builder()
                .setSubject(usuario.getId().toString())
                .claim("email", usuario.getEmail())
                .claim("role", usuario.getPerfil().name()) // Sprint 2: usuario.getRole().getCodigo()
                .setIssuedAt(agora)
                .setExpiration(new Date(agora.getTime() + accessTtlMillis))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /** Lança JwtException se inválido ou expirado. */
    public Jws<Claims> validar(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }
}
```

✅ **Verificar:** compila (`./mvnw compile`).

## Passo 1.5 — AuthService + AuthController

**DTOs** em `modules/auth/dto/`: `LoginRequestDTO(email, senha)`, `LoginResponseDTO(accessToken, refreshToken)`, `RefreshRequestDTO(refreshToken)`, `ChangePasswordRequestDTO(senhaAtual, novaSenha, confirmacao)`, `ForgotPasswordRequestDTO(email)`, `ResetPasswordRequestDTO(token, novaSenha, confirmacao)`, `MeResponseDTO(id, nome, email, role, permissoes, ultimoAcesso, criadoEm)`.

**`modules/auth/service/AuthService.java`** — lógica:

```java
public LoginResponseDTO login(LoginRequestDTO dto) {
    Usuario usuario = usuarioRepository.findByEmail(dto.getEmail()).orElse(null);
    // MESMA mensagem para user inexistente, inativo ou senha errada
    if (usuario == null || usuario.getSituacao() != Situacao.ATIVO
            || !passwordEncoder.matches(dto.getSenha(), usuario.getSenha())) {
        throw new BusinessException("Email ou senha inválidos");
    }
    usuario.setUltimoAcesso(LocalDateTime.now());
    return new LoginResponseDTO(jwtService.gerarAccessToken(usuario), criarRefreshToken(usuario));
}

private String criarRefreshToken(Usuario usuario) {
    String cru = UUID.randomUUID().toString() + UUID.randomUUID();
    RefreshToken rt = new RefreshToken();
    rt.setUsuario(usuario);
    rt.setTokenHash(sha256(cru));                       // nunca guardar o valor cru
    rt.setExpiresAt(LocalDateTime.now().plusDays(refreshTtlDias));
    refreshTokenRepository.save(rt);
    return cru;                                          // devolvido UMA vez
}

private String sha256(String valor) {
    try {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        return HexFormat.of().formatHex(md.digest(valor.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException e) { throw new IllegalStateException(e); }
}
```

`refresh(dto)`: buscar por hash → rejeitar se `revokedAt != null` ou expirado → **rotação**: marcar `revokedAt = now()` no antigo, criar novo → devolver par novo.

`logout(usuarioId, refreshToken)`: revogar esse refresh (ou todos do user — decidir; o plano diz revogar o refresh na BD).

**`modules/auth/controller/AuthController.java`** (`@RestController` + `@RequestMapping("/auth")` — o prefixo `/api` é automático):

| Método | Notas |
|---|---|
| `POST /auth/login` | público |
| `POST /auth/refresh` | público (o refresh é a credencial) |
| `POST /auth/logout` | autenticado |
| `GET /auth/me` | autenticado; devolve perfil + role + `permissoes[]` (Sprint 1: lista vazia ou derivada do enum) |
| `PATCH /auth/me` | nome e email próprios — reutilizar `validarEmailUnico` do `UsuarioService` |
| `POST /auth/change-password` | valida senha actual com `passwordEncoder.matches`; nova ≠ actual; confirmação igual |
| `POST /auth/forgot-password` | público; **sempre 200** (passo 1.9) |
| `POST /auth/reset-password` | público (passo 1.9) |

Para obter o user autenticado: `Authentication auth = SecurityContextHolder.getContext().getAuthentication()` → `Long userId = Long.valueOf(auth.getName())`.

✅ **Verificar:** compila. Ainda não fecha a segurança — isso é o próximo passo.

## Passo 1.6 — Filtro JWT + fechar o SecurityConfig

`modules/auth/security/JwtAuthenticationFilter.java`:

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.validar(header.substring(7)).getBody();
                var authentication = new UsernamePasswordAuthenticationToken(
                        claims.getSubject(), null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + claims.get("role", String.class))));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException e) {
                SecurityContextHolder.clearContext(); // segue sem auth → 401 adiante
            }
        }
        chain.doFilter(request, response);
    }
}
```

Reescrever `config/SecurityConfig.java`:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/api/auth/login",
                        "/api/auth/forgot-password",
                        "/api/auth/reset-password",
                        "/api/auth/refresh",
                        "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html",
                        "/actuator/**"
                ).permitAll()
                .anyRequest().authenticated())
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

> ⚠️ Os matchers levam `/api` porque o prefixo é aplicado no MVC, e a security chain vê o path final.

✅ **Verificar (checkpoint grande — testar com curl):**

```bash
# 1. Sem token → 401
curl -i http://localhost:8081/api/usuarios

# 2. Login com um user existente → 200 + accessToken + refreshToken
curl -X POST http://localhost:8081/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@finance.com","senha":"123456"}'

# 3. Com token → 200
TOKEN=<colar-accessToken>
curl http://localhost:8081/api/usuarios -H "Authorization: Bearer $TOKEN"

# 4. Login errado → mesma mensagem para email inexistente e senha errada
curl -X POST http://localhost:8081/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"naoexiste@x.com","senha":"qualquer"}'

# 5. Refresh → par novo; repetir com o MESMO refresh → 401/400 (rotação)
curl -X POST http://localhost:8081/api/auth/refresh \
  -H 'Content-Type: application/json' -d '{"refreshToken":"<colar>"}'

# 6. /auth/me devolve o user e ultimo_acesso foi gravado
curl http://localhost:8081/api/auth/me -H "Authorization: Bearer $TOKEN"
```

## Passo 1.7 — Angular: AuthService, interceptor, guard

Criar `frontend/src/app/core/auth/` (pasta nova):

**`auth.service.ts`** — access token **em memória** (signal), refresh em memória também (v1 simples) ou cookie HttpOnly (ideal; exige o backend fazer `Set-Cookie` no login — pode ficar para o Sprint 4):

```ts
@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);
  private api = "http://localhost:8081/api/auth";

  currentUser = signal<MeResponse | null>(null);
  permissoes = computed(() => this.currentUser()?.permissoes ?? []);

  login(email: string, senha: string) {
    return this.http.post<LoginResponse>(`${this.api}/login`, { email, senha }).pipe(
      tap((res) => sessionStorage.setItem("access_token", res.accessToken)),
      tap((res) => sessionStorage.setItem("refresh_token", res.refreshToken)),
      switchMap(() => this.loadMe()),
    );
  }

  loadMe() {
    return this.http.get<MeResponse>(`${this.api}/me`).pipe(
      tap((me) => this.currentUser.set(me)),
    );
  }

  refresh() {
    const refreshToken = sessionStorage.getItem("refresh_token");
    return this.http.post<LoginResponse>(`${this.api}/refresh`, { refreshToken }).pipe(
      tap((res) => sessionStorage.setItem("access_token", res.accessToken)),
      tap((res) => sessionStorage.setItem("refresh_token", res.refreshToken)),
    );
  }

  logout() {
    const refreshToken = sessionStorage.getItem("refresh_token");
    return this.http.post<void>(`${this.api}/logout`, { refreshToken }).pipe(
      finalize(() => {
        sessionStorage.clear();
        this.currentUser.set(null);
      }),
    );
  }

  get accessToken() { return sessionStorage.getItem("access_token"); }
}
```

> O plano diz “access em memória”. `sessionStorage` é o compromisso pragmático da v1 (sobrevive a F5); anotar para endurecer no Sprint 4.

**`auth.interceptor.ts`** (funcional):

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.accessToken;

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes("/auth/")) {
        return auth.refresh().pipe(
          switchMap(() => next(authReq.clone({
            setHeaders: { Authorization: `Bearer ${auth.accessToken}` },
          }))),
          catchError(() => {
            router.navigate(["/signin"]);
            return throwError(() => err);
          }),
        );
      }
      return throwError(() => err);
    }),
  );
};
```

Registar em `app.config.ts`: `provideHttpClient(withInterceptors([authInterceptor]))`.

**`auth.guard.ts`**:

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.accessToken) return router.createUrlTree(["/signin"]);
  if (auth.currentUser()) return true;
  return auth.loadMe().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(["/signin"]))),
  );
};
```

Em `app.routes.ts`, aplicar ao layout:

```ts
{
  path: "",
  component: AppLayoutComponent,
  canActivate: [authGuard],
  children: [ /* ... tudo igual ... */ ],
},
```

✅ **Verificar:** abrir `http://localhost:4200/dashboard` sem login → redireciona para `/signin`.

## Passo 1.8 — Ligar os ecrãs login / forgot / reset

- `shared/components/auth/signin-form/signin-form.component.ts`: substituir o `setTimeout` (linha ~54) por `authService.login(...)`. Em erro 400/401 → mensagem “Email ou senha inválidos”. Em sucesso → `router.navigate(["/dashboard"])`.
- `forgot-password.component.ts`: `POST /api/auth/forgot-password` → mostrar sempre “Se o email existir, receberás um link”.
- `reset-password.component.ts`: ler `token` da query string (`ActivatedRoute.queryParamMap`) → `POST /api/auth/reset-password` → sucesso → `/signin`.
- Header da app (dropdown do user): ligar “Sign out” ao `authService.logout()` → `/signin`.

✅ **Verificar:** fluxo completo login → dashboard → F5 (guarda + `loadMe`) → logout → `/signin`.

## Passo 1.9 — Esqueci a senha + email

`modules/auth/service/PasswordResetService.java`:

1. `forgotPassword(email)`: se o user existe e está ATIVO → token de 32 bytes (`SecureRandom` + Base64URL), guardar **hash** + `expires_at = now()+1h`, marcar tokens anteriores como usados. **Retornar 200 sempre.**
2. `resetPassword(token, novaSenha)`: buscar por hash → validar expiração e `usedAt == null` → `passwordEncoder.encode` → marcar `usedAt` → **revogar todos os refresh** do user.

`modules/auth/service/MailService.java`:

```java
public void enviarLinkReset(String para, String token) {
    String link = frontendUrl + "/reset-password?token=" + token;
    if (mailSender == null || hostEstaVazio) {
        log.info("SMTP não configurado. Link de reset para {}: {}", para, link);
        return;
    }
    // SimpleMailMessage com o link
}
```

Tornar o `JavaMailSender` opcional: configurar `spring.mail.*` só se `MAIL_HOST` estiver preenchido (usar `@ConditionalOnProperty` num `MailConfig` ou simplesmente verificar a propriedade no service).

✅ **Verificar (checkpoint do Sprint 1):**
- `POST /api/auth/forgot-password` com email inexistente → 200 igual.
- Com email real → link aparece no log → abrir `http://localhost:4200/reset-password?token=...` → nova senha → login com a nova senha funciona; refresh tokens antigos revogados.

---

# Sprint 2 — Modelo de roles

**Objectivo:** matriz de permissões na BD, filtro que a aplica, API para o admin.

## Passo 2.1 — Migration V4

`V4__roles_dinamicas.sql`:

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

| Método | Notas |
|---|---|
| `GET /roles` | lista com nº de users por role |
| `POST /roles` | criar vazia; `sistema` sempre `false` |
| `GET /roles/{id}` | role + árvore `modulo → [{ codigo, acao, metodo, path, granted }]` |
| `PUT /roles/{id}` | nome/descrição + `permissaoIds`; recusar se `sistema = true`; invalidar cache |
| `DELETE /roles/{id}` | só se `sistema = false` **e** 0 users |
| `GET /permissoes` | catálogo agrupado por módulo |

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
@Directive({ selector: "[hasPermission]", standalone: true })
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private auth = inject(AuthService);

  @Input() set hasPermission(codigo: string) {
    const isAdmin = this.auth.currentUser()?.role === "ADMIN";
    if (isAdmin || this.auth.permissoes().includes(codigo)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
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
|---|---|
| Security matcher sem `/api` → tudo 401/403 | Matchers sempre com `/api/...` |
| `ddl-auto: validate` rebenta após V4 | Mudar entidade + DTOs + mapper no mesmo commit da migration |
| `Jwts.parser()` não existe no 0.11.5 | Usar `parserBuilder()` (ver Passo 1.4) |
| Segredo JWT curto → `WeakKeyException` | Base64 de 64 bytes (`openssl rand -base64 64`) |
| F5 no Angular perde o user | Guard chama `loadMe()` (Sprint 1) / `refresh()` (Sprint 4) |
| Sync do catálogo cria permissões para `/roles` | Excluir `roles.*`/`permissoes.*` do catálogo; só bypass ADMIN |
| `perfil` ainda referenciado no frontend | Select de roles substitui o enum no Sprint 3.3 |
| Logout só limpa o cliente | Chamar `POST /auth/logout` para revogar o refresh na BD |

---

# Ordem de commits sugerida

1. `V3` + entidades de token + config JWT
2. `JwtService` + `AuthService` + `AuthController` (login/refresh/logout/me/change-password)
3. Filtro JWT + `SecurityConfig` fechado ← **a API fica protegida aqui**
4. Angular: service + interceptor + guard + ecrãs ligados
5. Forgot/reset + mail/log
6. `V4` + entidades role/permissao + migração de dados
7. Sync do catálogo + filtro de permissões + cache
8. API `/roles` + `/permissoes`
9. UI roles (lista + matriz) + select de role em users
10. Directiva + sidebar + guards de rota
11. Sprint 4 (rate limit, cookies, testes)
