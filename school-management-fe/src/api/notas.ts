import api from './axios';
import { Nota, CreateNotaRequest, UpdateNotaRequest } from '../types';

export const notasApi = {
  getAll: async (): Promise<Nota[]> => {
    const response = await api.get<Nota[]>('/notas');
    return response.data;
  },

  getById: async (id: number): Promise<Nota> => {
    const response = await api.get<Nota>(`/notas/${id}`);
    return response.data;
  },

  getByAluno: async (alunoId: number): Promise<Nota[]> => {
    const response = await api.get<Nota[]>(`/notas/aluno/${alunoId}`);
    return response.data;
  },

  getByTurma: async (turmaId: number): Promise<Nota[]> => {
    const response = await api.get<Nota[]>(`/notas/turma/${turmaId}`);
    return response.data;
  },

  getMediaAluno: async (alunoId: number, turmaId: number): Promise<number> => {
    const response = await api.get<number>(`/notas/aluno/${alunoId}/turma/${turmaId}/media`);
    return response.data;
  },

  getMediaTurma: async (turmaId: number): Promise<number> => {
    const response = await api.get<number>(`/notas/turma/${turmaId}/media`);
    return response.data;
  },

  create: async (data: CreateNotaRequest): Promise<Nota> => {
    const response = await api.post<Nota>('/notas', data);
    return response.data;
  },

  update: async (id: number, data: UpdateNotaRequest): Promise<Nota> => {
    const response = await api.put<Nota>(`/notas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/notas/${id}`);
  },
};
