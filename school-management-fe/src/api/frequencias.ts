import api from './axios';
import { Frequencia, CreateFrequenciaRequest, UpdateFrequenciaRequest } from '../types';

export const frequenciasApi = {
  getAll: async (): Promise<Frequencia[]> => {
    const response = await api.get<Frequencia[]>('/frequencias');
    return response.data;
  },

  getById: async (id: number): Promise<Frequencia> => {
    const response = await api.get<Frequencia>(`/frequencias/${id}`);
    return response.data;
  },

  getByAluno: async (alunoId: number): Promise<Frequencia[]> => {
    const response = await api.get<Frequencia[]>(`/frequencias/aluno/${alunoId}`);
    return response.data;
  },

  getByTurma: async (turmaId: number): Promise<Frequencia[]> => {
    const response = await api.get<Frequencia[]>(`/frequencias/turma/${turmaId}`);
    return response.data;
  },

  getTaxaPresenca: async (alunoId: number, turmaId: number): Promise<number> => {
    const response = await api.get<number>(`/frequencias/aluno/${alunoId}/turma/${turmaId}/taxa-presenca`);
    return response.data;
  },

  create: async (data: CreateFrequenciaRequest): Promise<Frequencia> => {
    const response = await api.post<Frequencia>('/frequencias', data);
    return response.data;
  },

  update: async (id: number, data: UpdateFrequenciaRequest): Promise<Frequencia> => {
    const response = await api.put<Frequencia>(`/frequencias/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/frequencias/${id}`);
  },
};
