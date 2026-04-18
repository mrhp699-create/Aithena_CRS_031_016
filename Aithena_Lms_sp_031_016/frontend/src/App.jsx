import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout Components
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStats from './pages/admin/AdminStats';
import AdminSettings from './pages/admin/AdminSettings';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherCourses from './pages/teacher/TeacherCourses';
import CreateCourse from './pages/teacher/CreateCourse';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherQuizzes from './pages/teacher/TeacherQuizzes';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import BrowseCourses from './pages/student/BrowseCourses';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentQuizzes from './pages/student/StudentQuizzes';
import StudentProgress from './pages/student/StudentProgress';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-secondary-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <LandingLayout>
                <LandingPage />
              </LandingLayout>
            } />

            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />

            <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardRouter />} />

              {/* Admin Routes */}
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin/stats" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminStats />
                </ProtectedRoute>
              } />
              <Route path="admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              } />

              {/* Teacher Routes */}
              <Route path="teacher" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </ProtectedRoute>
              } />
              <Route path="teacher/courses" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherCourses />
                </ProtectedRoute>
              } />
              <Route path="teacher/courses/new" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <CreateCourse />
                </ProtectedRoute>
              } />
              <Route path="teacher/assignments" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherAssignments />
                </ProtectedRoute>
              } />
              <Route path="teacher/quizzes" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherQuizzes />
                </ProtectedRoute>
              } />

              {/* Student Routes */}
              <Route path="student" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="student/courses" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentCourses />
                </ProtectedRoute>
              } />
              <Route path="student/browse" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <BrowseCourses />
                </ProtectedRoute>
              } />
              <Route path="student/assignments" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentAssignments />
                </ProtectedRoute>
              } />
              <Route path="student/quizzes" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentQuizzes />
                </ProtectedRoute>
              } />
              <Route path="student/progress" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProgress />
                </ProtectedRoute>
              } />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Component to route to appropriate dashboard based on user role
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'teacher':
      return <Navigate to="/dashboard/teacher" replace />;
    case 'student':
      return <Navigate to="/dashboard/student" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default App;
