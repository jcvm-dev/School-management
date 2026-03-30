import api from './axios';
import { Matricula, CreateMatriculaRequest } from '../types';

export const matriculasApi = {
  getAll: async (): Promise<Matricula[]> => {
    const response = await api.get<Matricula[]>('/matriculas');
    return response.data;
  },

  getById: async (id: number): Promise<Matricula> => {
    const response = await api.get<Matricula>(`/matriculas/${id}`);
    return response.data;
  },

  getByAluno: async (alunoId: number): Promise<Matricula[]> => {
    const response = await api.get<Matricula[]>(`/matriculas/aluno/${alunoId}`);
    return response.data;
  },

  getByTurma: async (turmaId: number): Promise<Matricula[]> => {
    const response = await api.get<Matricula[]>(`/matriculas/turma/${turmaId}`);
    return response.data;
  },

  create: async (data: CreateMatriculaRequest): Promise<Matricula> => {
    const response = await api.post<Matricula>('/matriculas', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateMatriculaRequest>): Promise<Matricula> => {
    const response = await api.put<Matricula>(`/matriculas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/matriculas/${id}`);
  },

  cancelar: async (id: number): Promise<Matricula> => {
    const response = await api.patch<Matricula>(`/matriculas/${id}/cancelar`);
    return response.data;
  },

  trancar: async (id: number): Promise<Matricula> => {
    const response = await api.patch<Matricula>(`/matriculas/${id}/trancar`);
    return response.data;
  },
};
