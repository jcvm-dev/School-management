import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { CreateMatriculaRequest } from '../../types';
import { Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { alunosApi } from '../../api/alunos';
import { turmasApi } from '../../api/turmas';

const matriculaSchema = z.object({
  alunoId: z.coerce.number().min(1, 'Selecione um aluno'),
  turmaId: z.coerce.number().min(1, 'Selecione uma turma'),
});

type MatriculaFormData = z.infer<typeof matriculaSchema>;

interface MatriculaFormProps {
  onSubmit: (data: CreateMatriculaRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const MatriculaForm: React.FC<MatriculaFormProps> = ({
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
    formState: { errors },
  } = useForm<MatriculaFormData>({
    resolver: zodResolver(matriculaSchema),
  });

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
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Realizar Matrícula
        </Button>
      </div>
    </form>
  );
};
