import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { professoresApi } from '../../api/professores';
import { Professor, CreateProfessorRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, Column } from '../../components/ui/Table';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { ProfessorForm } from './ProfessorForm';
import { AxiosError } from 'axios';

const titulacaoLabels: Record<string, string> = {
  GRADUACAO: 'Graduação',
  ESPECIALIZACAO: 'Especialização',
  MESTRADO: 'Mestrado',
  DOUTORADO: 'Doutorado',
  POS_DOUTORADO: 'Pós-Doutorado',
};

const ProfessoresPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Professor | null>(null);
  const [toggleTarget, setToggleTarget] = useState<Professor | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: professores = [], isLoading } = useQuery({
    queryKey: ['professores'],
    queryFn: professoresApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: professoresApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      setModalOpen(false);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao cadastrar professor.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateProfessorRequest }) =>
      professoresApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      setModalOpen(false);
      setEditingProfessor(null);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao atualizar professor.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: professoresApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      setDeleteTarget(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (professor: Professor) =>
      professor.ativo
        ? professoresApi.desativar(professor.id)
        : professoresApi.ativar(professor.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professores'] });
      setToggleTarget(null);
    },
  });

  const filtered = useMemo(
    () =>
      professores.filter(
        (p) =>
          p.nome.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase()) ||
          p.matricula.toLowerCase().includes(search.toLowerCase()) ||
          p.departamento.toLowerCase().includes(search.toLowerCase())
      ),
    [professores, search]
  );

  const handleSubmit = async (data: CreateProfessorRequest) => {
    if (editingProfessor) {
      await updateMutation.mutateAsync({ id: editingProfessor.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const openCreate = () => {
    setEditingProfessor(null);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEdit = (professor: Professor) => {
    setEditingProfessor(professor);
    setErrorMsg('');
    setModalOpen(true);
  };

  const columns: Column<Professor>[] = [
    { key: 'matricula', header: 'Matrícula', className: 'font-medium' },
    { key: 'nome', header: 'Nome' },
    { key: 'email', header: 'E-mail' },
    { key: 'departamento', header: 'Departamento' },
    {
      key: 'titulacao',
      header: 'Titulação',
      render: (p) => titulacaoLabels[p.titulacao] || p.titulacao,
    },
    { key: 'especialidade', header: 'Especialidade' },
    {
      key: 'ativo',
      header: 'Status',
      render: (p) => (
        <Badge variant={p.ativo ? 'success' : 'danger'}>
          {p.ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (p) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setToggleTarget(p)}
            title={p.ativo ? 'Desativar' : 'Ativar'}
            className={`p-1.5 rounded-lg transition-colors ${
              p.ativo
                ? 'text-green-600 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            {p.ativo ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => openEdit(p)}
            title="Editar"
            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(p)}
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
          <h2 className="text-xl font-bold text-gray-900">Professores</h2>
          <p className="text-sm text-gray-500">{professores.length} professor(es) cadastrado(s)</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Novo Professor
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Input
          placeholder="Buscar por nome, e-mail, matrícula ou departamento..."
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
          keyExtractor={(p) => p.id}
          emptyMessage="Nenhum professor encontrado."
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProfessor(null);
          setErrorMsg('');
        }}
        title={editingProfessor ? 'Editar Professor' : 'Novo Professor'}
        size="xl"
      >
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}
        <ProfessorForm
          defaultValues={editingProfessor ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingProfessor(null);
            setErrorMsg('');
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Excluir Professor"
        message={`Tem certeza que deseja excluir o professor "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={() => toggleTarget && toggleMutation.mutate(toggleTarget)}
        title={toggleTarget?.ativo ? 'Desativar Professor' : 'Ativar Professor'}
        message={`Tem certeza que deseja ${toggleTarget?.ativo ? 'desativar' : 'ativar'} o professor "${toggleTarget?.nome}"?`}
        confirmLabel={toggleTarget?.ativo ? 'Desativar' : 'Ativar'}
        variant={toggleTarget?.ativo ? 'danger' : 'warning'}
        isLoading={toggleMutation.isPending}
      />
    </div>
  );
};

export default ProfessoresPage;
