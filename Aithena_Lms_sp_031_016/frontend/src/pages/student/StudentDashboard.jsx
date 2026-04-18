import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    completedCourses: 0,
    inProgressCourses: 0,
    totalAssignments: 0,
    averageGrade: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setStats({
        completedCourses: 2,
        inProgressCourses: 3,
        totalAssignments: 15,
        averageGrade: 87
      });

      setEnrolledCourses([
        {
          id: 1,
          title: 'Introduction to Web Development',
          teacher: 'Dr. Sarah Johnson',
          progress: 75,
          nextLecture: 'CSS Flexbox and Grid',
          assignments: 3,
          completedAssignments: 2,
          thumbnail: '/course1.jpg'
        },
        {
          id: 2,
          title: 'Advanced React Development',
          teacher: 'Prof. Michael Chen',
          progress: 45,
          nextLecture: 'State Management with Redux',
          assignments: 2,
          completedAssignments: 1,
          thumbnail: '/course2.jpg'
        },
        {
          id: 3,
          title: 'UI/UX Design Principles',
          teacher: 'Dr. Sarah Johnson',
          progress: 90,
          nextLecture: 'Final Project Review',
          assignments: 4,
          completedAssignments: 4,
          thumbnail: '/course3.jpg'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-secondary-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
          {subtitle && <p className="text-secondary-600 text-sm">{subtitle}</p>}
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
          <h1 className="text-2xl font-bold text-secondary-900">My Learning Dashboard</h1>
          <p className="text-secondary-600">Continue your learning journey</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Completed Courses"
          value={stats.completedCourses}
          icon={CheckCircleIcon}
          color="bg-green-500"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressCourses}
          icon={BookOpenIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Assignments"
          value={stats.totalAssignments}
          icon={AcademicCapIcon}
          color="bg-purple-500"
          subtitle="Total submitted"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon={ChartBarIcon}
          color="bg-orange-500"
        />
      </div>

      {/* My Courses */}
      <div className="card">
        <div className="px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">My Courses</h3>
            <Link
              to="/dashboard/student/browse"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Browse more courses →
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border border-secondary-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Course Thumbnail */}
                <div className="h-32 bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center">
                  <BookOpenIcon className="h-12 w-12 text-primary-600 opacity-50" />
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-secondary-900 mb-1">{course.title}</h4>
                  <p className="text-sm text-secondary-600 mb-3">by {course.teacher}</p>

                  {/* Progress */}
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

                  {/* Next Lecture */}
                  <div className="flex items-center text-sm text-secondary-600 mb-3">
                    <PlayIcon className="h-4 w-4 mr-2" />
                    <span>Next: {course.nextLecture}</span>
                  </div>

                  {/* Assignments */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-secondary-600">
                      Assignments: {course.completedAssignments}/{course.assignments}
                    </span>
                    {course.completedAssignments === course.assignments && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/dashboard/student/courses/${course.id}`}
                      className="flex-1 btn-primary text-center text-sm"
                    >
                      Continue Learning
                    </Link>
                    <Link
                      to={`/dashboard/student/courses/${course.id}/assignments`}
                      className="flex-1 btn-outline text-center text-sm"
                    >
                      Assignments
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/dashboard/student/browse"
          className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Browse Courses</h3>
              <p className="text-secondary-600 text-sm">Discover new learning opportunities</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/student/assignments"
          className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-200">
              <BookOpenIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">My Assignments</h3>
              <p className="text-secondary-600 text-sm">View and submit assignments</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/student/progress"
          className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-200">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">Learning Progress</h3>
              <p className="text-secondary-600 text-sm">Track your achievements</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;

