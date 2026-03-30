import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Curso, CreateCursoRequest, NivelCurso } from '../../types';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const cursoSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  nome: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  nivel: z.enum(['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'], {
    required_error: 'Nível é obrigatório',
  }),
  cargaHoraria: z.coerce.number().min(1, 'Carga horária deve ser maior que 0'),
  ativo: z.boolean(),
});

type CursoFormData = z.infer<typeof cursoSchema>;

interface CursoFormProps {
  defaultValues?: Curso;
  onSubmit: (data: CreateCursoRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const nivelOptions = [
  { value: 'INICIANTE', label: 'Iniciante' },
  { value: 'INTERMEDIARIO', label: 'Intermediário' },
  { value: 'AVANCADO', label: 'Avançado' },
];

export const CursoForm: React.FC<CursoFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CursoFormData>({
    resolver: zodResolver(cursoSchema),
    defaultValues: defaultValues
      ? {
          codigo: defaultValues.codigo,
          nome: defaultValues.nome,
          descricao: defaultValues.descricao,
          nivel: defaultValues.nivel,
          cargaHoraria: defaultValues.cargaHoraria,
          ativo: defaultValues.ativo,
        }
      : { ativo: true, nivel: 'INICIANTE' as NivelCurso },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Código"
          placeholder="Ex: MAT101"
          error={errors.codigo?.message}
          required
          {...register('codigo')}
        />
        <Input
          label="Nome do Curso"
          placeholder="Ex: Matemática Básica"
          error={errors.nome?.message}
          required
          {...register('nome')}
        />
        <Select
          label="Nível"
          options={nivelOptions}
          placeholder="Selecione o nível"
          error={errors.nivel?.message}
          required
          {...register('nivel')}
        />
        <Input
          label="Carga Horária (horas)"
          type="number"
          placeholder="Ex: 60"
          min={1}
          error={errors.cargaHoraria?.message}
          required
          {...register('cargaHoraria')}
        />
      </div>

      <Textarea
        label="Descrição"
        placeholder="Descreva o conteúdo do curso..."
        error={errors.descricao?.message}
        required
        rows={3}
        {...register('descricao')}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ativo-curso"
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          {...register('ativo')}
        />
        <label htmlFor="ativo-curso" className="text-sm font-medium text-gray-700">
          Curso ativo
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? 'Salvar Alterações' : 'Cadastrar Curso'}
        </Button>
      </div>
    </form>
  );
};
