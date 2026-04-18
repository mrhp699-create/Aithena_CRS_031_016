import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BellIcon, UserIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome Message */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-secondary-600">
            {user?.role === 'admin' && 'Manage your learning platform'}
            {user?.role === 'teacher' && 'Create and manage your courses'}
            {user?.role === 'student' && 'Continue your learning journey'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors duration-200 relative">
            <BellIcon className="h-6 w-6" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">3</span>
            </span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-secondary-900">
                {user?.name}
              </p>
              <p className="text-xs text-secondary-600 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

