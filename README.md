# Sistema de Gerenciamento de Alunos (SGA) - Backend

Plataforma completa para gerenciamento administrativo de instituições educacionais. Backend desenvolvido com **Spring Boot**, **PostgreSQL** e **Docker**.

## 📋 Características

A API RESTful fornece funcionalidades completas para gerenciamento educacional:

- **Gestão de Alunos**: Cadastro, atualização, busca e ativação/desativação de alunos
- **Gestão de Professores**: Gerenciamento de dados profissionais e acadêmicos dos professores
- **Gestão de Cursos**: Criação e manutenção de cursos oferecidos pela instituição
- **Gestão de Turmas**: Organização de turmas com professor e período específicos
- **Matrículas**: Inscrição de alunos em turmas com controle de status
- **Notas**: Registro de avaliações e cálculo de médias
- **Frequência**: Controle de presença com relatórios de taxa de frequência
- **Autenticação JWT**: Segurança com tokens JWT para proteção de endpoints

## 🛠️ Tecnologias

| Componente | Versão | Descrição |
|-----------|--------|-----------|
| **Java** | 17 | Linguagem de programação |
| **Spring Boot** | 3.2.0 | Framework web |
| **Spring Data JPA** | 3.2.0 | Acesso a dados |
| **Spring Security** | 3.2.0 | Autenticação e autorização |
| **PostgreSQL** | 15 | Banco de dados relacional |
| **JWT (JJWT)** | 0.12.3 | Tokens de autenticação |
| **Swagger/OpenAPI** | 2.1.0 | Documentação da API |
| **Lombok** | 1.18.30 | Redução de boilerplate |
| **Maven** | 3.9+ | Gerenciador de dependências |
| **Docker** | Latest | Containerização |

## 📦 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Java 17** ou superior: [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.9+**: [Download](https://maven.apache.org/download.cgi)
- **Docker**: [Download](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Incluído no Docker Desktop

## 🚀 Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio>
cd sga-backend
```

### 2. Iniciar o PostgreSQL com Docker

Execute o Docker Compose para iniciar o banco de dados:

```bash
docker-compose up -d
```

Isso iniciará um contêiner PostgreSQL com as seguintes credenciais:
- **Host**: localhost
- **Porta**: 5432
- **Banco de dados**: sga_db
- **Usuário**: sga_user
- **Senha**: sga_password

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `src/main/resources/application.properties` conforme necessário:

```properties
# Banco de dados
spring.datasource.url=jdbc:postgresql://localhost:5432/sga_db
spring.datasource.username=sga_user
spring.datasource.password=sga_password

# JWT
jwt.secret=your-secret-key-change-in-production-environment-with-at-least-256-bits
jwt.expiration=86400000  # 24 horas em milissegundos
```

**Importante**: Em produção, altere a chave secreta JWT para uma chave forte e única.

### 4. Compilar e Executar a Aplicação

```bash
# Compilar o projeto
mvn clean install

# Executar a aplicação
mvn spring-boot:run
```

A aplicação estará disponível em: `http://localhost:8080/api`

## Documentação da API

A documentação interativa da API está disponível através do Swagger UI:

- **Swagger UI**: [http://localhost:8080/api/swagger-ui.html](http://localhost:8080/api/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/api/v3/api-docs](http://localhost:8080/api/v3/api-docs)

## Autenticação

A API utiliza autenticação baseada em **JWT (JSON Web Tokens)**. Para acessar endpoints protegidos:

### 1. Realizar Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "senha": "senha123"
  }'
```

**Resposta**:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "usuario@example.com",
  "nome": "João Silva",
  "expiresIn": 86400000
}
```

### 2. Usar o Token em Requisições

Inclua o token no header `Authorization` de todas as requisições:

```bash
curl -X GET http://localhost:8080/api/alunos \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

## Endpoints Principais

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/registrar` - Registrar novo usuário
- `GET /auth/me` - Obter dados do usuário autenticado

### Alunos
- `GET /alunos` - Listar todos os alunos
- `GET /alunos/{id}` - Obter aluno por ID
- `POST /alunos` - Criar novo aluno
- `PUT /alunos/{id}` - Atualizar aluno
- `DELETE /alunos/{id}` - Deletar aluno

### Professores
- `GET /professores` - Listar todos os professores
- `GET /professores/{id}` - Obter professor por ID
- `POST /professores` - Criar novo professor
- `PUT /professores/{id}` - Atualizar professor
- `DELETE /professores/{id}` - Deletar professor

### Cursos
- `GET /cursos` - Listar todos os cursos
- `GET /cursos/{id}` - Obter curso por ID
- `POST /cursos` - Criar novo curso
- `PUT /cursos/{id}` - Atualizar curso
- `DELETE /cursos/{id}` - Deletar curso

### Turmas
- `GET /turmas` - Listar todas as turmas
- `GET /turmas/{id}` - Obter turma por ID
- `POST /turmas` - Criar nova turma
- `PUT /turmas/{id}` - Atualizar turma
- `DELETE /turmas/{id}` - Deletar turma

### Matrículas
- `GET /matriculas` - Listar todas as matrículas
- `GET /matriculas/{id}` - Obter matrícula por ID
- `POST /matriculas` - Criar nova matrícula
- `PATCH /matriculas/{id}/cancelar` - Cancelar matrícula
- `PATCH /matriculas/{id}/trancar` - Trancar matrícula

### Notas
- `GET /notas` - Listar todas as notas
- `GET /notas/{id}` - Obter nota por ID
- `POST /notas` - Criar nova nota
- `PUT /notas/{id}` - Atualizar nota
- `GET /notas/aluno/{alunoId}/turma/{turmaId}/media` - Calcular média

### Frequências
- `GET /frequencias` - Listar todas as frequências
- `GET /frequencias/{id}` - Obter frequência por ID
- `POST /frequencias` - Criar novo registro de frequência
- `PUT /frequencias/{id}` - Atualizar frequência
- `GET /frequencias/aluno/{alunoId}/turma/{turmaId}/taxa-presenca` - Taxa de presença

## Estrutura do Projeto

```
sga-backend/
├── src/main/java/com/sga/
│   ├── config/              # Configurações (Security, OpenAPI)
│   ├── controller/          # Controllers REST
│   ├── dto/                 # Data Transfer Objects
│   ├── entity/              # Entidades JPA
│   ├── exception/           # Exceções customizadas
│   ├── repository/          # Repositórios Spring Data JPA
│   ├── security/            # Componentes de segurança JWT
│   ├── service/             # Serviços (lógica de negócio)
│   └── SgaBackendApplication.java  # Classe principal
├── src/main/resources/
│   └── application.properties     # Configurações da aplicação
├── pom.xml                  # Dependências Maven
├── docker-compose.yml       # Configuração Docker
└── README.md               # Este arquivo
```

## Configuração de Produção

### 1. Alterar Chave JWT

Gere uma chave segura e altere em `application.properties`:

```bash
# Gerar chave aleatória (Linux/Mac)
openssl rand -base64 32
```

### 2. Configurar Banco de Dados Remoto

Atualize a URL do banco de dados para apontar para seu servidor PostgreSQL:

```properties
spring.datasource.url=jdbc:postgresql://seu-servidor:5432/sga_db
spring.datasource.username=seu-usuario
spring.datasource.password=sua-senha
```

### 3. Compilar para Produção

```bash
mvn clean package -DskipTests
```

Isso gera um arquivo JAR em `target/sga-backend-1.0.0.jar`

### 4. Executar em Produção

```bash
java -jar target/sga-backend-1.0.0.jar
```

## Testes

Execute os testes unitários:

```bash
mvn test
```

## Exemplo de Uso Completo

### 1. Registrar um novo usuário

```bash
curl -X POST http://localhost:8080/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "nome": "Administrador",
    "senha": "senha123",
    "tipo": "ADMINISTRADOR",
    "ativo": true
  }'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "senha": "senha123"
  }'
```

### 3. Criar um novo aluno

```bash
curl -X POST http://localhost:8080/api/alunos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "matricula": "MAT001",
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(11) 98765-4321",
    "dataNascimento": "2000-01-15",
    "endereco": "Rua das Flores, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567",
    "cpf": "123.456.789-00",
    "ativo": true
  }'
```

## 🐛 Solução de Problemas

### Erro: "Connection refused" ao conectar ao banco de dados

Verifique se o Docker está rodando:

```bash
docker ps
```

Se o contêiner não estiver rodando, inicie-o novamente:

```bash
docker-compose up -d
```

### Erro: "Porta 8080 já em uso"

Altere a porta em `application.properties`:

```properties
server.port=8081
```

### Erro: "Invalid JWT token"

Verifique se o token foi copiado corretamente e se não expirou. Faça login novamente para obter um novo token.

## 📄 Licença

Este projeto é fornecido como está para fins educacionais e comerciais.

## 👥 Autor

Desenvolvido por Jefferson Monteiro - Sistema de Gerenciamento de Alunos (SGA)

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação Swagger em `http://localhost:8080/api/swagger-ui.html`

---

**Versão**: 1.0.0  
**Última atualização**: Outubro de 2025
