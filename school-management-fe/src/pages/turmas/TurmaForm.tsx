import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Turma, CreateTurmaRequest } from '../../types';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { cursosApi } from '../../api/cursos';
import { professoresApi } from '../../api/professores';

const turmaSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  periodo: z.enum(['MATUTINO', 'VESPERTINO', 'NOTURNO'], {
    required_error: 'Período é obrigatório',
  }),
  capacidade: z.coerce.number().min(1, 'Capacidade deve ser maior que 0'),
  cursoId: z.coerce.number().min(1, 'Selecione um curso'),
  professorId: z.coerce.number().min(1, 'Selecione um professor'),
  ativo: z.boolean(),
});

type TurmaFormData = z.infer<typeof turmaSchema>;

interface TurmaFormProps {
  defaultValues?: Turma;
  onSubmit: (data: CreateTurmaRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const periodoOptions = [
  { value: 'MATUTINO', label: 'Matutino' },
  { value: 'VESPERTINO', label: 'Vespertino' },
  { value: 'NOTURNO', label: 'Noturno' },
];

export const TurmaForm: React.FC<TurmaFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { data: cursos = [] } = useQuery({
    queryKey: ['cursos', 'ativos'],
    queryFn: cursosApi.getAtivos,
  });

  const { data: professores = [] } = useQuery({
    queryKey: ['professores', 'ativos'],
    queryFn: professoresApi.getAtivos,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TurmaFormData>({
    resolver: zodResolver(turmaSchema),
    defaultValues: defaultValues
      ? {
          codigo: defaultValues.codigo,
          nome: defaultValues.nome,
          periodo: defaultValues.periodo,
          capacidade: defaultValues.capacidade,
          cursoId: defaultValues.cursoId,
          professorId: defaultValues.professorId,
          ativo: defaultValues.ativo,
        }
      : { ativo: true, periodo: 'MATUTINO' },
  });

  const cursoOptions = cursos.map((c) => ({ value: c.id, label: `${c.codigo} - ${c.nome}` }));
  const professorOptions = professores.map((p) => ({ value: p.id, label: p.nome }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Código"
          placeholder="Ex: TUR2024-1"
          error={errors.codigo?.message}
          required
          {...register('codigo')}
        />
        <Input
          label="Nome da Turma"
          placeholder="Ex: Turma A - Manhã"
          error={errors.nome?.message}
          required
          {...register('nome')}
        />
        <Select
          label="Período"
          options={periodoOptions}
          error={errors.periodo?.message}
          required
          {...register('periodo')}
        />
        <Input
          label="Capacidade"
          type="number"
          placeholder="Ex: 30"
          min={1}
          error={errors.capacidade?.message}
          required
          {...register('capacidade')}
        />
        <Select
          label="Curso"
          options={cursoOptions}
          placeholder="Selecione o curso"
          error={errors.cursoId?.message}
          required
          {...register('cursoId')}
        />
        <Select
          label="Professor"
          options={professorOptions}
          placeholder="Selecione o professor"
          error={errors.professorId?.message}
          required
          {...register('professorId')}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ativo-turma"
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          {...register('ativo')}
        />
        <label htmlFor="ativo-turma" className="text-sm font-medium text-gray-700">
          Turma ativa
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? 'Salvar Alterações' : 'Cadastrar Turma'}
        </Button>
      </div>
    </form>
  );
};
