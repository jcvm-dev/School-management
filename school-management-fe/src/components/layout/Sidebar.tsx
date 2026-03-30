import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  School,
  ClipboardList,
  FileText,
  Calendar,
  X,
  BookMarked,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    to: '/alunos',
    label: 'Alunos',
    icon: <Users className="w-5 h-5" />,
  },
  {
    to: '/professores',
    label: 'Professores',
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    to: '/cursos',
    label: 'Cursos',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    to: '/turmas',
    label: 'Turmas',
    icon: <School className="w-5 h-5" />,
  },
  {
    to: '/matriculas',
    label: 'Matrículas',
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    to: '/notas',
    label: 'Notas',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    to: '/frequencias',
    label: 'Frequências',
    icon: <Calendar className="w-5 h-5" />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-indigo-900 text-white z-30
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 rounded-lg p-1.5">
              <BookMarked className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">SGA</p>
              <p className="text-indigo-300 text-xs leading-tight">Gest. de Alunos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-indigo-300 hover:text-white hover:bg-indigo-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-indigo-800">
          <p className="text-xs text-indigo-400">© 2024 SGA v1.0</p>
        </div>
      </aside>
    </>
  );
};
