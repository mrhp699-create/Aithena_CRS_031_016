import React, { useState } from 'react';
import { ChartBarIcon, TrophyIcon, ClockIcon, CheckCircleIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const StudentProgress = () => {
  const [timeRange, setTimeRange] = useState('month');

  const stats = {
    totalCourses: 5,
    completedCourses: 2,
    totalHours: 127,
    avgScore: 84,
    streakDays: 12,
    certificates: 3
  };

  const recentActivity = [
    {
      id: 1,
      type: 'course_completed',
      title: 'Completed "Advanced React Development"',
      date: '2025-01-25',
      score: 92
    },
    {
      id: 2,
      type: 'quiz_passed',
      title: 'Passed "JavaScript Fundamentals" quiz',
      date: '2025-01-24',
      score: 88
    },
    {
      id: 3,
      type: 'lesson_completed',
      title: 'Completed 3 lessons in "Web Design Principles"',
      date: '2025-01-23',
      score: null
    },
    {
      id: 4,
      type: 'certificate_earned',
      title: 'Earned certificate for "HTML & CSS Basics"',
      date: '2025-01-20',
      score: null
    }
  ];

  const courseProgress = [
    {
      id: 1,
      title: 'Introduction to Web Development',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      lastAccessed: '2025-01-27'
    },
    {
      id: 2,
      title: 'Advanced React Development',
      progress: 100,
      totalLessons: 32,
      completedLessons: 32,
      lastAccessed: '2025-01-25'
    },
    {
      id: 3,
      title: 'JavaScript Fundamentals',
      progress: 60,
      totalLessons: 20,
      completedLessons: 12,
      lastAccessed: '2025-01-26'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'course_completed': return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'quiz_passed': return <TrophyIcon className="h-5 w-5 text-yellow-600" />;
      case 'lesson_completed': return <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />;
      case 'certificate_earned': return <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      default: return <ClockIcon className="h-5 w-5 text-secondary-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Learning Progress</h1>
          <p className="text-secondary-600">Track your educational journey and achievements</p>
        </div>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Courses Enrolled</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Courses Completed</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.completedCourses}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ClockIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Learning Hours</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalHours}h</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Avg Quiz Score</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.avgScore}%</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Learning Streak</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.streakDays} days</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Certificates</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.certificates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Course Progress</h3>

        <div className="space-y-6">
          {courseProgress.map((course) => (
            <div key={course.id} className="border border-secondary-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-medium text-secondary-900">{course.title}</h4>
                <span className="text-sm text-secondary-500">
                  {course.progress}% Complete
                </span>
              </div>

              <div className="w-full bg-secondary-200 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    course.progress === 100 ? 'bg-green-500' : 'bg-primary-600'
                  }`}
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-sm text-secondary-600">
                <span>{course.completedLessons} of {course.totalLessons} lessons completed</span>
                <span>Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Recent Activity</h3>

        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-secondary-50 rounded-lg">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-secondary-900 font-medium">{activity.title}</p>
                <p className="text-secondary-500 text-sm">{new Date(activity.date).toLocaleDateString()}</p>
                {activity.score && (
                  <p className="text-sm font-medium text-green-600 mt-1">Score: {activity.score}%</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Goals */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Learning Goals</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="h-8 w-8 text-primary-600" />
            </div>
            <h4 className="font-semibold text-secondary-900 mb-2">Complete 3 Courses</h4>
            <p className="text-secondary-600 text-sm mb-3">2 of 3 completed</p>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full w-2/3"></div>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyIcon className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-secondary-900 mb-2">Maintain 85% Avg</h4>
            <p className="text-secondary-600 text-sm mb-3">Current: 84%</p>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-secondary-900 mb-2">Study 150 Hours</h4>
            <p className="text-secondary-600 text-sm mb-3">127 of 150 hours</p>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
