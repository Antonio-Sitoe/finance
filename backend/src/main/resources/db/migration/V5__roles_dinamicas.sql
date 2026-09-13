-- Sprint 2: roles dinâmicas + migração usuario.perfil → role_id

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
    codigo       VARCHAR(120) NOT NULL UNIQUE,
    modulo       VARCHAR(60)  NOT NULL,
    acao         VARCHAR(60)  NOT NULL,
    metodo       VARCHAR(10)  NOT NULL,
    path_pattern VARCHAR(255) NOT NULL,
    descricao    VARCHAR(255),
    created_at   TIMESTAMP    NOT NULL,
    updated_at   TIMESTAMP    NOT NULL
);

CREATE TABLE role_permissao (
    role_id      BIGINT NOT NULL REFERENCES role(id) ON DELETE CASCADE,
    permissao_id BIGINT NOT NULL REFERENCES permissao(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permissao_id)
);

INSERT INTO role (codigo, nome, descricao, sistema, created_at, updated_at)
VALUES ('ADMIN', 'Administrador', 'Acesso total', TRUE, now(), now()),
       ('USER',  'Utilizador',    'Leitura do financeiro', FALSE, now(), now());

ALTER TABLE usuario ADD COLUMN role_id BIGINT;

UPDATE usuario u
SET role_id = r.id
FROM role r
WHERE r.codigo = u.perfil;

ALTER TABLE usuario ALTER COLUMN role_id SET NOT NULL;
ALTER TABLE usuario ADD CONSTRAINT fk_usuario_role FOREIGN KEY (role_id) REFERENCES role(id);
ALTER TABLE usuario DROP COLUMN perfil;

CREATE INDEX idx_usuario_role ON usuario(role_id);
CREATE INDEX idx_permissao_modulo ON permissao(modulo);
