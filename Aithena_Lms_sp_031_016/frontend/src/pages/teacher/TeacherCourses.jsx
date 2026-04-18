import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development',
      students: 45,
      status: 'published',
      createdAt: '2025-01-15'
    },
    {
      id: 2,
      title: 'Advanced React Development',
      description: 'Master advanced React concepts and patterns',
      students: 32,
      status: 'published',
      createdAt: '2025-01-10'
    },
    {
      id: 3,
      title: 'Web Security Fundamentals',
      description: 'Essential web security concepts and practices',
      students: 0,
      status: 'draft',
      createdAt: '2025-01-05'
    }
  ]);

  const getStatusColor = (status) => {
    return status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">My Courses</h1>
          <p className="text-secondary-600">Manage your course catalog</p>
        </div>
        <Link
          to="/dashboard/teacher/courses/new"
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Total Courses</p>
              <p className="text-2xl font-bold text-secondary-900">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Total Students</p>
              <p className="text-2xl font-bold text-secondary-900">
                {courses.reduce((sum, course) => sum + course.students, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Published Courses</p>
              <p className="text-2xl font-bold text-secondary-900">
                {courses.filter(course => course.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900">Course Catalog</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">{course.title}</div>
                      <div className="text-sm text-secondary-500">{course.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {course.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
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

export default TeacherCourses;
