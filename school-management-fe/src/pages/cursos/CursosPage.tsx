import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { cursosApi } from '../../api/cursos';
import { Curso, CreateCursoRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, Column } from '../../components/ui/Table';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { Badge, getNivelBadge } from '../../components/ui/Badge';
import { CursoForm } from './CursoForm';
import { AxiosError } from 'axios';

const CursosPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Curso | null>(null);
  const [toggleTarget, setToggleTarget] = useState<Curso | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: cursos = [], isLoading } = useQuery({
    queryKey: ['cursos'],
    queryFn: cursosApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: cursosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      setModalOpen(false);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao cadastrar curso.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateCursoRequest }) =>
      cursosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      setModalOpen(false);
      setEditingCurso(null);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao atualizar curso.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: cursosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      setDeleteTarget(null);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (curso: Curso) =>
      curso.ativo ? cursosApi.desativar(curso.id) : cursosApi.ativar(curso.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      setToggleTarget(null);
    },
  });

  const filtered = useMemo(
    () =>
      cursos.filter(
        (c) =>
          c.nome.toLowerCase().includes(search.toLowerCase()) ||
          c.codigo.toLowerCase().includes(search.toLowerCase()) ||
          c.descricao.toLowerCase().includes(search.toLowerCase())
      ),
    [cursos, search]
  );

  const handleSubmit = async (data: CreateCursoRequest) => {
    if (editingCurso) {
      await updateMutation.mutateAsync({ id: editingCurso.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const openCreate = () => {
    setEditingCurso(null);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEdit = (curso: Curso) => {
    setEditingCurso(curso);
    setErrorMsg('');
    setModalOpen(true);
  };

  const columns: Column<Curso>[] = [
    { key: 'codigo', header: 'Código', className: 'font-medium' },
    { key: 'nome', header: 'Nome' },
    {
      key: 'nivel',
      header: 'Nível',
      render: (c) => getNivelBadge(c.nivel),
    },
    {
      key: 'cargaHoraria',
      header: 'Carga Horária',
      render: (c) => `${c.cargaHoraria}h`,
    },
    {
      key: 'descricao',
      header: 'Descrição',
      render: (c) => (
        <span className="line-clamp-1 max-w-xs" title={c.descricao}>
          {c.descricao}
        </span>
      ),
    },
    {
      key: 'ativo',
      header: 'Status',
      render: (c) => (
        <Badge variant={c.ativo ? 'success' : 'danger'}>
          {c.ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (c) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setToggleTarget(c)}
            title={c.ativo ? 'Desativar' : 'Ativar'}
            className={`p-1.5 rounded-lg transition-colors ${
              c.ativo
                ? 'text-green-600 hover:bg-green-50'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            {c.ativo ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => openEdit(c)}
            title="Editar"
            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(c)}
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
          <h2 className="text-xl font-bold text-gray-900">Cursos</h2>
          <p className="text-sm text-gray-500">{cursos.length} curso(s) cadastrado(s)</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Novo Curso
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Input
          placeholder="Buscar por nome, código ou descrição..."
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
          keyExtractor={(c) => c.id}
          emptyMessage="Nenhum curso encontrado."
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCurso(null);
          setErrorMsg('');
        }}
        title={editingCurso ? 'Editar Curso' : 'Novo Curso'}
        size="lg"
      >
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}
        <CursoForm
          defaultValues={editingCurso ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingCurso(null);
            setErrorMsg('');
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Excluir Curso"
        message={`Tem certeza que deseja excluir o curso "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={() => toggleTarget && toggleMutation.mutate(toggleTarget)}
        title={toggleTarget?.ativo ? 'Desativar Curso' : 'Ativar Curso'}
        message={`Tem certeza que deseja ${toggleTarget?.ativo ? 'desativar' : 'ativar'} o curso "${toggleTarget?.nome}"?`}
        confirmLabel={toggleTarget?.ativo ? 'Desativar' : 'Ativar'}
        variant={toggleTarget?.ativo ? 'danger' : 'warning'}
        isLoading={toggleMutation.isPending}
      />
    </div>
  );
};

export default CursosPage;
