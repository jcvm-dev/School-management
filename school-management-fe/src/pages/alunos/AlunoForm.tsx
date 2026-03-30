import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Aluno, CreateAlunoRequest } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const alunoSchema = z.object({
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(2, 'Estado é obrigatório').max(2, 'Use a sigla do estado'),
  cep: z.string().min(8, 'CEP inválido').max(9, 'CEP inválido'),
  ativo: z.boolean(),
});

type AlunoFormData = z.infer<typeof alunoSchema>;

interface AlunoFormProps {
  defaultValues?: Aluno;
  onSubmit: (data: CreateAlunoRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const AlunoForm: React.FC<AlunoFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: defaultValues
      ? {
          matricula: defaultValues.matricula,
          nome: defaultValues.nome,
          email: defaultValues.email,
          telefone: defaultValues.telefone,
          dataNascimento: defaultValues.dataNascimento?.split('T')[0] ?? '',
          cpf: defaultValues.cpf,
          endereco: defaultValues.endereco,
          cidade: defaultValues.cidade,
          estado: defaultValues.estado,
          cep: defaultValues.cep,
          ativo: defaultValues.ativo,
        }
      : { ativo: true },
  });

  const handleFormSubmit = async (data: AlunoFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Matrícula"
          placeholder="Ex: 2024001"
          error={errors.matricula?.message}
          required
          {...register('matricula')}
        />
        <Input
          label="Nome Completo"
          placeholder="Ex: João Silva"
          error={errors.nome?.message}
          required
          {...register('nome')}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="Ex: joao@email.com"
          error={errors.email?.message}
          required
          {...register('email')}
        />
        <Input
          label="Telefone"
          placeholder="Ex: (11) 99999-9999"
          error={errors.telefone?.message}
          required
          {...register('telefone')}
        />
        <Input
          label="Data de Nascimento"
          type="date"
          error={errors.dataNascimento?.message}
          required
          {...register('dataNascimento')}
        />
        <Input
          label="CPF"
          placeholder="Ex: 000.000.000-00"
          error={errors.cpf?.message}
          required
          {...register('cpf')}
        />
        <Input
          label="Endereço"
          placeholder="Ex: Rua das Flores, 123"
          error={errors.endereco?.message}
          required
          {...register('endereco')}
        />
        <Input
          label="Cidade"
          placeholder="Ex: São Paulo"
          error={errors.cidade?.message}
          required
          {...register('cidade')}
        />
        <Input
          label="Estado (UF)"
          placeholder="Ex: SP"
          maxLength={2}
          error={errors.estado?.message}
          required
          {...register('estado')}
        />
        <Input
          label="CEP"
          placeholder="Ex: 01310-100"
          error={errors.cep?.message}
          required
          {...register('cep')}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ativo"
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          {...register('ativo')}
        />
        <label htmlFor="ativo" className="text-sm font-medium text-gray-700">
          Aluno ativo
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? 'Salvar Alterações' : 'Cadastrar Aluno'}
        </Button>
      </div>
    </form>
  );
};
