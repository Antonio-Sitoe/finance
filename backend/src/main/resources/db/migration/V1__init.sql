-- V1: Schema inicial do sistema Finance
-- Baseline para bases de dados já existentes (criadas pelo Hibernate).
-- Em bases de dados novas (vazias), este script cria todo o schema.

CREATE TABLE IF NOT EXISTS usuario (
    id          BIGSERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    senha       VARCHAR(255) NOT NULL,
    perfil      VARCHAR(20)  NOT NULL,
    situacao    VARCHAR(20)  NOT NULL,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL
);

CREATE TABLE IF NOT EXISTS categoria (
    id          BIGSERIAL PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    debito      BOOLEAN,
    credito     BOOLEAN,
    id_pai      BIGINT REFERENCES categoria(id),
    descricao   TEXT,
    situacao    VARCHAR(20)  NOT NULL,
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL
);

CREATE TABLE IF NOT EXISTS contas (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(255) NOT NULL,
    agencia         VARCHAR(255) NOT NULL,
    observacao      VARCHAR(255) NOT NULL,
    conta_corrente  VARCHAR(255) NOT NULL UNIQUE,
    data_inclusao   TIMESTAMP    NOT NULL,
    situacao        VARCHAR(20)  NOT NULL,
    created_at      TIMESTAMP    NOT NULL,
    updated_at      TIMESTAMP    NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    id                  BIGSERIAL PRIMARY KEY,
    nome_empresarial    VARCHAR(255) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    telefone            VARCHAR(255),
    endereco            VARCHAR(255) NOT NULL,
    numero              VARCHAR(255) NOT NULL,
    complemento         VARCHAR(255) NOT NULL,
    cidade              VARCHAR(255) NOT NULL,
    estado              VARCHAR(255) NOT NULL,
    nota                INTEGER      NOT NULL,
    situacao            VARCHAR(20)  NOT NULL,
    created_at          TIMESTAMP    NOT NULL,
    updated_at          TIMESTAMP    NOT NULL
);

CREATE TABLE IF NOT EXISTS contactos (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(255) NOT NULL,
    departamento    VARCHAR(255),
    email           VARCHAR(255) NOT NULL,
    telefone        VARCHAR(255) NOT NULL,
    situacao        VARCHAR(20)  NOT NULL,
    cliente_id      BIGINT       NOT NULL REFERENCES clientes(id),
    created_at      TIMESTAMP    NOT NULL,
    updated_at      TIMESTAMP    NOT NULL,
    UNIQUE (cliente_id, email),
    UNIQUE (cliente_id, telefone)
);

CREATE TABLE IF NOT EXISTS fornecedor (
    id                  BIGSERIAL PRIMARY KEY,
    nome_empresarial    VARCHAR(255) NOT NULL,
    email               VARCHAR(255) UNIQUE,
    telefone            VARCHAR(15),
    website             VARCHAR(255),
    endereco            VARCHAR(255),
    numero              VARCHAR(255),
    complemento         VARCHAR(255),
    bairro              VARCHAR(255),
    cidade              VARCHAR(255),
    estado              VARCHAR(2),
    nota                INTEGER,
    situacao            VARCHAR(255) NOT NULL,
    created_at          TIMESTAMP    NOT NULL,
    updated_at          TIMESTAMP    NOT NULL
);

CREATE TABLE IF NOT EXISTS lancamentos (
    id              BIGSERIAL PRIMARY KEY,
    descricao       VARCHAR(255)   NOT NULL,
    parcela         INTEGER        NOT NULL,
    total_parcela   INTEGER        NOT NULL,
    valor           NUMERIC(10, 2) NOT NULL,
    data_lancamento TIMESTAMP      NOT NULL,
    data_vencimento TIMESTAMP      NOT NULL,
    situacao        VARCHAR(20)    NOT NULL,
    tipo            VARCHAR(20)    NOT NULL DEFAULT 'DESPESA',
    id_conta        BIGINT         REFERENCES contas(id),
    id_categoria    BIGINT         REFERENCES categoria(id),
    id_cliente      BIGINT         REFERENCES clientes(id),
    id_fornecedor   BIGINT         REFERENCES fornecedor(id),
    created_at      TIMESTAMP      NOT NULL,
    updated_at      TIMESTAMP      NOT NULL
);
