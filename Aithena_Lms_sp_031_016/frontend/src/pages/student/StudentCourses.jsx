import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, PlayIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const StudentCourses = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Introduction to Web Development',
      instructor: 'Dr. Sarah Johnson',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      status: 'in-progress',
      lastAccessed: '2025-01-27',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Advanced React Development',
      instructor: 'Prof. Michael Chen',
      progress: 100,
      totalLessons: 32,
      completedLessons: 32,
      status: 'completed',
      lastAccessed: '2025-01-25',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'JavaScript Fundamentals',
      instructor: 'Dr. Emily Rodriguez',
      progress: 30,
      totalLessons: 20,
      completedLessons: 6,
      status: 'in-progress',
      lastAccessed: '2025-01-26',
      thumbnail: '/api/placeholder/300/200'
    }
  ]);

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? (
      <CheckCircleIcon className="h-5 w-5 text-green-600" />
    ) : (
      <ClockIcon className="h-5 w-5 text-blue-600" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">My Courses</h1>
          <p className="text-secondary-600">Continue learning and track your progress</p>
        </div>
        <Link
          to="/dashboard/student/browse"
          className="btn-primary flex items-center"
        >
          <BookOpenIcon className="h-5 w-5 mr-2" />
          Browse Courses
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
              <p className="text-secondary-600 text-sm font-medium">Enrolled Courses</p>
              <p className="text-2xl font-bold text-secondary-900">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Completed Courses</p>
              <p className="text-2xl font-bold text-secondary-900">
                {courses.filter(course => course.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Average Progress</p>
              <p className="text-2xl font-bold text-secondary-900">
                {Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card p-0 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Course Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <BookOpenIcon className="h-16 w-16 text-primary-600" />
            </div>

            {/* Course Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-secondary-600 text-sm mb-4">
                by {course.instructor}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-secondary-600 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(course.progress)}`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {getStatusIcon(course.status)}
                  <span className={`text-sm font-medium capitalize ${
                    course.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {course.status.replace('-', ' ')}
                  </span>
                </div>

                <button className="btn-primary text-sm px-4 py-2 flex items-center">
                  <PlayIcon className="h-4 w-4 mr-1" />
                  {course.status === 'completed' ? 'Review' : 'Continue'}
                </button>
              </div>

              <p className="text-xs text-secondary-500 mt-3">
                Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpenIcon className="h-8 w-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No courses yet</h3>
          <p className="text-secondary-500 mb-6">Start your learning journey by enrolling in a course.</p>
          <Link to="/dashboard/student/browse" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
