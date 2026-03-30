import api from './axios';
import { Turma, CreateTurmaRequest, UpdateTurmaRequest, PeriodoTurma } from '../types';

export const turmasApi = {
  getAll: async (): Promise<Turma[]> => {
    const response = await api.get<Turma[]>('/turmas');
    return response.data;
  },

  getById: async (id: number): Promise<Turma> => {
    const response = await api.get<Turma>(`/turmas/${id}`);
    return response.data;
  },

  getAtivos: async (): Promise<Turma[]> => {
    const response = await api.get<Turma[]>('/turmas/ativos');
    return response.data;
  },

  getByCurso: async (cursoId: number): Promise<Turma[]> => {
    const response = await api.get<Turma[]>(`/turmas/curso/${cursoId}`);
    return response.data;
  },

  getByProfessor: async (professorId: number): Promise<Turma[]> => {
    const response = await api.get<Turma[]>(`/turmas/professor/${professorId}`);
    return response.data;
  },

  getByPeriodo: async (periodo: PeriodoTurma): Promise<Turma[]> => {
    const response = await api.get<Turma[]>(`/turmas/periodo/${periodo}`);
    return response.data;
  },

  create: async (data: CreateTurmaRequest): Promise<Turma> => {
    const response = await api.post<Turma>('/turmas', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTurmaRequest): Promise<Turma> => {
    const response = await api.put<Turma>(`/turmas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/turmas/${id}`);
  },

  ativar: async (id: number): Promise<Turma> => {
    const response = await api.patch<Turma>(`/turmas/${id}/ativar`);
    return response.data;
  },

  desativar: async (id: number): Promise<Turma> => {
    const response = await api.patch<Turma>(`/turmas/${id}/desativar`);
    return response.data;
  },
};
