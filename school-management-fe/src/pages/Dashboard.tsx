import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, GraduationCap, BookOpen, School, TrendingUp, AlertCircle } from 'lucide-react';
import { alunosApi } from '../api/alunos';
import { professoresApi } from '../api/professores';
import { cursosApi } from '../api/cursos';
import { turmasApi } from '../api/turmas';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface StatCardProps {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  bgColor,
  isLoading,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
    <div className={`${bgColor} p-3 rounded-xl`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {isLoading ? (
        <div className="mt-1">
          <LoadingSpinner size="sm" />
        </div>
      ) : (
        <p className={`text-3xl font-bold ${color}`}>{value ?? 0}</p>
      )}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { data: alunos, isLoading: loadingAlunos } = useQuery({
    queryKey: ['alunos'],
    queryFn: alunosApi.getAll,
  });

  const { data: professores, isLoading: loadingProfessores } = useQuery({
    queryKey: ['professores'],
    queryFn: professoresApi.getAll,
  });

  const { data: cursos, isLoading: loadingCursos } = useQuery({
    queryKey: ['cursos'],
    queryFn: cursosApi.getAll,
  });

  const { data: turmas, isLoading: loadingTurmas } = useQuery({
    queryKey: ['turmas'],
    queryFn: turmasApi.getAll,
  });

  const alunosAtivos = alunos?.filter((a) => a.ativo).length ?? 0;
  const professoresAtivos = professores?.filter((p) => p.ativo).length ?? 0;
  const cursosAtivos = cursos?.filter((c) => c.ativo).length ?? 0;
  const turmasAtivas = turmas?.filter((t) => t.ativo).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6" />
          <h2 className="text-xl font-bold">Bem-vindo ao SGA</h2>
        </div>
        <p className="text-indigo-200 text-sm">
          Sistema de Gerenciamento de Alunos — visão geral do sistema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Alunos"
          value={alunos?.length}
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          color="text-indigo-700"
          bgColor="bg-indigo-50"
          isLoading={loadingAlunos}
        />
        <StatCard
          title="Total de Professores"
          value={professores?.length}
          icon={<GraduationCap className="w-6 h-6 text-blue-600" />}
          color="text-blue-700"
          bgColor="bg-blue-50"
          isLoading={loadingProfessores}
        />
        <StatCard
          title="Total de Cursos"
          value={cursos?.length}
          icon={<BookOpen className="w-6 h-6 text-emerald-600" />}
          color="text-emerald-700"
          bgColor="bg-emerald-50"
          isLoading={loadingCursos}
        />
        <StatCard
          title="Total de Turmas"
          value={turmas?.length}
          icon={<School className="w-6 h-6 text-violet-600" />}
          color="text-violet-700"
          bgColor="bg-violet-50"
          isLoading={loadingTurmas}
        />
      </div>

      {/* Active Stats */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Registros Ativos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Alunos Ativos', value: alunosAtivos, total: alunos?.length ?? 0, color: 'indigo' },
            { label: 'Professores Ativos', value: professoresAtivos, total: professores?.length ?? 0, color: 'blue' },
            { label: 'Cursos Ativos', value: cursosAtivos, total: cursos?.length ?? 0, color: 'emerald' },
            { label: 'Turmas Ativas', value: turmasAtivas, total: turmas?.length ?? 0, color: 'violet' },
          ].map((stat) => {
            const pct = stat.total > 0 ? Math.round((stat.value / stat.total) * 100) : 0;
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {stat.value}/{stat.total}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`bg-${stat.color}-500 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{pct}% ativos</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-semibold text-gray-800">Resumo do Sistema</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Alunos Inativos', value: (alunos?.length ?? 0) - alunosAtivos },
            { label: 'Professores Inativos', value: (professores?.length ?? 0) - professoresAtivos },
            { label: 'Cursos Inativos', value: (cursos?.length ?? 0) - cursosAtivos },
            { label: 'Turmas Inativas', value: (turmas?.length ?? 0) - turmasAtivas },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-700">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
