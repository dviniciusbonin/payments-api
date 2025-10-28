# Payments API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

API para gerenciamento de clientes e cobranças com suporte a múltiplos métodos de pagamento (PIX, Cartão de Crédito e Boleto Bancário).

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

**Para executar com Docker:**

- Docker
- Docker Compose

**Para desenvolvimento local:**

- Node.js 22.15
- pnpm (gerenciador de pacotes)

## Configuração do Ambiente

1. Clone o repositório para sua máquina local
2. Navegue até a pasta do projeto
3. Crie um arquivo `.env` na raiz do projeto baseado no arquivo `env.example`:
   ```bash
   cp env.example .env
   ```

## Executando a Aplicação

**Com Docker:**

```bash
docker-compose up -d
```

**Rodar testes com Docker:**

```bash
# Rodar testes E2E
docker-compose --profile test run --rm test
```

**Nota:** O projeto possui dois Dockerfiles:

- `Dockerfile` - Imagem otimizada para produção (multi-stage build)
- `Dockerfile.dev` - Imagem para desenvolvimento e testes (com devDependencies)

## Documentação da API

A API possui documentação interativa através do Swagger UI, disponível em:

**http://localhost:[PORT]/api/docs**

Navegando para esta URL, você encontrará:

- Todos os endpoints disponíveis
- Descrição de cada endpoint
- Exemplos de requisições e respostas
- Possibilidade de testar os endpoints diretamente pelo navegador

## Fluxo de Requisições

### 1. Gerenciamento de Clientes

#### a) Criar um Cliente

**Endpoint:** `POST /customers`

**Descrição:** Cria um novo cliente no sistema

**Payload:**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "document": "12345678900",
  "phone": "11999999999"
}
```

**Resposta (201):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "document": "12345678900",
  "phone": "11999999999",
  "createdAt": "2025-10-28T12:00:00.000Z",
  "updatedAt": "2025-10-28T12:00:00.000Z"
}
```

**Importante:** Guarde o `id` retornado na resposta, pois ele será necessário para criar cobranças.

#### b) Listar Clientes

**Endpoint:** `GET /customers`

**Descrição:** Retorna todos os clientes cadastrados

**Resposta (200):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "document": "12345678900",
    "phone": "11999999999",
    "createdAt": "2025-10-28T12:00:00.000Z",
    "updatedAt": "2025-10-28T12:00:00.000Z"
  }
]
```

### 2. Gerenciamento de Cobranças

#### a) Criar uma Cobrança para um Cliente

**Endpoint:** `POST /charges`

**Descrição:** Cria uma nova cobrança vinculada a um cliente existente

**Nota Importante:** Use o `id` retornado na resposta da criação do cliente como `customerId` nos exemplos abaixo

**Exemplos de Payload por Método de Pagamento:**

**1. Pagamento via PIX**

```json
{
  "customerId": "<ID_DO_CLIENTE_CRIADO>",
  "amount": 100.5,
  "paymentMethod": "PIX",
  "pixKey": "joao@example.com"
}
```

**Resposta (201):**

```json
{
  "id": "abc123...",
  "customerId": "<ID_DO_CLIENTE_CRIADO>",
  "amount": 100.5,
  "currency": "BRL",
  "paymentMethod": "PIX",
  "status": "PENDING",
  "paymentDetails": {
    "pixKey": "joao@example.com"
  },
  "createdAt": "2025-10-28T12:00:00.000Z",
  "updatedAt": "2025-10-28T12:00:00.000Z"
}
```

**2. Pagamento via Cartão de Crédito**

```json
{
  "customerId": "<ID_DO_CLIENTE_CRIADO>",
  "amount": 500.0,
  "paymentMethod": "CREDIT_CARD",
  "cardInstallments": 3,
  "cardLastDigits": "1234"
}
```

**Resposta (201):**

```json
{
  "id": "def456...",
  "customerId": "<ID_DO_CLIENTE_CRIADO>",
  "amount": 500.0,
  "currency": "BRL",
  "paymentMethod": "CREDIT_CARD",
  "status": "PENDING",
  "paymentDetails": {
    "cardInstallments": 3,
    "cardLastDigits": "1234"
  },
  "createdAt": "2025-10-28T12:00:00.000Z",
  "updatedAt": "2025-10-28T12:00:00.000Z"
}
```

**3. Pagamento via Boleto Bancário**

```json
{
  "customerId": "<ID_DO_CLIENTE_CRIADO>",
  "amount": 250.75,
  "paymentMethod": "BOLETO",
  "boletoDueDate": "2025-12-31"
}
```

**Resposta (201):**

```json
{
  "id": "ghi789...",
  "customerId": "<ID_DO_CLIENTE_CRIADO>",
  "amount": 250.75,
  "currency": "BRL",
  "paymentMethod": "BOLETO",
  "status": "PENDING",
  "paymentDetails": {
    "boletoDueDate": "2025-12-31"
  },
  "createdAt": "2025-10-28T12:00:00.000Z",
  "updatedAt": "2025-10-28T12:00:00.000Z"
}
```

#### b) Listar Cobranças

**Endpoint:** `GET /charges`

**Descrição:** Retorna todas as cobranças cadastradas

**Resposta (200):**

```json
[
  {
    "id": "abc123...",
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": 100.5,
    "currency": "BRL",
    "paymentMethod": "PIX",
    "status": "PENDING",
    "paymentDetails": {
      "pixKey": "joao@example.com"
    },
    "createdAt": "2025-10-28T12:00:00.000Z",
    "updatedAt": "2025-10-28T12:00:00.000Z"
  }
]
```

## CI/CD com GitHub Actions

O projeto utiliza GitHub Actions para integração contínua com os seguintes workflows:

### 1. Build (`.github/workflows/build.yml`)

- Executa o build do projeto
- Verifica se o código compila corretamente
- Executa em: push e pull requests

### 2. Lint (`.github/workflows/lint.yml`)

- Executa o ESLint para garantir padrões de código
- Valida a formatação e estilo do código
- Executa em: push e pull requests

### 3. Tests (`.github/workflows/tests.yml`)

- Executa testes E2E com Testcontainers
- Utiliza PostgreSQL em container para testes
- Valida a integridade da aplicação
- Executa em: push e pull requests

Todos os workflows são executados automaticamente em push e pull requests, garantindo a qualidade do código em cada alteração.

## Arquitetura

O projeto segue os princípios da **Arquitetura Hexagonal (Ports and Adapters)**, separando as regras de negócio de implementações externas.

### Estrutura de Camadas

**Domain** (`src/domain/`)

- Entidades de negócio (`Customer`, `Charge`)
- Value Objects (`Email`, `Document`)
- Interfaces de repositórios
- Regras de negócio puras

**Application** (`src/application/`)

- Casos de uso (use cases)
- DTOs internos
- Lógica de aplicação
- Orquestração de domínio

**Infrastructure** (`src/infrastructure/`)

- Controladores HTTP (NestJS)
- Repositórios Prisma
- Persistência de dados
- DTOs externos com validações e Swagger
- Adaptadores de frameworks

## Licença

Este projeto está licenciado sob a MIT License.

## Autor

**Douglas Vinicius Caldas Bonin**

- GitHub: [@dviniciusbonin](https://github.com/dviniciusbonin)
- LinkedIn: [Douglas Bonin](https://linkedin.com/in/dviniciusbonin)
