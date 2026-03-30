import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Trash2, Ban, Lock } from 'lucide-react';
import { matriculasApi } from '../../api/matriculas';
import { Matricula, CreateMatriculaRequest } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, Column } from '../../components/ui/Table';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { getMatriculaStatusBadge } from '../../components/ui/Badge';
import { MatriculaForm } from './MatriculaForm';
import { AxiosError } from 'axios';

const MatriculasPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Matricula | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Matricula | null>(null);
  const [trancarTarget, setTrancarTarget] = useState<Matricula | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: matriculas = [], isLoading } = useQuery({
    queryKey: ['matriculas'],
    queryFn: matriculasApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: matriculasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
      setModalOpen(false);
      setErrorMsg('');
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      setErrorMsg(err.response?.data?.message || 'Erro ao realizar matrícula.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: matriculasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
      setDeleteTarget(null);
    },
  });

  const cancelarMutation = useMutation({
    mutationFn: matriculasApi.cancelar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
      setCancelTarget(null);
    },
  });

  const trancarMutation = useMutation({
    mutationFn: matriculasApi.trancar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
      setTrancarTarget(null);
    },
  });

  const filtered = useMemo(
    () =>
      matriculas.filter(
        (m) =>
          (m.alunoNome || '').toLowerCase().includes(search.toLowerCase()) ||
          (m.turmaNome || '').toLowerCase().includes(search.toLowerCase()) ||
          m.status.toLowerCase().includes(search.toLowerCase())
      ),
    [matriculas, search]
  );

  const handleSubmit = async (data: CreateMatriculaRequest) => {
    await createMutation.mutateAsync(data);
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const columns: Column<Matricula>[] = [
    { key: 'id', header: 'ID', className: 'font-medium text-gray-500' },
    {
      key: 'alunoNome',
      header: 'Aluno',
      render: (m) => m.alunoNome || `ID ${m.alunoId}`,
    },
    {
      key: 'turmaNome',
      header: 'Turma',
      render: (m) => m.turmaNome || `ID ${m.turmaId}`,
    },
    {
      key: 'dataCriacao',
      header: 'Data',
      render: (m) => formatDate(m.dataCriacao || m.criadoEm),
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => getMatriculaStatusBadge(m.status),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (m) => (
        <div className="flex items-center gap-1">
          {m.status === 'ATIVA' && (
            <>
              <button
                onClick={() => setTrancarTarget(m)}
                title="Trancar"
                className="p-1.5 rounded-lg text-yellow-600 hover:bg-yellow-50 transition-colors"
              >
                <Lock className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCancelTarget(m)}
                title="Cancelar"
                className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <Ban className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => setDeleteTarget(m)}
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
          <h2 className="text-xl font-bold text-gray-900">Matrículas</h2>
          <p className="text-sm text-gray-500">{matriculas.length} matrícula(s) registrada(s)</p>
        </div>
        <Button onClick={() => { setErrorMsg(''); setModalOpen(true); }} leftIcon={<Plus className="w-4 h-4" />}>
          Nova Matrícula
        </Button>
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
          keyExtractor={(m) => m.id}
          emptyMessage="Nenhuma matrícula encontrada."
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setErrorMsg(''); }}
        title="Nova Matrícula"
        size="md"
      >
        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-700">{errorMsg}</p>
          </div>
        )}
        <MatriculaForm
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setErrorMsg(''); }}
          isLoading={createMutation.isPending}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Excluir Matrícula"
        message={`Tem certeza que deseja excluir esta matrícula? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => cancelTarget && cancelarMutation.mutate(cancelTarget.id)}
        title="Cancelar Matrícula"
        message={`Tem certeza que deseja cancelar a matrícula do aluno "${cancelTarget?.alunoNome}"?`}
        confirmLabel="Cancelar Matrícula"
        isLoading={cancelarMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!trancarTarget}
        onClose={() => setTrancarTarget(null)}
        onConfirm={() => trancarTarget && trancarMutation.mutate(trancarTarget.id)}
        title="Trancar Matrícula"
        message={`Tem certeza que deseja trancar a matrícula do aluno "${trancarTarget?.alunoNome}"?`}
        confirmLabel="Trancar"
        variant="warning"
        isLoading={trancarMutation.isPending}
      />
    </div>
  );
};

export default MatriculasPage;
