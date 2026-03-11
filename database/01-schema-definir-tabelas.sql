CREATE TYPE situacao_enum AS ENUM ('ATIVO', 'INATIVO');
CREATE TYPE pagamento_enum AS ENUM ('PAGO', 'PENDENTE');

CREATE TABLE cliente (
  id SERIAL PRIMARY KEY,
  nome_empresarial VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL,
  ie VARCHAR(20),
  email VARCHAR(255),
  telefone VARCHAR(15),
  cep VARCHAR(9),
  endereco VARCHAR(255),
  numero VARCHAR(10),
  complemento VARCHAR(255),
  cidade VARCHAR(255),
  estado VARCHAR(2),
  nota INTEGER,
  situacao situacao_enum NOT NULL
);

CREATE TABLE contacto (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  departamento VARCHAR(255),
  email VARCHAR(255),
  cpf VARCHAR(14) NOT NULL,
  telefone VARCHAR(9),
  situacao situacao_enum NOT NULL,
  cliente_id INT REFERENCES cliente(id)
);

CREATE TABLE fornecedor (
  id SERIAL PRIMARY KEY,
  nome_empresarial VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL,
  ie VARCHAR(20),
  email VARCHAR(255),
  telefone VARCHAR(15),
  website VARCHAR(255),
  cep VARCHAR(9),
  endereco VARCHAR(255),
  numero VARCHAR(255),
  complemento VARCHAR(255),
  bairro VARCHAR(255),
  cidade VARCHAR(255),
  estado VARCHAR(2),
  nota INTEGER,
  situacao situacao_enum NOT NULL
);

CREATE TABLE conta (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  agencia VARCHAR(20) NOT NULL,
  conta_corrente VARCHAR(255) NOT NULL,
  data_inclusao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacao TEXT,
  situacao situacao_enum NOT NULL
);

CREATE TABLE categoria (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  debito BOOLEAN,
  credito BOOLEAN,
  id_pai INTEGER REFERENCES categoria(id),
  descricao TEXT,
  situacao situacao_enum NOT NULL
);

CREATE TABLE lancamento (
  id SERIAL PRIMARY KEY,
  parcela INTEGER NOT NULL,
  total_parcela INTEGER NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_lancamento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_vencimento TIMESTAMP NOT NULL,
  descricao TEXT,
  situacao pagamento_enum NOT NULL,
  id_conta INTEGER REFERENCES conta(id),
  id_categoria INTEGER REFERENCES categoria(id),
  id_cliente INTEGER REFERENCES cliente(id),
  id_fornecedor INTEGER REFERENCES fornecedor(id)
);
