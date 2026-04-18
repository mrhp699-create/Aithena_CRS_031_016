import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserPlusIcon,
  CogIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    averageCoursesPerStudent: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalStudents: 1089,
        totalTeachers: 156,
        totalAdmins: 2,
        totalCourses: 89,
        totalEnrollments: 2156,
        averageCoursesPerStudent: 1.8
      });

      setRecentUsers([
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice.johnson@email.com',
          role: 'student',
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Dr. Michael Chen',
          email: 'michael.chen@university.edu',
          role: 'teacher',
          status: 'active',
          createdAt: '2024-01-14'
        },
        {
          id: 3,
          name: 'Sarah Wilson',
          email: 'sarah.wilson@email.com',
          role: 'student',
          status: 'active',
          createdAt: '2024-01-13'
        },
        {
          id: 4,
          name: 'Prof. David Brown',
          email: 'david.brown@university.edu',
          role: 'teacher',
          status: 'inactive',
          createdAt: '2024-01-12'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-secondary-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-secondary-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  const quickActions = [
    {
      title: 'Add New User',
      description: 'Create teacher or student accounts',
      icon: UserPlusIcon,
      action: () => console.log('Add user'),
      color: 'bg-blue-500'
    },
    {
      title: 'View All Users',
      description: 'Manage user accounts and permissions',
      icon: UserGroupIcon,
      action: () => console.log('View users'),
      color: 'bg-green-500'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: CogIcon,
      action: () => console.log('Settings'),
      color: 'bg-purple-500'
    },
    {
      title: 'View Reports',
      description: 'Generate system analytics reports',
      icon: ChartBarIcon,
      action: () => console.log('Reports'),
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
          <p className="text-secondary-600">Manage your learning management system</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UserGroupIcon}
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          title="Active Courses"
          value={stats.totalCourses}
          icon={BookOpenIcon}
          color="bg-green-500"
          trend={8}
        />
        <StatCard
          title="Enrollments"
          value={stats.totalEnrollments}
          icon={AcademicCapIcon}
          color="bg-purple-500"
          trend={15}
        />
        <StatCard
          title="Avg Courses/Student"
          value={stats.averageCoursesPerStudent}
          icon={ChartBarIcon}
          color="bg-orange-500"
          trend={5}
        />
      </div>

      {/* User Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">User Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-secondary-700">Students</span>
              </div>
              <span className="font-semibold text-secondary-900">{stats.totalStudents}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-secondary-700">Teachers</span>
              </div>
              <span className="font-semibold text-secondary-900">{stats.totalTeachers}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-secondary-700">Admins</span>
              </div>
              <span className="font-semibold text-secondary-900">{stats.totalAdmins}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="card p-4 hover:shadow-lg transition-shadow duration-200 text-left group"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">{action.title}</h4>
                    <p className="text-sm text-secondary-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card">
        <div className="px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Users</h3>
            <Link
              to="/admin/users"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all users →
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">{user.name}</div>
                      <div className="text-sm text-secondary-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-secondary-600 hover:text-secondary-900">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

