import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { PageLoader } from './components/ui/LoadingSpinner';
import LoginPage from './pages/auth/LoginPage';
import AlterarSenhaPage from './pages/auth/AlterarSenhaPage';
import Dashboard from './pages/Dashboard';
import AlunosPage from './pages/alunos/AlunosPage';
import ProfessoresPage from './pages/professores/ProfessoresPage';
import CursosPage from './pages/cursos/CursosPage';
import TurmasPage from './pages/turmas/TurmasPage';
import MatriculasPage from './pages/matriculas/MatriculasPage';
import NotasPage from './pages/notas/NotasPage';
import FrequenciasPage from './pages/frequencias/FrequenciasPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Força troca de senha antes de acessar qualquer rota
  if (user?.senhaTemporaria) {
    return <Navigate to="/alterar-senha" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/alterar-senha" element={<AlterarSenhaPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="alunos" element={<AlunosPage />} />
        <Route path="professores" element={<ProfessoresPage />} />
        <Route path="cursos" element={<CursosPage />} />
        <Route path="turmas" element={<TurmasPage />} />
        <Route path="matriculas" element={<MatriculasPage />} />
        <Route path="notas" element={<NotasPage />} />
        <Route path="frequencias" element={<FrequenciasPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
