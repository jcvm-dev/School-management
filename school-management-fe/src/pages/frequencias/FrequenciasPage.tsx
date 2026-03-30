import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { frequenciasApi } from '../../api/frequencias';
import { Frequencia, CreateFrequenciaRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, Column } from '../../components/ui/Table';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { getFrequenciaStatusBadge } from '../../components/ui/Badge';
import { FrequenciaForm } from './FrequenciaForm';
import { AxiosError } from 'axios';

const FrequenciasPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFrequencia, setEditingFrequencia] = useState<Frequencia | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Frequencia | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: frequencias = [], isLoading } = useQuery({
    queryKey: ['frequencias'],
    queryFn: frequenciasApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: frequenciasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frequencias'] });
      setModalOpen(false);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao registrar frequência.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateFrequenciaRequest }) =>
      frequenciasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frequencias'] });
      setModalOpen(false);
      setEditingFrequencia(null);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao atualizar frequência.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: frequenciasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['frequencias'] });
      setDeleteTarget(null);
    },
  });

  const filtered = useMemo(
    () =>
      frequencias.filter(
        (f) =>
          (f.alunoNome || '').toLowerCase().includes(search.toLowerCase()) ||
          (f.turmaNome || '').toLowerCase().includes(search.toLowerCase()) ||
          f.status.toLowerCase().includes(search.toLowerCase())
      ),
    [frequencias, search]
  );

  const handleSubmit = async (data: CreateFrequenciaRequest) => {
    if (editingFrequencia) {
      await updateMutation.mutateAsync({ id: editingFrequencia.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const openCreate = () => {
    setEditingFrequencia(null);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEdit = (frequencia: Frequencia) => {
    setEditingFrequencia(frequencia);
    setErrorMsg('');
    setModalOpen(true);
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const presencaCount = frequencias.filter((f) => f.status === 'PRESENTE').length;
  const ausenciaCount = frequencias.filter((f) => f.status === 'AUSENTE').length;
  const justificadaCount = frequencias.filter((f) => f.status === 'FALTA_JUSTIFICADA').length;

  const columns: Column<Frequencia>[] = [
    {
      key: 'alunoNome',
      header: 'Aluno',
      render: (f) => f.alunoNome || `ID ${f.alunoId}`,
    },
    {
      key: 'turmaNome',
      header: 'Turma',
      render: (f) => f.turmaNome || `ID ${f.turmaId}`,
    },
    {
      key: 'dataAula',
      header: 'Data da Aula',
      render: (f) => formatDate(f.dataAula),
    },
    {
      key: 'status',
      header: 'Presença',
      render: (f) => getFrequenciaStatusBadge(f.status),
    },
    {
      key: 'justificativa',
      header: 'Justificativa',
      render: (f) =>
        f.justificativa ? (
          <span className="line-clamp-1 max-w-xs text-gray-500" title={f.justificativa}>
            {f.justificativa}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (f) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEdit(f)}
            title="Editar"
            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(f)}
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
          <h2 className="text-xl font-bold text-gray-900">Frequências</h2>
          <p className="text-sm text-gray-500">{frequencias.length} registro(s) de frequência</p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Registrar Frequência
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{presencaCount}</p>
          <p className="text-xs text-green-600 mt-1">Presenças</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{ausenciaCount}</p>
          <p className="text-xs text-red-600 mt-1">Ausências</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-700">{justificadaCount}</p>
          <p className="text-xs text-yellow-600 mt-1">Justificadas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Input
          placeholder="Buscar por aluno, turma ou status..."
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
          keyExtractor={(f) => f.id}
          emptyMessage="Nenhuma frequência encontrada."
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingFrequencia(null);
          setErrorMsg('');
        }}
        title={editingFrequencia ? 'Editar Frequência' : 'Registrar Frequência'}
        size="lg"
      >
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}
        <FrequenciaForm
          defaultValues={editingFrequencia ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingFrequencia(null);
            setErrorMsg('');
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Excluir Frequência"
        message="Tem certeza que deseja excluir este registro de frequência? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default FrequenciasPage;
