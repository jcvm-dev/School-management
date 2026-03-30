import api from './axios';
import { Curso, CreateCursoRequest, UpdateCursoRequest, NivelCurso } from '../types';

export const cursosApi = {
  getAll: async (): Promise<Curso[]> => {
    const response = await api.get<Curso[]>('/cursos');
    return response.data;
  },

  getById: async (id: number): Promise<Curso> => {
    const response = await api.get<Curso>(`/cursos/${id}`);
    return response.data;
  },

  getAtivos: async (): Promise<Curso[]> => {
    const response = await api.get<Curso[]>('/cursos/ativos');
    return response.data;
  },

  buscarPorNome: async (nome: string): Promise<Curso[]> => {
    const response = await api.get<Curso[]>(`/cursos/buscar?nome=${encodeURIComponent(nome)}`);
    return response.data;
  },

  getByNivel: async (nivel: NivelCurso): Promise<Curso[]> => {
    const response = await api.get<Curso[]>(`/cursos/nivel/${nivel}`);
    return response.data;
  },

  create: async (data: CreateCursoRequest): Promise<Curso> => {
    const response = await api.post<Curso>('/cursos', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCursoRequest): Promise<Curso> => {
    const response = await api.put<Curso>(`/cursos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/cursos/${id}`);
  },

  ativar: async (id: number): Promise<Curso> => {
    const response = await api.patch<Curso>(`/cursos/${id}/ativar`);
    return response.data;
  },

  desativar: async (id: number): Promise<Curso> => {
    const response = await api.patch<Curso>(`/cursos/${id}/desativar`);
    return response.data;
  },
};
