import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Professor, CreateProfessorRequest } from '../../types';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const professorSchema = z.object({
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  dataNascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  departamento: z.string().min(1, 'Departamento é obrigatório'),
  titulacao: z.string().min(1, 'Titulação é obrigatória'),
  especialidade: z.string().min(1, 'Especialidade é obrigatória'),
  ativo: z.boolean(),
});

type ProfessorFormData = z.infer<typeof professorSchema>;

interface ProfessorFormProps {
  defaultValues?: Professor;
  onSubmit: (data: CreateProfessorRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const titulacaoOptions = [
  { value: 'GRADUACAO', label: 'Graduação' },
  { value: 'ESPECIALIZACAO', label: 'Especialização' },
  { value: 'MESTRADO', label: 'Mestrado' },
  { value: 'DOUTORADO', label: 'Doutorado' },
  { value: 'POS_DOUTORADO', label: 'Pós-Doutorado' },
];

export const ProfessorForm: React.FC<ProfessorFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessorFormData>({
    resolver: zodResolver(professorSchema),
    defaultValues: defaultValues
      ? {
          matricula: defaultValues.matricula,
          nome: defaultValues.nome,
          email: defaultValues.email,
          telefone: defaultValues.telefone,
          dataNascimento: defaultValues.dataNascimento?.split('T')[0] ?? '',
          departamento: defaultValues.departamento,
          titulacao: defaultValues.titulacao,
          especialidade: defaultValues.especialidade,
          ativo: defaultValues.ativo,
        }
      : { ativo: true },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Matrícula"
          placeholder="Ex: PROF001"
          error={errors.matricula?.message}
          required
          {...register('matricula')}
        />
        <Input
          label="Nome Completo"
          placeholder="Ex: Maria Santos"
          error={errors.nome?.message}
          required
          {...register('nome')}
        />
        <Input
          label="E-mail"
          type="email"
          placeholder="Ex: maria@escola.com"
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
          label="Departamento"
          placeholder="Ex: Ciências Exatas"
          error={errors.departamento?.message}
          required
          {...register('departamento')}
        />
        <Select
          label="Titulação"
          options={titulacaoOptions}
          placeholder="Selecione a titulação"
          error={errors.titulacao?.message}
          required
          {...register('titulacao')}
        />
        <Input
          label="Especialidade"
          placeholder="Ex: Matemática Aplicada"
          error={errors.especialidade?.message}
          required
          {...register('especialidade')}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ativo-prof"
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          {...register('ativo')}
        />
        <label htmlFor="ativo-prof" className="text-sm font-medium text-gray-700">
          Professor ativo
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? 'Salvar Alterações' : 'Cadastrar Professor'}
        </Button>
      </div>
    </form>
  );
};
