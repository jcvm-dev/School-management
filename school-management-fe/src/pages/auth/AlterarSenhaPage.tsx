import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound } from 'lucide-react';
import { authApi } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AxiosError } from 'axios';

const schema = z.object({
  senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha: z.string().min(8, 'Nova senha deve ter ao menos 8 caracteres'),
  confirmarSenha: z.string().min(1, 'Confirmação é obrigatória'),
}).refine((data) => data.novaSenha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

type FormData = z.infer<typeof schema>;

const AlterarSenhaPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setErrorMessage('');
      await authApi.mudarSenha(data.senhaAtual, data.novaSenha);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setErrorMessage(
        axiosError.response?.data?.message ?? 'Erro ao alterar senha. Tente novamente.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-amber-500 rounded-2xl p-3 mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Alterar Senha</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Sua senha é temporária. Defina uma nova senha para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Senha atual"
            type="password"
            placeholder="••••••••"
            error={errors.senhaAtual?.message}
            {...register('senhaAtual')}
          />
          <Input
            label="Nova senha"
            type="password"
            placeholder="••••••••"
            error={errors.novaSenha?.message}
            {...register('novaSenha')}
          />
          <Input
            label="Confirmar nova senha"
            type="password"
            placeholder="••••••••"
            error={errors.confirmarSenha?.message}
            {...register('confirmarSenha')}
          />

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Salvar nova senha
          </Button>

          <button
            type="button"
            onClick={() => logout()}
            className="w-full text-sm text-gray-500 hover:text-gray-700 text-center"
          >
            Sair e fazer login com outra conta
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlterarSenhaPage;
