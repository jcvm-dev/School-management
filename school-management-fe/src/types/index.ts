// Auth
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  tipo: string;
}

export interface AuthResponse {
  token: string | null;
  tokenType: string;
  userId: number;
  email: string;
  nome: string;
  tipo: string;
  senhaTemporaria: boolean;
  expiresIn: number;
}

export interface User {
  id: number;
  email: string;
  nome: string;
  tipo: string;
  ativo: boolean;
  senhaTemporaria?: boolean;
}

// Aluno
export interface Aluno {
  id: number;
  matricula: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  cpf: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateAlunoRequest {
  matricula: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  cpf: string;
  ativo: boolean;
}

export type UpdateAlunoRequest = Partial<CreateAlunoRequest>;

// Professor
export interface Professor {
  id: number;
  matricula: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  departamento: string;
  titulacao: string;
  especialidade: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateProfessorRequest {
  matricula: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  departamento: string;
  titulacao: string;
  especialidade: string;
  ativo: boolean;
}

export type UpdateProfessorRequest = Partial<CreateProfessorRequest>;

// Curso
export type NivelCurso = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';

export interface Curso {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  nivel: NivelCurso;
  cargaHoraria: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateCursoRequest {
  codigo: string;
  nome: string;
  descricao: string;
  nivel: NivelCurso;
  cargaHoraria: number;
  ativo: boolean;
}

export type UpdateCursoRequest = Partial<CreateCursoRequest>;

// Turma
export type PeriodoTurma = 'MATUTINO' | 'VESPERTINO' | 'NOTURNO';

export interface Turma {
  id: number;
  codigo: string;
  nome: string;
  periodo: PeriodoTurma;
  capacidade: number;
  cursoId: number;
  cursoNome?: string;
  professorId: number;
  professorNome?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateTurmaRequest {
  codigo: string;
  nome: string;
  periodo: PeriodoTurma;
  capacidade: number;
  cursoId: number;
  professorId: number;
  ativo: boolean;
}

export type UpdateTurmaRequest = Partial<CreateTurmaRequest>;

// Matricula
export type StatusMatricula = 'ATIVA' | 'CANCELADA' | 'TRANCADA' | 'CONCLUIDA';

export interface Matricula {
  id: number;
  alunoId: number;
  alunoNome?: string;
  turmaId: number;
  turmaNome?: string;
  dataCriacao: string;
  status: StatusMatricula;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateMatriculaRequest {
  alunoId: number;
  turmaId: number;
}

// Nota
export interface Nota {
  id: number;
  alunoId: number;
  alunoNome?: string;
  turmaId: number;
  turmaNome?: string;
  avaliacao: string;
  valor: number;
  dataAvaliacao: string;
  observacoes?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateNotaRequest {
  alunoId: number;
  turmaId: number;
  avaliacao: string;
  valor: number;
  dataAvaliacao: string;
  observacoes?: string;
}

export type UpdateNotaRequest = Partial<CreateNotaRequest>;

// Frequencia
export type StatusFrequencia = 'PRESENTE' | 'AUSENTE' | 'FALTA_JUSTIFICADA';

export interface Frequencia {
  id: number;
  alunoId: number;
  alunoNome?: string;
  turmaId: number;
  turmaNome?: string;
  dataAula: string;
  status: StatusFrequencia;
  justificativa?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateFrequenciaRequest {
  alunoId: number;
  turmaId: number;
  dataAula: string;
  status: StatusFrequencia;
  justificativa?: string;
}

export type UpdateFrequenciaRequest = Partial<CreateFrequenciaRequest>;

// API Response wrappers
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
