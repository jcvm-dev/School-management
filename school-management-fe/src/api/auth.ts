import api from './axios';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/registrar', data);
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  mudarSenha: async (senhaAtual: string, novaSenha: string): Promise<void> => {
    await api.put('/auth/alterar-senha', { senhaAtual, novaSenha });
  },
};
