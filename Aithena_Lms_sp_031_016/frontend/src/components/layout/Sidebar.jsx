import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
        current: location.pathname === '/dashboard'
      }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          {
            name: 'User Management',
            href: '/dashboard/admin',
            icon: UserGroupIcon,
            current: location.pathname === '/dashboard/admin'
          },
          {
            name: 'System Statistics',
            href: '/dashboard/admin/stats',
            icon: ChartBarIcon,
            current: location.pathname === '/dashboard/admin/stats'
          },
          {
            name: 'Settings',
            href: '/dashboard/admin/settings',
            icon: CogIcon,
            current: location.pathname === '/dashboard/admin/settings'
          }
        ];

      case 'teacher':
        return [
          ...baseItems,
          {
            name: 'My Courses',
            href: '/dashboard/teacher/courses',
            icon: BookOpenIcon,
            current: location.pathname === '/dashboard/teacher/courses'
          },
          {
            name: 'Create Course',
            href: '/dashboard/teacher/courses/new',
            icon: DocumentTextIcon,
            current: location.pathname === '/dashboard/teacher/courses/new'
          },
          {
            name: 'Assignments',
            href: '/dashboard/teacher/assignments',
            icon: AcademicCapIcon,
            current: location.pathname === '/dashboard/teacher/assignments'
          },
          {
            name: 'Quizzes',
            href: '/dashboard/teacher/quizzes',
            icon: QuestionMarkCircleIcon,
            current: location.pathname === '/dashboard/teacher/quizzes'
          }
        ];

      case 'student':
        return [
          ...baseItems,
          {
            name: 'My Courses',
            href: '/dashboard/student/courses',
            icon: BookOpenIcon,
            current: location.pathname === '/dashboard/student/courses'
          },
          {
            name: 'Browse Courses',
            href: '/dashboard/student/browse',
            icon: AcademicCapIcon,
            current: location.pathname === '/dashboard/student/browse'
          },
          {
            name: 'Assignments',
            href: '/dashboard/student/assignments',
            icon: DocumentTextIcon,
            current: location.pathname === '/dashboard/student/assignments'
          },
          {
            name: 'Quizzes',
            href: '/dashboard/student/quizzes',
            icon: QuestionMarkCircleIcon,
            current: location.pathname === '/dashboard/student/quizzes'
          },
          {
            name: 'Progress',
            href: '/dashboard/student/progress',
            icon: ChartBarIcon,
            current: location.pathname === '/dashboard/student/progress'
          }
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg border-r border-secondary-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-secondary-200">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpenIcon className="h-8 w-8 text-primary-600" />
          <span className="text-lg font-bold text-gradient">Aithena LMS</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-secondary-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-secondary-600 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`sidebar-link ${item.current ? 'active' : ''}`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-secondary-200">
        <button
          onClick={handleLogout}
          className="w-full sidebar-link text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

