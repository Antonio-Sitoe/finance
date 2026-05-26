## 1️⃣ Autenticação e usuários

Funcionalidades básicas de segurança com Spring Security e JWT.
Dois perfis de acesso: **ADMIN** (acesso total) e **USER** (acesso limitado).

---

### Autenticação

* [ ] Login com email e senha
* [ ] Logout (invalidar token no cliente)
* [ ] Sessão com token JWT
* [ ] Expiração de token (refresh token)
* [ ] Role Based Access — ADMIN / USER

---

### Gestão de Utilizadores (apenas ADMIN)

* [x] Criar utilizador (nome, email, senha, perfil, situação)
* [x] Editar utilizador (todos os campos incluindo senha)
* [x] Desativar utilizador (soft delete — muda situação para INATIVO)
* [x] Listar utilizadores com paginação
* [x] Ver detalhe de utilizador por ID

---

### Perfil do Utilizador (todos os roles)

* [ ] Ver o próprio perfil (nome, email, perfil, situação, data de criação)
* [ ] Editar o próprio nome e email
* [ ] Alterar a própria password (campo senha actual + nova senha + confirmação)
* [ ] Ver data e hora do último acesso

---

### UI — Estado dos prompts

* [x] Tela de Login + Esqueci a Password
* [x] Gestão de Utilizadores (ADMIN)
* [x] Perfil do Utilizador