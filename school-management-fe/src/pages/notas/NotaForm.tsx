import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Nota, CreateNotaRequest } from '../../types';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { alunosApi } from '../../api/alunos';
import { turmasApi } from '../../api/turmas';

const notaSchema = z.object({
  alunoId: z.coerce.number().min(1, 'Selecione um aluno'),
  turmaId: z.coerce.number().min(1, 'Selecione uma turma'),
  avaliacao: z.string().min(1, 'Tipo de avaliação é obrigatório'),
  valor: z.coerce
    .number()
    .min(0, 'Nota deve ser entre 0 e 10')
    .max(10, 'Nota deve ser entre 0 e 10'),
  dataAvaliacao: z.string().min(1, 'Data da avaliação é obrigatória'),
  observacoes: z.string().optional(),
});

type NotaFormData = z.infer<typeof notaSchema>;

interface NotaFormProps {
  defaultValues?: Nota;
  onSubmit: (data: CreateNotaRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const avaliacaoOptions = [
  { value: 'PROVA_1', label: 'Prova 1' },
  { value: 'PROVA_2', label: 'Prova 2' },
  { value: 'TRABALHO', label: 'Trabalho' },
  { value: 'SEMINARIO', label: 'Seminário' },
  { value: 'ATIVIDADE', label: 'Atividade' },
  { value: 'RECUPERACAO', label: 'Recuperação' },
];

export const NotaForm: React.FC<NotaFormProps> = ({
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
    formState: { errors },
  } = useForm<NotaFormData>({
    resolver: zodResolver(notaSchema),
    defaultValues: defaultValues
      ? {
          alunoId: defaultValues.alunoId,
          turmaId: defaultValues.turmaId,
          avaliacao: defaultValues.avaliacao,
          valor: defaultValues.valor,
          dataAvaliacao: defaultValues.dataAvaliacao?.split('T')[0] ?? '',
          observacoes: defaultValues.observacoes ?? '',
        }
      : undefined,
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
        <Select
          label="Tipo de Avaliação"
          options={avaliacaoOptions}
          placeholder="Selecione a avaliação"
          error={errors.avaliacao?.message}
          required
          {...register('avaliacao')}
        />
        <Input
          label="Nota (0 - 10)"
          type="number"
          step="0.1"
          min={0}
          max={10}
          placeholder="Ex: 7.5"
          error={errors.valor?.message}
          required
          {...register('valor')}
        />
        <Input
          label="Data da Avaliação"
          type="date"
          error={errors.dataAvaliacao?.message}
          required
          {...register('dataAvaliacao')}
        />
      </div>

      <Textarea
        label="Observações"
        placeholder="Observações opcionais..."
        error={errors.observacoes?.message}
        rows={2}
        {...register('observacoes')}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? 'Salvar Alterações' : 'Registrar Nota'}
        </Button>
      </div>
    </form>
  );
};
