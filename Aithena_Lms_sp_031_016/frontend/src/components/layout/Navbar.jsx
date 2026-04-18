import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpenIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpenIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gradient">Aithena LMS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-secondary-600">
                  Welcome, {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-secondary-700 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-secondary-700 hover:text-primary-600 p-2"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-secondary-50 border-t border-secondary-200">
            <Link
              to="/"
              className="block px-3 py-2 text-secondary-700 hover:text-primary-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <div className="px-3 py-2 space-y-2">
                <div className="text-secondary-600 text-sm">
                  Welcome, {user?.name?.split(' ')[0]}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full btn-secondary text-sm text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-secondary-700 hover:text-primary-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 btn-primary text-sm text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

