import api from './axios';
import { Professor, CreateProfessorRequest, UpdateProfessorRequest } from '../types';

export const professoresApi = {
  getAll: async (): Promise<Professor[]> => {
    const response = await api.get<Professor[]>('/professores');
    return response.data;
  },

  getById: async (id: number): Promise<Professor> => {
    const response = await api.get<Professor>(`/professores/${id}`);
    return response.data;
  },

  getAtivos: async (): Promise<Professor[]> => {
    const response = await api.get<Professor[]>('/professores/ativos');
    return response.data;
  },

  buscarPorNome: async (nome: string): Promise<Professor[]> => {
    const response = await api.get<Professor[]>(`/professores/buscar?nome=${encodeURIComponent(nome)}`);
    return response.data;
  },

  getByMatricula: async (matricula: string): Promise<Professor> => {
    const response = await api.get<Professor>(`/professores/matricula/${matricula}`);
    return response.data;
  },

  create: async (data: CreateProfessorRequest): Promise<Professor> => {
    const response = await api.post<Professor>('/professores', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProfessorRequest): Promise<Professor> => {
    const response = await api.put<Professor>(`/professores/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/professores/${id}`);
  },

  ativar: async (id: number): Promise<Professor> => {
    const response = await api.patch<Professor>(`/professores/${id}/ativar`);
    return response.data;
  },

  desativar: async (id: number): Promise<Professor> => {
    const response = await api.patch<Professor>(`/professores/${id}/desativar`);
    return response.data;
  },
};
