import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { notasApi } from '../../api/notas';
import { Nota, CreateNotaRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, Column } from '../../components/ui/Table';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { NotaForm } from './NotaForm';
import { AxiosError } from 'axios';

const avaliacaoLabels: Record<string, string> = {
  PROVA_1: 'Prova 1',
  PROVA_2: 'Prova 2',
  TRABALHO: 'Trabalho',
  SEMINARIO: 'Seminário',
  ATIVIDADE: 'Atividade',
  RECUPERACAO: 'Recuperação',
};

const NotasPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNota, setEditingNota] = useState<Nota | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Nota | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: notas = [], isLoading } = useQuery({
    queryKey: ['notas'],
    queryFn: notasApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: notasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas'] });
      setModalOpen(false);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao registrar nota.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateNotaRequest }) =>
      notasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas'] });
      setModalOpen(false);
      setEditingNota(null);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao atualizar nota.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas'] });
      setDeleteTarget(null);
    },
  });

  const filtered = useMemo(
    () =>
      notas.filter(
        (n) =>
          (n.alunoNome || '').toLowerCase().includes(search.toLowerCase()) ||
          (n.turmaNome || '').toLowerCase().includes(search.toLowerCase()) ||
          n.avaliacao.toLowerCase().includes(search.toLowerCase())
      ),
    [notas, search]
  );

  const handleSubmit = async (data: CreateNotaRequest) => {
    if (editingNota) {
      await updateMutation.mutateAsync({ id: editingNota.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const openCreate = () => {
    setEditingNota(null);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEdit = (nota: Nota) => {
    setEditingNota(nota);
    setErrorMsg('');
    setModalOpen(true);
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getNotaColor = (valor: number) => {
    if (valor >= 7) return 'text-green-700 font-semibold';
    if (valor >= 5) return 'text-yellow-700 font-semibold';
    return 'text-red-700 font-semibold';
  };

  const columns: Column<Nota>[] = [
    {
      key: 'alunoNome',
      header: 'Aluno',
      render: (n) => n.alunoNome || `ID ${n.alunoId}`,
    },
    {
      key: 'turmaNome',
      header: 'Turma',
      render: (n) => n.turmaNome || `ID ${n.turmaId}`,
    },
    {
      key: 'avaliacao',
      header: 'Avaliação',
      render: (n) => avaliacaoLabels[n.avaliacao] || n.avaliacao,
    },
    {
      key: 'valor',
      header: 'Nota',
      render: (n) => (
        <span className={getNotaColor(n.valor)}>
          {n.valor.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'dataAvaliacao',
      header: 'Data',
      render: (n) => formatDate(n.dataAvaliacao),
    },
    {
      key: 'observacoes',
      header: 'Observações',
      render: (n) =>
        n.observacoes ? (
          <span className="line-clamp-1 max-w-xs text-gray-500" title={n.observacoes}>
            {n.observacoes}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (n) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(n)}
            title="Editar"
            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(n)}
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
          <h2 className="text-xl font-bold text-gray-900">Notas</h2>
          <p className="text-sm text-gray-500">{notas.length} nota(s) registrada(s)</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Registrar Nota
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Input
          placeholder="Buscar por aluno, turma ou avaliação..."
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
          keyExtractor={(n) => n.id}
          emptyMessage="Nenhuma nota encontrada."
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingNota(null);
          setErrorMsg('');
        }}
        title={editingNota ? 'Editar Nota' : 'Registrar Nota'}
        size="lg"
      >
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}
        <NotaForm
          defaultValues={editingNota ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingNota(null);
            setErrorMsg('');
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Excluir Nota"
        message={`Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default NotasPage;
