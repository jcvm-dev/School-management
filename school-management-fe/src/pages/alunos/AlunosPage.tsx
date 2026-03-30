import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { alunosApi } from '../../api/alunos';
import { Aluno, CreateAlunoRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, Column } from '../../components/ui/Table';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { AlunoForm } from './AlunoForm';
import { AxiosError } from 'axios';

const AlunosPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Aluno | null>(null);
  const [toggleTarget, setToggleTarget] = useState<Aluno | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: alunos = [], isLoading } = useQuery({
    queryKey: ['alunos'],
    queryFn: alunosApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: alunosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      setModalOpen(false);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao cadastrar aluno.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateAlunoRequest }) =>
      alunosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      setModalOpen(false);
      setEditingAluno(null);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao atualizar aluno.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: alunosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      setDeleteTarget(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (aluno: Aluno) =>
      aluno.ativo ? alunosApi.desativar(aluno.id) : alunosApi.ativar(aluno.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
      setToggleTarget(null);
    },
  });

  const filtered = useMemo(
    () =>
      alunos.filter(
        (a) =>
          a.nome.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase()) ||
          a.matricula.toLowerCase().includes(search.toLowerCase())
      ),
    [alunos, search]
  );

  const handleSubmit = async (data: CreateAlunoRequest) => {
    if (editingAluno) {
      await updateMutation.mutateAsync({ id: editingAluno.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const openCreate = () => {
    setEditingAluno(null);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEdit = (aluno: Aluno) => {
    setEditingAluno(aluno);
    setErrorMsg('');
    setModalOpen(true);
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const columns: Column<Aluno>[] = [
    { key: 'matricula', header: 'Matrícula', className: 'font-medium' },
    { key: 'nome', header: 'Nome' },
    { key: 'email', header: 'E-mail' },
    { key: 'telefone', header: 'Telefone' },
    {
      key: 'dataNascimento',
      header: 'Nascimento',
      render: (a) => formatDate(a.dataNascimento),
    },
    {
      key: 'ativo',
      header: 'Status',
      render: (a) => (
        <Badge variant={a.ativo ? 'success' : 'danger'}>
          {a.ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (a) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setToggleTarget(a)}
            title={a.ativo ? 'Desativar' : 'Ativar'}
            className={`p-1.5 rounded-lg transition-colors ${
              a.ativo
                ? 'text-green-600 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            {a.ativo ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => openEdit(a)}
            title="Editar"
            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(a)}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Alunos</h2>
          <p className="text-sm text-gray-500">{alunos.length} aluno(s) cadastrado(s)</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Novo Aluno
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Input
          placeholder="Buscar por nome, e-mail ou matrícula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Table
          data={filtered}
          columns={columns}
          isLoading={isLoading}
          keyExtractor={(a) => a.id}
          emptyMessage="Nenhum aluno encontrado."
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAluno(null);
          setErrorMsg('');
        }}
        title={editingAluno ? 'Editar Aluno' : 'Novo Aluno'}
        size="xl"
      >
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}
        <AlunoForm
          defaultValues={editingAluno ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingAluno(null);
            setErrorMsg('');
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Excluir Aluno"
        message={`Tem certeza que deseja excluir o aluno "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
      />

      {/* Toggle Confirm */}
      <ConfirmModal
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={() => toggleTarget && toggleMutation.mutate(toggleTarget)}
        title={toggleTarget?.ativo ? 'Desativar Aluno' : 'Ativar Aluno'}
        message={`Tem certeza que deseja ${toggleTarget?.ativo ? 'desativar' : 'ativar'} o aluno "${toggleTarget?.nome}"?`}
        confirmLabel={toggleTarget?.ativo ? 'Desativar' : 'Ativar'}
        variant={toggleTarget?.ativo ? 'danger' : 'warning'}
        isLoading={toggleMutation.isPending}
      />
    </div>
  );
};

export default AlunosPage;
