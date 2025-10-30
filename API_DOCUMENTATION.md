# Documentação Técnica da API - Sistema de Gerenciamento de Alunos (SGA)

## Visão Geral

A API REST do SGA fornece endpoints para gerenciamento completo de instituições educacionais, incluindo alunos, professores, cursos, turmas, matrículas, notas e frequências. Toda a comunicação é feita através de JSON e autenticação JWT.

## Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Todos os endpoints, exceto `/auth/login` e `/auth/registrar`, requerem um token válido.

### Fluxo de Autenticação

1. **Registrar novo usuário** (POST `/auth/registrar`)
2. **Fazer login** (POST `/auth/login`) - Retorna token JWT
3. **Usar token** em requisições subsequentes no header `Authorization: Bearer <token>`

### Exemplo de Token

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ1c3VhcmlvQGV4YW1wbGUuY29tIiwiaWF0IjoxNjk4NjcyMDAwLCJleHAiOjE2OTg3NTg0MDB9.signature
```

## Endpoints da API

### 1. Autenticação (`/auth`)

#### 1.1 Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

**Resposta (200 OK)**:
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

#### 1.2 Registrar Novo Usuário
```http
POST /auth/registrar
Content-Type: application/json

{
  "email": "novo@example.com",
  "nome": "Novo Usuário",
  "senha": "senha123",
  "tipo": "USUARIO",
  "ativo": true
}
```

**Resposta (201 Created)**:
```json
{
  "id": 2,
  "email": "novo@example.com",
  "nome": "Novo Usuário",
  "tipo": "USUARIO",
  "ativo": true,
  "criadoEm": "2025-10-30T12:30:00Z",
  "atualizadoEm": "2025-10-30T12:30:00Z"
}
```

#### 1.3 Obter Dados do Usuário Autenticado
```http
GET /auth/me
Authorization: Bearer <token>
```

**Resposta (200 OK)**:
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "nome": "João Silva",
  "tipo": "ADMINISTRADOR",
  "ativo": true
}
```

---

### 2. Alunos (`/alunos`)

#### 2.1 Listar Todos os Alunos
```http
GET /alunos
Authorization: Bearer <token>
```

**Resposta (200 OK)**:
```json
[
  {
    "id": 1,
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
    "ativo": true,
    "criadoEm": "2025-10-30T10:00:00Z",
    "atualizadoEm": "2025-10-30T10:00:00Z"
  }
]
```

#### 2.2 Obter Aluno por ID
```http
GET /alunos/{id}
Authorization: Bearer <token>
```

#### 2.3 Obter Aluno por Matrícula
```http
GET /alunos/matricula/{matricula}
Authorization: Bearer <token>
```

#### 2.4 Buscar Alunos por Nome
```http
GET /alunos/buscar?nome=João
Authorization: Bearer <token>
```

#### 2.5 Listar Alunos Ativos
```http
GET /alunos/ativos
Authorization: Bearer <token>
```

#### 2.6 Criar Novo Aluno
```http
POST /alunos
Authorization: Bearer <token>
Content-Type: application/json

{
  "matricula": "MAT002",
  "nome": "Maria Santos",
  "email": "maria@example.com",
  "telefone": "(11) 99876-5432",
  "dataNascimento": "2001-05-20",
  "endereco": "Avenida Brasil, 456",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "cep": "20000-000",
  "cpf": "987.654.321-00",
  "ativo": true
}
```

**Resposta (201 Created)**:
```json
{
  "id": 2,
  "matricula": "MAT002",
  "nome": "Maria Santos",
  "email": "maria@example.com",
  "telefone": "(11) 99876-5432",
  "dataNascimento": "2001-05-20",
  "endereco": "Avenida Brasil, 456",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "cep": "20000-000",
  "cpf": "987.654.321-00",
  "ativo": true,
  "criadoEm": "2025-10-30T12:35:00Z",
  "atualizadoEm": "2025-10-30T12:35:00Z"
}
```

#### 2.7 Atualizar Aluno
```http
PUT /alunos/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Maria Santos Silva",
  "email": "maria.silva@example.com",
  "telefone": "(11) 99876-5433"
}
```

#### 2.8 Desativar Aluno
```http
PATCH /alunos/{id}/desativar
Authorization: Bearer <token>
```

#### 2.9 Ativar Aluno
```http
PATCH /alunos/{id}/ativar
Authorization: Bearer <token>
```

#### 2.10 Deletar Aluno
```http
DELETE /alunos/{id}
Authorization: Bearer <token>
```

---

### 3. Professores (`/professores`)

Os endpoints de professores seguem a mesma estrutura dos alunos:

- `GET /professores` - Listar todos
- `GET /professores/{id}` - Obter por ID
- `GET /professores/matricula/{matricula}` - Obter por matrícula
- `GET /professores/buscar?nome=...` - Buscar por nome
- `GET /professores/ativos` - Listar ativos
- `POST /professores` - Criar novo
- `PUT /professores/{id}` - Atualizar
- `PATCH /professores/{id}/desativar` - Desativar
- `PATCH /professores/{id}/ativar` - Ativar
- `DELETE /professores/{id}` - Deletar

---

### 4. Cursos (`/cursos`)

#### 4.1 Endpoints Disponíveis

- `GET /cursos` - Listar todos
- `GET /cursos/{id}` - Obter por ID
- `GET /cursos/codigo/{codigo}` - Obter por código
- `GET /cursos/buscar?nome=...` - Buscar por nome
- `GET /cursos/nivel/{nivel}` - Buscar por nível
- `GET /cursos/ativos` - Listar ativos
- `POST /cursos` - Criar novo
- `PUT /cursos/{id}` - Atualizar
- `PATCH /cursos/{id}/desativar` - Desativar
- `PATCH /cursos/{id}/ativar` - Ativar
- `DELETE /cursos/{id}` - Deletar

#### 4.2 Exemplo de Criação de Curso
```http
POST /cursos
Authorization: Bearer <token>
Content-Type: application/json

{
  "codigo": "PROG101",
  "nome": "Programação em Java",
  "descricao": "Curso introdutório de programação Java",
  "nivel": "INICIANTE",
  "cargaHoraria": 60,
  "ativo": true
}
```

---

### 5. Turmas (`/turmas`)

#### 5.1 Endpoints Disponíveis

- `GET /turmas` - Listar todas
- `GET /turmas/{id}` - Obter por ID
- `GET /turmas/codigo/{codigo}` - Obter por código
- `GET /turmas/ativas` - Listar ativas
- `GET /turmas/curso/{cursoId}` - Listar por curso
- `GET /turmas/professor/{professorId}` - Listar por professor
- `GET /turmas/buscar?nome=...` - Buscar por nome
- `GET /turmas/periodo/{periodo}` - Buscar por período
- `POST /turmas` - Criar nova
- `PUT /turmas/{id}` - Atualizar
- `PATCH /turmas/{id}/desativar` - Desativar
- `PATCH /turmas/{id}/ativar` - Ativar
- `DELETE /turmas/{id}` - Deletar

#### 5.2 Exemplo de Criação de Turma
```http
POST /turmas
Authorization: Bearer <token>
Content-Type: application/json

{
  "codigo": "PROG101-A",
  "nome": "Programação Java - Turma A",
  "periodo": "MATUTINO",
  "capacidade": 30,
  "cursoId": 1,
  "professorId": 1,
  "ativo": true
}
```

---

### 6. Matrículas (`/matriculas`)

#### 6.1 Endpoints Disponíveis

- `GET /matriculas` - Listar todas
- `GET /matriculas/{id}` - Obter por ID
- `GET /matriculas/aluno/{alunoId}` - Listar por aluno
- `GET /matriculas/turma/{turmaId}` - Listar por turma
- `GET /matriculas/aluno/{alunoId}/ativas` - Listar ativas por aluno
- `GET /matriculas/turma/{turmaId}/ativas` - Listar ativas por turma
- `GET /matriculas/turma/{turmaId}/contar` - Contar ativas em turma
- `POST /matriculas` - Criar nova
- `PUT /matriculas/{id}/status?status=...` - Atualizar status
- `PATCH /matriculas/{id}/cancelar` - Cancelar
- `PATCH /matriculas/{id}/trancar` - Trancar
- `DELETE /matriculas/{id}` - Deletar

#### 6.2 Exemplo de Matrícula
```http
POST /matriculas
Authorization: Bearer <token>
Content-Type: application/json

{
  "alunoId": 1,
  "turmaId": 1,
  "dataCriacao": "2025-10-30",
  "status": "ATIVA"
}
```

**Status Disponíveis**: `ATIVA`, `CANCELADA`, `TRANCADA`, `CONCLUIDA`

---

### 7. Notas (`/notas`)

#### 7.1 Endpoints Disponíveis

- `GET /notas` - Listar todas
- `GET /notas/{id}` - Obter por ID
- `GET /notas/aluno/{alunoId}` - Listar por aluno
- `GET /notas/turma/{turmaId}` - Listar por turma
- `GET /notas/aluno/{alunoId}/turma/{turmaId}` - Listar por aluno e turma
- `GET /notas/avaliacao/{avaliacao}` - Buscar por avaliação
- `GET /notas/aluno/{alunoId}/turma/{turmaId}/media` - Calcular média
- `GET /notas/turma/{turmaId}/media` - Média da turma
- `GET /notas/turma/{turmaId}/maxima` - Nota máxima
- `GET /notas/turma/{turmaId}/minima` - Nota mínima
- `POST /notas` - Criar nova
- `PUT /notas/{id}` - Atualizar
- `DELETE /notas/{id}` - Deletar

#### 7.2 Exemplo de Criação de Nota
```http
POST /notas
Authorization: Bearer <token>
Content-Type: application/json

{
  "alunoId": 1,
  "turmaId": 1,
  "avaliacao": "Prova 1",
  "valor": 8.5,
  "dataAvaliacao": "2025-10-30",
  "observacoes": "Bom desempenho"
}
```

---

### 8. Frequências (`/frequencias`)

#### 8.1 Endpoints Disponíveis

- `GET /frequencias` - Listar todas
- `GET /frequencias/{id}` - Obter por ID
- `GET /frequencias/aluno/{alunoId}` - Listar por aluno
- `GET /frequencias/turma/{turmaId}` - Listar por turma
- `GET /frequencias/aluno/{alunoId}/turma/{turmaId}` - Listar por aluno e turma
- `GET /frequencias/turma/{turmaId}/data/{dataAula}` - Listar por data
- `GET /frequencias/aluno/{alunoId}/turma/{turmaId}/taxa-presenca` - Taxa de presença
- `GET /frequencias/aluno/{alunoId}/turma/{turmaId}/presenças` - Contar presenças
- `GET /frequencias/aluno/{alunoId}/turma/{turmaId}/ausências` - Contar ausências
- `GET /frequencias/aluno/{alunoId}/turma/{turmaId}/faltas-justificadas` - Contar faltas justificadas
- `POST /frequencias` - Criar novo registro
- `PUT /frequencias/{id}/status?status=...` - Atualizar status
- `PUT /frequencias/{id}` - Atualizar
- `DELETE /frequencias/{id}` - Deletar

#### 8.2 Exemplo de Frequência
```http
POST /frequencias
Authorization: Bearer <token>
Content-Type: application/json

{
  "alunoId": 1,
  "turmaId": 1,
  "dataAula": "2025-10-30",
  "status": "PRESENTE",
  "justificativa": null
}
```

**Status Disponíveis**: `PRESENTE`, `AUSENTE`, `FALTA_JUSTIFICADA`

---

## Códigos de Resposta HTTP

| Código | Significado | Descrição |
|--------|-----------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 204 | No Content | Operação bem-sucedida sem conteúdo de retorno |
| 400 | Bad Request | Dados inválidos na requisição |
| 401 | Unauthorized | Token JWT inválido ou ausente |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Recurso duplicado ou conflito de dados |
| 500 | Internal Server Error | Erro interno do servidor |

---

## 📋 Formatos de Data e Hora

Todas as datas e horas devem ser enviadas no formato ISO 8601:

- **Data**: `YYYY-MM-DD` (ex: `2025-10-30`)
- **Data e Hora**: `YYYY-MM-DDTHH:mm:ssZ` (ex: `2025-10-30T12:30:00Z`)

---

## 🔍 Tratamento de Erros

Todas as respostas de erro seguem o seguinte formato:

```json
{
  "timestamp": "2025-10-30T12:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Aluno não encontrado com ID: 999",
  "path": "/alunos/999"
}
```

---

## 📊 Paginação

Endpoints de listagem suportam paginação através de query parameters:

```http
GET /alunos?page=0&size=20&sort=nome,asc
Authorization: Bearer <token>
```

---

## Segurança

### Boas Práticas

1. **Nunca compartilhe tokens JWT** - Mantenha-os seguros
2. **Use HTTPS em produção** - Sempre criptografe a comunicação
3. **Altere a chave secreta JWT** - Em produção, use uma chave forte
4. **Implemente rate limiting** - Proteja contra ataques de força bruta
5. **Valide entrada de dados** - Sempre valide dados do cliente

### Headers de Segurança Recomendados

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Swagger/OpenAPI

A documentação interativa está disponível em:

- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/api/v3/api-docs`

---

## 🧪 Exemplos com cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","senha":"senha123"}'
```

### Listar Alunos
```bash
curl -X GET http://localhost:8080/api/alunos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Criar Aluno
```bash
curl -X POST http://localhost:8080/api/alunos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "matricula":"MAT003",
    "nome":"Pedro Costa",
    "email":"pedro@example.com",
    "telefone":"(11) 98765-4321",
    "dataNascimento":"2000-01-15",
    "endereco":"Rua das Flores, 123",
    "cidade":"São Paulo",
    "estado":"SP",
    "cep":"01234-567",
    "cpf":"123.456.789-00",
    "ativo":true
  }'
```

---

**Versão**: 1.0.0  
**Última atualização**: Outubro de 2025
