import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'gray';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-700',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gray',
  children,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const getStatusBadge = (ativo: boolean) => (
  <Badge variant={ativo ? 'success' : 'danger'}>
    {ativo ? 'Ativo' : 'Inativo'}
  </Badge>
);

export const getMatriculaStatusBadge = (status: string) => {
  const map: Record<string, BadgeVariant> = {
    ATIVA: 'success',
    CANCELADA: 'danger',
    TRANCADA: 'warning',
    CONCLUIDA: 'info',
  };
  const labels: Record<string, string> = {
    ATIVA: 'Ativa',
    CANCELADA: 'Cancelada',
    TRANCADA: 'Trancada',
    CONCLUIDA: 'Concluída',
  };
  return <Badge variant={map[status] || 'gray'}>{labels[status] || status}</Badge>;
};

export const getFrequenciaStatusBadge = (status: string) => {
  const map: Record<string, BadgeVariant> = {
    PRESENTE: 'success',
    AUSENTE: 'danger',
    FALTA_JUSTIFICADA: 'warning',
  };
  const labels: Record<string, string> = {
    PRESENTE: 'Presente',
    AUSENTE: 'Ausente',
    FALTA_JUSTIFICADA: 'Falta Justificada',
  };
  return <Badge variant={map[status] || 'gray'}>{labels[status] || status}</Badge>;
};

export const getNivelBadge = (nivel: string) => {
  const map: Record<string, BadgeVariant> = {
    INICIANTE: 'success',
    INTERMEDIARIO: 'warning',
    AVANCADO: 'danger',
  };
  const labels: Record<string, string> = {
    INICIANTE: 'Iniciante',
    INTERMEDIARIO: 'Intermediário',
    AVANCADO: 'Avançado',
  };
  return <Badge variant={map[nivel] || 'gray'}>{labels[nivel] || nivel}</Badge>;
};
