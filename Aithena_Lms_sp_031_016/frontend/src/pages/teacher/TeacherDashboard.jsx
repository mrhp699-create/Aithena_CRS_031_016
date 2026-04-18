import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  PlusIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    totalQuizzes: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalCourses: 5,
        totalStudents: 156,
        totalAssignments: 23,
        totalQuizzes: 18
      });

      setRecentCourses([
        {
          id: 1,
          title: 'Introduction to Web Development',
          students: 45,
          progress: 78,
          lastUpdated: '2024-01-15'
        },
        {
          id: 2,
          title: 'Advanced React Development',
          students: 32,
          progress: 65,
          lastUpdated: '2024-01-14'
        },
        {
          id: 3,
          title: 'UI/UX Design Principles',
          students: 28,
          progress: 82,
          lastUpdated: '2024-01-13'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-secondary-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-2xl font-bold text-secondary-900">Teacher Dashboard</h1>
          <p className="text-secondary-600">Manage your courses and students</p>
        </div>
        <Link to="/dashboard/teacher/courses/new" className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Course
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Courses"
          value={stats.totalCourses}
          icon={BookOpenIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={UserGroupIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Assignments"
          value={stats.totalAssignments}
          icon={AcademicCapIcon}
          color="bg-purple-500"
        />
        <StatCard
          title="Quizzes"
          value={stats.totalQuizzes}
          icon={ChartBarIcon}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Courses */}
      <div className="card">
        <div className="px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">My Courses</h3>
            <Link
              to="/dashboard/teacher/courses"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all courses →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map((course) => (
              <div key={course.id} className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-secondary-900 mb-1">{course.title}</h4>
                    <p className="text-sm text-secondary-600">{course.students} students</p>
                  </div>
                  <BookOpenIcon className="h-8 w-8 text-primary-600 opacity-50" />
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-secondary-600">Progress</span>
                    <span className="font-medium text-secondary-900">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-secondary-500 mb-3">
                  <span>Last updated</span>
                  <span>{new Date(course.lastUpdated).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/dashboard/teacher/courses/${course.id}`}
                    className="flex-1 btn-secondary text-center text-sm"
                  >
                    Manage
                  </Link>
                  <Link
                    to={`/dashboard/teacher/courses/${course.id}/analytics`}
                    className="flex-1 btn-outline text-center text-sm"
                  >
                    Analytics
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/dashboard/teacher/courses/new"
          className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
              <PlusIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Create New Course</h3>
              <p className="text-secondary-600 text-sm">Start building your next course</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/teacher/assignments"
          className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
              <AcademicCapIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Manage Assignments</h3>
              <p className="text-secondary-600 text-sm">Create and grade assignments</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/teacher/quizzes"
          className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Create Quizzes</h3>
              <p className="text-secondary-600 text-sm">Build interactive assessments</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TeacherDashboard;

