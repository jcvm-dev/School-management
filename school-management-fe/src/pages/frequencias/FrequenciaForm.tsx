import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Frequencia, CreateFrequenciaRequest, StatusFrequencia } from '../../types';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { alunosApi } from '../../api/alunos';
import { turmasApi } from '../../api/turmas';

const frequenciaSchema = z.object({
  alunoId: z.coerce.number().min(1, 'Selecione um aluno'),
  turmaId: z.coerce.number().min(1, 'Selecione uma turma'),
  dataAula: z.string().min(1, 'Data da aula é obrigatória'),
  status: z.enum(['PRESENTE', 'AUSENTE', 'FALTA_JUSTIFICADA'], {
    required_error: 'Status é obrigatório',
  }),
  justificativa: z.string().optional(),
});

type FrequenciaFormData = z.infer<typeof frequenciaSchema>;

interface FrequenciaFormProps {
  defaultValues?: Frequencia;
  onSubmit: (data: CreateFrequenciaRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const statusOptions = [
  { value: 'PRESENTE', label: 'Presente' },
  { value: 'AUSENTE', label: 'Ausente' },
  { value: 'FALTA_JUSTIFICADA', label: 'Falta Justificada' },
];

export const FrequenciaForm: React.FC<FrequenciaFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { data: alunos = [] } = useQuery({
    queryKey: ['alunos', 'ativos'],
    queryFn: alunosApi.getAtivos,
  });

  const { data: turmas = [] } = useQuery({
    queryKey: ['turmas', 'ativos'],
    queryFn: turmasApi.getAtivos,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FrequenciaFormData>({
    resolver: zodResolver(frequenciaSchema),
    defaultValues: defaultValues
      ? {
          alunoId: defaultValues.alunoId,
          turmaId: defaultValues.turmaId,
          dataAula: defaultValues.dataAula?.split('T')[0] ?? '',
          status: defaultValues.status,
          justificativa: defaultValues.justificativa ?? '',
        }
      : { status: 'PRESENTE' as StatusFrequencia },
  });

  const statusValue = watch('status');

  const alunoOptions = alunos.map((a) => ({
    value: a.id,
    label: `${a.matricula} - ${a.nome}`,
  }));

  const turmaOptions = turmas.map((t) => ({
    value: t.id,
    label: `${t.codigo} - ${t.nome}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Aluno"
          options={alunoOptions}
          placeholder="Selecione o aluno"
          error={errors.alunoId?.message}
          required
          {...register('alunoId')}
        />
        <Select
          label="Turma"
          options={turmaOptions}
          placeholder="Selecione a turma"
          error={errors.turmaId?.message}
          required
          {...register('turmaId')}
        />
        <Input
          label="Data da Aula"
          type="date"
          error={errors.dataAula?.message}
          required
          {...register('dataAula')}
        />
        <Select
          label="Status de Presença"
          options={statusOptions}
          error={errors.status?.message}
          required
          {...register('status')}
        />
      </div>

      {statusValue === 'FALTA_JUSTIFICADA' && (
        <Textarea
          label="Justificativa"
          placeholder="Descreva a justificativa da falta..."
          error={errors.justificativa?.message}
          rows={3}
          {...register('justificativa')}
        />
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? 'Salvar Alterações' : 'Registrar Frequência'}
        </Button>
      </div>
    </form>
  );
};
