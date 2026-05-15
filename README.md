# Finance — Sistema de Gestão Financeira Empresarial

> Uma plataforma completa e centralizada para gerenciar todas as operações financeiras da sua empresa.

---

## 📋 Sobre o Projeto

O **Finance** é um sistema web robusto e intuitivo de gestão financeira empresarial. Foi desenvolvido para permitir que empresas controlem suas finanças de forma centralizada, gerenciando clientes, fornecedores, contas bancárias, categorias de receitas e despesas, e lançamentos financeiros com suporte a parcelamento automático.

O sistema oferece uma visão clara e em tempo real do fluxo de caixa, dashboards interativos com indicadores financeiros relevantes e relatórios exportáveis, ajudando na tomada de decisão estratégica.

---

## 🎯 Objectivos Principais

O Finance foi concebido para fornecer uma plataforma completa que permita:

- ✅ Registar e acompanhar receitas e despesas com precisão
- ✅ Gerir clientes, fornecedores e contactos de forma centralizada
- ✅ Controlar contas bancárias e categorizar receitas e despesas
- ✅ Criar lançamentos financeiros com parcelamento automático
- ✅ Visualizar o fluxo de caixa e saldo por período
- ✅ Gerar relatórios financeiros detalhados por categoria, cliente e período
- ✅ Pesquisar rapidamente clientes, fornecedores e lançamentos

---

## 🏗️ Módulos do Sistema

| Módulo | Descrição |
|--------|-----------|
| **🔐 Autenticação** | Sistema de login com JWT, gestão de usuários e perfis (ADMIN / USER) |
| **📊 Dashboard** | Indicadores financeiros em tempo real, gráficos de despesas, receitas e saldo |
| **👥 Clientes** | CRUD completo de clientes empresariais com CNPJ, endereço e informações |
| **📞 Contactos** | Gestão de contactos vinculados a clientes (nome, CPF, departamento) |
| **🏢 Fornecedores** | CRUD de fornecedores com dados fiscais, endereço e histórico |
| **🏦 Contas** | Gestão de contas bancárias e caixa (agência, conta corrente, observações) |
| **📁 Categorias** | Categorias hierárquicas de receita e despesa com subcategorias |
| **💰 Lançamentos** | Módulo principal — registo de receitas/despesas com parcelamento automático |
| **📈 Fluxo de Caixa** | Visualização de movimentações, saldo inicial/final, entradas/saídas |
| **📑 Relatórios** | Relatórios por período, categoria e cliente, com exportação CSV/Excel |
| **🔍 Pesquisa Global** | Busca rápida e avançada de clientes, fornecedores e lançamentos |

---

## 💻 Tecnologias Utilizadas

### Backend

- **Java 17+** — Linguagem de programação principal
- **Spring Boot** — Framework (Web, Data JPA, Security, Validation)
- **PostgreSQL** — Base de dados relacional
- **JWT** — Autenticação segura com tokens
- **Hibernate Validator** — Validações de dados robustas
- **Maven** — Gerenciamento de dependências

### Frontend

- **Angular** — Framework JavaScript moderno
- **Chart.js** — Gráficos interativos para o dashboard

---

## 📊 Modelo de Dados

O sistema é fundamentado em 6 entidades principais que se relacionam entre si:

### Entidades Principais

#### 1. **Cliente**
- Empresa com CNPJ, endereço completo e dados de contacto
- Status ativo/inativo
- Auditoria (criado em, atualizado em, criado por)

#### 2. **Contacto**
- Pessoa vinculada a um cliente
- Nome, CPF, departamento e informações adicionais
- Vinculação direta ao cliente

#### 3. **Fornecedor**
- Empresa fornecedora com dados fiscais
- Endereço e informações de contacto
- Status ativo/inativo

#### 4. **Conta**
- Conta bancária ou caixa
- Agência, conta corrente, observações
- Saldo e movimentação

#### 5. **Categoria**
- Classificação hierárquica de receitas/despesas
- Suporte a subcategorias (categoria pai)
- Tipo (receita ou despesa)

#### 6. **Lançamento** (Transação)
- Registo financeiro central
- Atributos: valor, parcelas, datas, status
- Vinculações: categoria, conta, cliente, fornecedor
- Suporte a parcelamento automático

### Enums (Enumerações)

#### `situacao_enum`
- **ATIVO** — Elemento ativo no sistema
- **INATIVO** — Elemento inativo no sistema

*Usado em: Clientes, Fornecedores, Contas, Categorias, Contactos*

#### `pagamento_enum`
- **PAGO** — Lançamento totalmente pago
- **PENDENTE** — Lançamento ainda não pago

*Usado em: Lançamentos*

---

## 🏛️ Arquitetura — Package by Feature

O projeto segue a arquitetura **Package by Feature**, organizado em camadas bem definidas para cada módulo funcional.

### Estrutura Global

```
src/main/java/com/finance
├── config/                 # Configurações transversais
├── exceptions/             # Tratamento global de erros
├── utils/                  # Classes utilitárias compartilhadas
└── modules/                # Módulos de negócio
```

### Pacotes Globais

#### **config/** — Configurações do Sistema

```
config/
├── SecurityConfig         # Configuração de segurança e JWT
├── ApiPrefixConfig        # Prefixo de API e CORS
├── PasswordConfig         # Hashing e validação de senhas
└── SwaggerConfig          # Documentação OpenAPI/Swagger
```

#### **exceptions/** — Tratamento de Erros

```
exceptions/
├── ResourceNotFoundException    # Erro 404 — Recurso não encontrado
├── BusinessException           # Erro de regra de negócio
├── ApiErrorResponse            # Formato padrão de resposta de erro
└── GlobalExceptionHandler      # Handler global de exceções
```

#### **utils/** — Utilitários Compartilhados

```
utils/
├── DateUtil           # Operações com datas
└── ValidatorUtil      # Validações reutilizáveis
```

### Estrutura de Módulos

Cada módulo dentro de `modules/` segue a mesma estrutura em camadas:

```
modules/{moduleName}/
├── controller/         # REST Controllers — Endpoints da API
├── service/            # Lógica de negócio
├── repository/         # Acesso a dados (Data Access Layer)
├── model/              # Entidades JPA
├── dto/                # Data Transfer Objects (Request/Response)
└── mapper/             # Conversão entre Model e DTO
```

### Módulos Implementados

#### **modules/auth/**
```
modules/auth/
├── controller/
│   └── AuthController              # Endpoints de autenticação
├── service/
│   └── AuthService                 # Lógica de login e JWT
├── repository/
│   └── UserRepository              # Acesso a usuários
├── model/
│   └── User                        # Entidade de usuário
└── dto/
    ├── LoginRequestDTO             # Credenciais de login
    └── LoginResponseDTO            # Token JWT e dados do usuário
```

#### **modules/categoria/**
```
modules/categoria/
├── controller/
│   └── CategoryController          # CRUD de categorias
├── service/
│   └── CategoryService             # Lógica de categorias
├── repository/
│   └── CategoryRepository          # Acesso a categorias
├── model/
│   ├── Category                    # Entidade de categoria
│   ├── StatusEnum                  # Status (ATIVO/INATIVO)
│   └── PaymentEnum                 # Status pagamento
├── dto/
│   ├── CategoryRequestDTO          # Dados de entrada
│   └── CategoryResponseDTO         # Dados de resposta
└── mapper/
    └── CategoryMapper              # Conversão Model ↔ DTO
```

#### **modules/conta/**
```
modules/conta/
├── controller/
│   └── AccountController           # CRUD de contas
├── service/
│   └── AccountService              # Lógica de contas
├── repository/
│   └── AccountRepository           # Acesso a contas
├── model/
│   └── Account                     # Entidade de conta
├── dto/
│   ├── AccountRequestDTO           # Dados de entrada
│   └── AccountResponseDTO          # Dados de resposta
└── mapper/
    └── AccountMapper               # Conversão Model ↔ DTO
```

#### **modules/clientes/**
```
modules/clientes/
├── controller/
│   └── ClientController            # CRUD de clientes
├── service/
│   └── ClientService               # Lógica de clientes
├── repository/
│   └── ClientRepository            # Acesso a clientes
├── model/
│   └── Client                      # Entidade de cliente
├── dto/
│   ├── ClientRequestDTO            # Dados de entrada
│   └── ClientResponseDTO           # Dados de resposta
└── mapper/
    └── ClientMapper                # Conversão Model ↔ DTO
```

#### **modules/contacto/**
```
modules/contacto/
├── controller/
│   └── ContactController           # CRUD de contactos
├── service/
│   └── ContactService              # Lógica de contactos
├── repository/
│   └── ContactRepository           # Acesso a contactos
├── model/
│   └── Contact                     # Entidade de contacto
├── dto/
│   ├── ContactRequestDTO           # Dados de entrada
│   └── ContactResponseDTO          # Dados de resposta
└── mapper/
    └── ContactMapper               # Conversão Model ↔ DTO
```

#### **modules/fornecedor/**
```
modules/fornecedor/
├── controller/
│   └── SupplierController          # CRUD de fornecedores
├── service/
│   └── SupplierService             # Lógica de fornecedores
├── repository/
│   └── SupplierRepository          # Acesso a fornecedores
├── model/
│   └── Supplier                    # Entidade de fornecedor
├── dto/
│   ├── SupplierRequestDTO          # Dados de entrada
│   └── SupplierResponseDTO         # Dados de resposta
└── mapper/
    └── SupplierMapper              # Conversão Model ↔ DTO
```

#### **modules/Lancamento/**
```
modules/Lancamento/
├── controller/
│   └── TransactionController       # CRUD de lançamentos
├── service/
│   └── TransactionService          # Lógica de lançamentos
├── repository/
│   └── TransactionRepository       # Acesso a lançamentos
├── model/
│   └── Transaction                 # Entidade de lançamento
├── dto/
│   ├── TransactionRequestDTO       # Dados de entrada
│   └── TransactionResponseDTO      # Dados de resposta
└── mapper/
    └── TransactionMapper           # Conversão Model ↔ DTO
```

### Estrutura Completa do Projeto

```
com.finance
│
├── config/
│   ├── SecurityConfig              ✓ Segurança e JWT
│   ├── ApiPrefixConfig             ✓ CORS e prefixo de API
│   ├── PasswordConfig              ✓ Hashing de senhas
│   └── SwaggerConfig               ✓ Documentação OpenAPI
│
├── exceptions/
│   ├── ResourceNotFoundException   ✓ Tratamento 404
│   ├── BusinessException           ✓ Erros de negócio
│   ├── ApiErrorResponse            ✓ Formato de erro padrão
│   └── GlobalExceptionHandler      ✓ Handler central
│
├── utils/
│   ├── DateUtil                    ✓ Operações com datas
│   └── ValidatorUtil               ✓ Validações compartilhadas
│
└── modules/
    │
    ├── auth/
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   ├── model/
    │   └── dto/
    │
    ├── categoria/
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   ├── model/
    │   ├── dto/
    │   └── mapper/
    │
    ├── conta/
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   ├── model/
    │   ├── dto/
    │   └── mapper/
    │
    ├── clientes/
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   ├── model/
    │   ├── dto/
    │   └── mapper/
    │
    ├── contacto/
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   ├── model/
    │   ├── dto/
    │   └── mapper/
    │
    ├── fornecedor/
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   ├── model/
    │   ├── dto/
    │   └── mapper/
    │
    └── Lancamento/
        ├── controller/
        ├── service/
        ├── repository/
        ├── model/
        ├── dto/
        └── mapper/
```

---

## ⚙️ Funcionalidades Transversais

O Finance implementa várias funcionalidades que atravessam todo o sistema:

### Paginação e Ordenação
- Disponível em todas as listagens
- Filtros por página, tamanho e campo de ordenação
- Suporte a ordenação ascendente/descendente

### Filtros Avançados
Todos os módulos suportam filtros por:
- Nome/Descrição
- CNPJ/CPF
- Data (intervalo de datas)
- Categoria, Cliente, Fornecedor
- Conta e Status (ATIVO/INATIVO)

### Sistema de Auditoria
Cada entidade possui campos de auditoria:
- `created_at` — Data e hora de criação
- `updated_at` — Data e hora da última modificação
- `created_by` — Utilizador que criou o registo

### Validações Robustas
Validações implementadas no backend:
- CNPJ obrigatório e validado
- Valores monetários maiores que 0
- Email em formato válido
- CPF validado com algoritmo específico
- Campos obrigatórios conforme regra de negócio

### Tratamento Global de Erros
- Handler global para todas as exceções
- Respostas padronizadas em formato JSON
- Código HTTP apropriado para cada situação
- Mensagens de erro descritivas e úteis

### Controlo de Acesso por Perfil
- **ADMIN** — Acesso total a todos os módulos e funcionalidades
- **USER** — Acesso restrito ao módulo financeiro (Lançamentos)

---

## 📋 Ordem de Implementação

Para implementar o sistema de forma lógica, respeite a ordem abaixo, pois cada módulo pode depender dos anteriores:

1. **📁 Categorias** — Classificação de receitas/despesas
2. **🏦 Contas** — Contas bancárias e de caixa
3. **👥 Clientes** — Dados de clientes empresariais
4. **🏢 Fornecedores** — Dados de fornecedores
5. **📞 Contactos** — Contactos vinculados a clientes
6. **💰 Lançamentos** — Transações financeiras (depende de todos acima)
7. **🔐 Autenticação** — Sistema de login e JWT

> **Nota:** O módulo de Lançamentos (Transações) é central e depende de todos os outros módulos.

---

## 🔗 Endpoints da API

A API segue convenções RESTful com prefixo `/api/v1/`:

### Exemplo de Endpoints (Pattern)

```
GET    /api/v1/{modulo}                 # Listar com paginação
GET    /api/v1/{modulo}/{id}            # Buscar por ID
POST   /api/v1/{modulo}                 # Criar novo
PUT    /api/v1/{modulo}/{id}            # Atualizar
DELETE /api/v1/{modulo}/{id}            # Eliminar
```

### Documentação Interativa

Aceda à documentação Swagger/OpenAPI em:

```
http://localhost:8081/swagger-ui/index.html
```

---

## 🚀 Como Começar

### Pré-requisitos

- **Java 17+** instalado
- **PostgreSQL** configurado
- **Maven** para gerenciar dependências
- **Node.js e npm** para o frontend Angular

### Instalação e Execução

#### Backend

```bash
# Navegar para o diretório backend
cd backend/

# Compilar o projeto
mvn clean install

# Executar a aplicação
mvn spring-boot:run

# A aplicação estará disponível em http://localhost:8081
```

#### Frontend

```bash
# Instalar dependências Angular
npm install

# Executar em modo desenvolvimento
ng serve

# Abrir navegador em http://localhost:4200
```

---

## 📚 Estrutura de Ficheiros

```
finance/
├── README.md                     # Este ficheiro
├── 0.overview.md                 # [Arquivo — integrado no README]
├── 2.folder_struture.md          # [Arquivo — integrado no README]
├── backend/
│   ├── pom.xml                   # Configuração Maven
│   ├── mvnw / mvnw.cmd           # Maven Wrapper
│   ├── src/
│   │   ├── main/java/com/finance/
│   │   │   ├── FinanceApplication.java
│   │   │   ├── config/
│   │   │   ├── exceptions/
│   │   │   ├── utils/
│   │   │   └── modules/
│   │   ├── main/resources/
│   │   │   ├── application.yaml
│   │   │   ├── static/
│   │   │   └── templates/
│   │   └── test/
│   └── target/                   # Build output
├── documents/
│   ├── 3.requirements.md          # Requisitos do sistema
│   ├── activities - checkList/
│   ├── database/
│   ├── queries 140-160 Relatorios/
│   ├── queries 170-190 Transacoes/
│   └── queries 190-200 Views/
└── [frontend/]                   # Frontend Angular (a implementar)
```

---

## 🎓 Referências e Exemplos

Alguns repositórios de referência para melhorar as práticas:

- [Flow Inquiry](https://github.com/flowinquiry/flowinquiry) — Exemplo de organização de projeto
- [Real World App](https://github.com/gothinkster/spring-boot-realworld-example-app/tree/master) — Exemplo Spring Boot
- [Microservices](https://github.com/sqshq/piggymetrics) — Exemplo de arquitetura

---

## 📧 Suporte

Para questões, sugestões ou relatar problemas, consulte a documentação do projeto ou contacte a equipa de desenvolvimento.

---

**Versão:** 1.0  
**Última atualização:** Maio 2026  
**Status:** Em desenvolvimento 🚀
