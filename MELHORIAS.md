# Sugestões de Melhorias — SGA (Sistema de Gerenciamento de Alunos)

> Análise técnica completa do backend (Spring Boot) e frontend (React/TypeScript).
> Itens organizados por prioridade e categoria.

---

## Índice

1. [Segurança](#1-segurança)
2. [Validação de Dados](#2-validação-de-dados)
3. [Tratamento de Erros](#3-tratamento-de-erros)
4. [Funcionalidades Ausentes](#4-funcionalidades-ausentes)
5. [Qualidade de Código](#5-qualidade-de-código)
6. [Performance e Banco de Dados](#6-performance-e-banco-de-dados)
7. [API Design](#7-api-design)
8. [Frontend — UX/UI](#8-frontend--uxui)
9. [Frontend — Integração e Tipagem](#9-frontend--integração-e-tipagem)
10. [Testes](#10-testes)

---

## 1. Segurança

### 🔴 Crítico

#### 1.1 Chave JWT hardcoded no `application.properties`
A chave secreta JWT está exposta no repositório. Qualquer pessoa com acesso ao código pode forjar tokens válidos.

**Correção:** Mover para variável de ambiente.
```properties
# application.properties
jwt.secret=${JWT_SECRET}
```
```yaml
# docker-compose.yml
environment:
  JWT_SECRET: <valor-gerado-externamente>
```

---

#### 1.2 Senha do admin logada no console
`DataInitializer` imprime a senha padrão no log, expondo credenciais em arquivos de log.

**Correção:** Remover a senha da mensagem de log.
```java
log.info("Admin padrão criado — email: admin@escola.com");
// Nunca logar senhas, mesmo que temporárias
```

---

#### 1.3 Endpoints GET públicos expõem dados de alunos
Qualquer pessoa sem autenticação pode acessar listas de alunos, professores, cursos e turmas — violando LGPD.

**Correção:** Remover as regras `permitAll()` dos endpoints de dados e exigir autenticação para todos.
```java
// SecurityConfig.java — remover estas linhas:
.requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.GET, "/alunos/**")).permitAll()
.requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.GET, "/professores/**")).permitAll()
// ...
```

---

#### 1.4 Token JWT armazenado no `localStorage` (frontend)
`localStorage` é acessível por JavaScript, tornando o token vulnerável a ataques XSS.

**Correção:** Usar cookies `HttpOnly` + `Secure`. Requer mudança no backend para emitir o cookie e no frontend para remover o `localStorage`.

---

#### 1.5 Tipo do usuário (`tipo`) hardcoded no frontend
```typescript
// AuthContext.tsx — linha atual
tipo: 'USER',  // ← hardcoded, não usa o valor real do backend
```
**Correção:** Usar o campo retornado pelo backend na resposta do login.
```typescript
tipo: response.tipo,
```

---

### 🟡 Alta Prioridade

#### 1.6 Rate limiting ausente no endpoint de login
O endpoint `POST /auth/login` não tem proteção contra força bruta.

**Correção:** Adicionar `spring-boot-starter-actuator` + `bucket4j` ou implementar bloqueio por IP após N tentativas falhas.

---

#### 1.7 URL da API hardcoded no frontend
```typescript
// axios.ts
const BASE_URL = 'http://localhost:8080/api'; // ← não funciona em produção
```
**Correção:**
```typescript
const BASE_URL = import.meta.env.VITE_API_URL;
```
```env
# .env.local
VITE_API_URL=http://localhost:8080/api
```

---

#### 1.8 Senha padrão fraca para o admin
A senha `admin123` não atende requisitos mínimos de segurança.

**Sugestões:**
- Gerar senha aleatória no primeiro boot e exibi-la apenas uma vez
- Forçar troca de senha no primeiro login (`senhaTemporaria: true` na entidade)

---

## 2. Validação de Dados

### 🟡 Alta Prioridade

#### 2.1 DTOs sem anotações de validação
`LoginRequest` e demais DTOs não têm `@NotBlank`, `@Email`, `@Size` etc. Dados inválidos chegam até o banco.

**Correção:**
```java
// LoginRequest.java
@NotBlank(message = "Email é obrigatório")
@Email(message = "Email inválido")
private String email;

@NotBlank(message = "Senha é obrigatória")
@Size(min = 8, message = "Senha deve ter ao menos 8 caracteres")
private String senha;
```

---

#### 2.2 CPF sem validação de formato e dígito verificador
O campo CPF aceita qualquer string. Não há validação do algoritmo de dígito verificador.

**Correção:** Criar um `@CPF` validator customizado com a lógica de validação brasileira.

---

#### 2.3 Notas sem validação de intervalo
Não há verificação se o valor da nota está entre 0 e 10.

**Correção:**
```java
@DecimalMin(value = "0.0", message = "Nota mínima é 0")
@DecimalMax(value = "10.0", message = "Nota máxima é 10")
private BigDecimal valor;
```

---

#### 2.4 Frequência sem verificação de duplicidade
É possível registrar frequência para o mesmo aluno, turma e data mais de uma vez.

**Correção:** Adicionar constraint `UNIQUE (aluno_id, turma_id, data)` na entidade e verificação no service.

---

#### 2.5 Matrícula dupla não bloqueada
Não há verificação se o aluno já está matriculado na mesma turma.

**Correção:** Adicionar constraint `UNIQUE (aluno_id, turma_id)` com status `ATIVA` no service de matrícula.

---

## 3. Tratamento de Erros

### 🔴 Crítico

#### 3.1 Ausência de `@RestControllerAdvice` global
Sem um handler global, exceções não tratadas expõem stack traces para o cliente.

**Correção:** Criar `GlobalExceptionHandler`:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
}
```

---

#### 3.2 `AuthService` lança `RuntimeException` genérica
```java
throw new RuntimeException("Email já cadastrado"); // ← inconsistente
```
**Correção:** Usar `DuplicateResourceException` já existente no projeto.

---

### 🟡 Alta Prioridade

#### 3.3 Erros de validação do backend não exibidos no frontend
O frontend exibe mensagem genérica em vez do motivo real vindo do servidor.

**Correção:** Tipar o erro do Axios e exibir `error.response.data.message` quando disponível (já parcialmente implementado em `LoginPage`, mas ausente nos formulários de CRUD).

---

## 4. Funcionalidades Ausentes

### 🟡 Alta Prioridade

#### 4.1 Paginação em todas as listagens
Todos os `findAll()` retornam a coleção completa. Com centenas de alunos, isso causa problemas sérios de performance e memória.

**Correção (backend):**
```java
// Repository
Page<Aluno> findAll(Pageable pageable);

// Controller
@GetMapping
public Page<AlunoDTO> listar(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size) {
    return service.listar(PageRequest.of(page, size));
}
```

**Correção (frontend):** Adicionar controles de paginação e passar `?page=0&size=20` nas requisições.

---

#### 4.2 Busca e filtros avançados
Não há como filtrar alunos por turma, curso, status, etc.

**Sugestão:** Implementar `Specification<T>` do Spring Data para queries dinâmicas.

---

#### 4.3 Soft delete ausente em `Nota` e `Frequencia`
Notas e frequências são deletadas permanentemente. Não há histórico de alterações.

**Correção:** Adicionar campo `ativo` (ou `deletadoEm`) nessas entidades e usar `@Where(clause = "ativo = true")`.

---

#### 4.4 Controle de acesso por papel (RBAC) no frontend
Todas as telas são visíveis para todos os usuários autenticados, independente do tipo (`ADMINISTRADOR`, `PROFESSOR`, `ALUNO`).

**Sugestão:** Criar um hook `usePermission(role)` e esconder/bloquear ações baseado no `tipo` do usuário logado.

---

#### 4.5 Relatórios e exportação
O sistema não oferece nenhuma forma de gerar relatórios ou exportar dados.

**Sugestões:**
- Boletim do aluno (PDF)
- Relatório de frequência por turma
- Exportação de listas em CSV
- Resumo de desempenho por curso

---

#### 4.6 Funcionalidade de redefinição de senha
Não existe fluxo de "esqueci minha senha".

**Sugestão:** Implementar com token por email (link com expiração de 1h via SMTP/SendGrid).

---

### 🟢 Média Prioridade

#### 4.7 Dashboard sem dados reais
O `Dashboard.tsx` aparentemente não busca dados do backend — sem contadores de alunos, professores, turmas ativas, etc.

**Sugestão:** Criar endpoint `/dashboard/resumo` retornando totais e conectar ao frontend.

---

#### 4.8 Notificações e alertas
Não há sistema de notificação para eventos como notas lançadas, baixa frequência, etc.

**Sugestão:** Implementar notificações in-app (toast/badge) ou por email.

---

#### 4.9 Histórico de alterações (Audit Log)
Não é possível saber quem alterou uma nota ou quando.

**Sugestão:** Adicionar `@CreatedBy` / `@LastModifiedBy` via Spring Data Auditing ou tabela de log de auditoria separada.

---

## 5. Qualidade de Código

### 🟡 Alta Prioridade

#### 5.1 Inconsistência: alguns controllers retornam entidades, outros DTOs
`AlunoController` usa `AlunoDTO`, mas `ProfessorController` e outros retornam a entidade diretamente (expondo campos como `senha` potencialmente).

**Correção:** Criar DTOs para todas as entidades e nunca retornar a entidade `Usuario` com a senha.

---

#### 5.2 Conversão manual de entidade ↔ DTO
`AlunoController` tem métodos `convertToDTO()` e `convertToEntity()` manuais e repetitivos.

**Correção:** Adotar **MapStruct** para mapeamento automático e seguro.

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
```

---

#### 5.3 Ausência de `Error Boundary` no React
Qualquer erro em tempo de execução num componente derruba a aplicação inteira sem feedback ao usuário.

**Correção:** Implementar `ErrorBoundary` nos layouts principais.

---

#### 5.4 Código duplicado nos controllers
Todos os controllers têm o mesmo padrão CRUD.

**Sugestão:** Criar `BaseController<T, DTO, ID>` abstrato com as operações genéricas.

---

## 6. Performance e Banco de Dados

### 🟡 Alta Prioridade

#### 6.1 Ausência de índices no banco
Campos buscados frequentemente (`email`, `cpf`, `matricula`, `nome`) não têm índices, resultando em full table scans.

**Correção:** Adicionar nas entidades:
```java
@Table(name = "alunos", indexes = {
    @Index(name = "idx_aluno_cpf", columnList = "cpf"),
    @Index(name = "idx_aluno_email", columnList = "email"),
    @Index(name = "idx_aluno_matricula", columnList = "matricula")
})
```

---

#### 6.2 Risco de N+1 queries
Entidades como `Turma` possuem relacionamentos `@ManyToOne(fetch = LAZY)`. Retornar listas de turmas pode gerar dezenas de queries extras.

**Correção:** Usar `@EntityGraph` ou JPQL com `JOIN FETCH` nos repositories de listagem, ou DTOs com projeção.

---

#### 6.3 Sem cache para dados estáticos
Listas de cursos e turmas raramente mudam mas são consultadas frequentemente.

**Sugestão:** Adicionar `@Cacheable` com Spring Cache + Redis para listas de referência.

---

#### 6.4 Migração de banco sem Flyway/Liquibase
O projeto usa `ddl-auto=update` que é inseguro em produção (pode alterar schema silenciosamente).

**Correção:** Adotar **Flyway** com scripts SQL versionados:
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```

---

## 7. API Design

### 🟢 Média Prioridade

#### 7.1 Ausência de versionamento da API
Mudanças breaking afetarão clientes sem aviso.

**Sugestão:** Adotar prefixo `/api/v1/` nas rotas.

---

#### 7.2 Status HTTP inconsistentes
Alguns endpoints retornam 200 para criações que deveriam retornar 201, e ausência de 204 em deleções.

**Padrão sugerido:**
- `POST` → `201 Created`
- `PUT/PATCH` → `200 OK`
- `DELETE` → `204 No Content`
- Erro de validação → `400 Bad Request`
- Não encontrado → `404 Not Found`
- Duplicado → `409 Conflict`

---

#### 7.3 Respostas sem wrapper padronizado
Cada endpoint retorna um formato diferente. Não há estrutura consistente para sucesso/erro.

**Sugestão:** Criar `ApiResponse<T>` padrão:
```json
{
  "success": true,
  "data": { ... },
  "message": null,
  "timestamp": "2026-03-29T00:00:00Z"
}
```

---

## 8. Frontend — UX/UI

### 🟡 Alta Prioridade

#### 8.1 Sem estados vazios nas tabelas
Quando não há dados, as tabelas exibem apenas o cabeçalho sem nenhuma mensagem.

**Correção:** Exibir ilustração/mensagem "Nenhum registro encontrado" com botão de ação.

---

#### 8.2 Sem confirmação em ações destrutivas
Botões de exclusão executam a ação imediatamente sem confirmação.

**Correção:** Exibir modal de confirmação antes de qualquer DELETE.

---

#### 8.3 Sem feedback visual de sucesso/erro nas operações
Após criar ou editar um registro, o usuário não recebe confirmação visual.

**Sugestão:** Integrar biblioteca de toast (ex: `react-hot-toast` ou `sonner`).

---

#### 8.4 Sem skeleton loader nas listagens
Durante o carregamento, as tabelas ficam em branco sem indicação visual.

**Correção:** Adicionar `Skeleton` component durante `isLoading`.

---

### 🟢 Média Prioridade

#### 8.5 Sem breadcrumbs para navegação contextual
Dificulta saber em qual seção o usuário está, especialmente em formulários.

---

#### 8.6 Acessibilidade (a11y) ausente
Formulários e tabelas não têm `aria-label`, `aria-describedby` ou navegação por teclado.

---

#### 8.7 Sem persistência de filtros/paginação na URL
Recarregar a página perde filtros aplicados.

**Sugestão:** Sincronizar estado de filtros com query params via `useSearchParams`.

---

## 9. Frontend — Integração e Tipagem

### 🔴 Crítico

#### 9.1 Arquivos de API possivelmente incompletos
As páginas de `Cursos`, `Turmas`, `Matrícula`, `Notas` e `Frequências` dependem de arquivos de API que podem não estar implementados ou integrados corretamente.

**Verificar:** Que cada página chama sua respectiva API e trata estados de `loading`, `error` e `empty`.

---

#### 9.2 Divergência de tipos entre frontend e backend

| Campo | Backend | Frontend |
|-------|---------|----------|
| Professor | `formacao`, `dataAdmissao` | `departamento`, `titulacao`, `especialidade` |
| Frequência status | `JUSTIFICADO`, `ATRASADO` | `FALTA_JUSTIFICADA` |

**Correção:** Alinhar `types/index.ts` com os modelos reais do backend.

---

#### 9.3 Sem variáveis de ambiente por contexto
Não existe separação entre configs de desenvolvimento, homologação e produção.

**Correção:** Criar arquivos `.env.local`, `.env.staging`, `.env.production` com `VITE_API_URL` e outras configurações.

---

## 10. Testes

### 🟡 Alta Prioridade

#### 10.1 Ausência total de testes automatizados
Não foram identificados testes unitários, de integração ou E2E em nenhuma das duas camadas.

**Sugestões de cobertura mínima:**

**Backend:**
- Testes unitários dos `Service` com Mockito
- Testes de integração dos `Controller` com `@SpringBootTest` + `MockMvc`
- Testes de segurança (endpoints protegidos retornam 401/403)

**Frontend:**
- Testes de componente com `@testing-library/react`
- Testes de formulário (validação, submissão)
- Testes de integração com `msw` (Mock Service Worker)

---

## Resumo de Prioridades

| Prioridade | Quantidade | Exemplos |
|-----------|------------|---------|
| 🔴 Crítico | 6 | JWT hardcoded, senha logada, dados públicos, tipo hardcoded no frontend |
| 🟡 Alta | 22 | Validações, paginação, RBAC, tratamento de erros, N+1, rate limiting |
| 🟢 Média | 10 | Relatórios, versionamento de API, cache, i18n, breadcrumbs |

---

*Gerado em 2026-03-29 — Análise sobre o estado atual do repositório.*
