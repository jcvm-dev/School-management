import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/alunos': 'Alunos',
  '/professores': 'Professores',
  '/cursos': 'Cursos',
  '/turmas': 'Turmas',
  '/matriculas': 'Matrículas',
  '/notas': 'Notas',
  '/frequencias': 'Frequências',
};

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const title = routeTitles[location.pathname] || 'SGA';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
