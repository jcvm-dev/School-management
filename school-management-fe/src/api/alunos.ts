import api from './axios';
import { Aluno, CreateAlunoRequest, UpdateAlunoRequest } from '../types';

export const alunosApi = {
  getAll: async (): Promise<Aluno[]> => {
    const response = await api.get<Aluno[]>('/alunos');
    return response.data;
  },

  getById: async (id: number): Promise<Aluno> => {
    const response = await api.get<Aluno>(`/alunos/${id}`);
    return response.data;
  },

  getAtivos: async (): Promise<Aluno[]> => {
    const response = await api.get<Aluno[]>('/alunos/ativos');
    return response.data;
  },

  buscarPorNome: async (nome: string): Promise<Aluno[]> => {
    const response = await api.get<Aluno[]>(`/alunos/buscar?nome=${encodeURIComponent(nome)}`);
    return response.data;
  },

  getByMatricula: async (matricula: string): Promise<Aluno> => {
    const response = await api.get<Aluno>(`/alunos/matricula/${matricula}`);
    return response.data;
  },

  create: async (data: CreateAlunoRequest): Promise<Aluno> => {
    const response = await api.post<Aluno>('/alunos', data);
    return response.data;
  },

  update: async (id: number, data: UpdateAlunoRequest): Promise<Aluno> => {
    const response = await api.put<Aluno>(`/alunos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/alunos/${id}`);
  },

  ativar: async (id: number): Promise<Aluno> => {
    const response = await api.patch<Aluno>(`/alunos/${id}/ativar`);
    return response.data;
  },

  desativar: async (id: number): Promise<Aluno> => {
    const response = await api.patch<Aluno>(`/alunos/${id}/desativar`);
    return response.data;
  },
};
