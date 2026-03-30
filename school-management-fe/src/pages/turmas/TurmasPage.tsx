import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { turmasApi } from '../../api/turmas';
import { Turma, CreateTurmaRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, Column } from '../../components/ui/Table';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { TurmaForm } from './TurmaForm';
import { AxiosError } from 'axios';

const periodoLabels: Record<string, string> = {
  MATUTINO: 'Matutino',
  VESPERTINO: 'Vespertino',
  NOTURNO: 'Noturno',
};

const TurmasPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Turma | null>(null);
  const [toggleTarget, setToggleTarget] = useState<Turma | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: turmas = [], isLoading } = useQuery({
    queryKey: ['turmas'],
    queryFn: turmasApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: turmasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
      setModalOpen(false);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao cadastrar turma.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateTurmaRequest }) =>
      turmasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
      setModalOpen(false);
      setEditingTurma(null);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao atualizar turma.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: turmasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
      setDeleteTarget(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (turma: Turma) =>
      turma.ativo ? turmasApi.desativar(turma.id) : turmasApi.ativar(turma.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
      setToggleTarget(null);
    },
  });

  const filtered = useMemo(
    () =>
      turmas.filter(
        (t) =>
          t.nome.toLowerCase().includes(search.toLowerCase()) ||
          t.codigo.toLowerCase().includes(search.toLowerCase()) ||
          (t.cursoNome || '').toLowerCase().includes(search.toLowerCase()) ||
          (t.professorNome || '').toLowerCase().includes(search.toLowerCase())
      ),
    [turmas, search]
  );

  const handleSubmit = async (data: CreateTurmaRequest) => {
    if (editingTurma) {
      await updateMutation.mutateAsync({ id: editingTurma.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const openCreate = () => {
    setEditingTurma(null);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setErrorMsg('');
    setModalOpen(true);
  };

  const columns: Column<Turma>[] = [
    { key: 'codigo', header: 'Código', className: 'font-medium' },
    { key: 'nome', header: 'Nome' },
    {
      key: 'periodo',
      header: 'Período',
      render: (t) => periodoLabels[t.periodo] || t.periodo,
    },
    { key: 'capacidade', header: 'Capacidade' },
    {
      key: 'cursoNome',
      header: 'Curso',
      render: (t) => t.cursoNome || `ID ${t.cursoId}`,
    },
    {
      key: 'professorNome',
      header: 'Professor',
      render: (t) => t.professorNome || `ID ${t.professorId}`,
    },
    {
      key: 'ativo',
      header: 'Status',
      render: (t) => (
        <Badge variant={t.ativo ? 'success' : 'danger'}>
          {t.ativo ? 'Ativa' : 'Inativa'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (t) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setToggleTarget(t)}
            title={t.ativo ? 'Desativar' : 'Ativar'}
            className={`p-1.5 rounded-lg transition-colors ${
              t.ativo
                ? 'text-green-600 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            {t.ativo ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => openEdit(t)}
            title="Editar"
            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(t)}
            title="Excluir"
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Turmas</h2>
          <p className="text-sm text-gray-500">{turmas.length} turma(s) cadastrada(s)</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Nova Turma
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Input
          placeholder="Buscar por nome, código, curso ou professor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Table
          data={filtered}
          columns={columns}
          isLoading={isLoading}
          keyExtractor={(t) => t.id}
          emptyMessage="Nenhuma turma encontrada."
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTurma(null);
          setErrorMsg('');
        }}
        title={editingTurma ? 'Editar Turma' : 'Nova Turma'}
        size="xl"
      >
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}
        <TurmaForm
          defaultValues={editingTurma ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingTurma(null);
            setErrorMsg('');
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Excluir Turma"
        message={`Tem certeza que deseja excluir a turma "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={() => toggleTarget && toggleMutation.mutate(toggleTarget)}
        title={toggleTarget?.ativo ? 'Desativar Turma' : 'Ativar Turma'}
        message={`Tem certeza que deseja ${toggleTarget?.ativo ? 'desativar' : 'ativar'} a turma "${toggleTarget?.nome}"?`}
        confirmLabel={toggleTarget?.ativo ? 'Desativar' : 'Ativar'}
        variant={toggleTarget?.ativo ? 'danger' : 'warning'}
        isLoading={toggleMutation.isPending}
      />
    </div>
  );
};

export default TurmasPage;
