import React from 'react';

const AdminStats = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">System Statistics</h1>
          <p className="text-secondary-600">Comprehensive analytics and system metrics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold text-secondary-900">1,247</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Active Courses</p>
              <p className="text-2xl font-bold text-secondary-900">89</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Total Enrollments</p>
              <p className="text-2xl font-bold text-secondary-900">2,156</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Completion Rate</p>
              <p className="text-2xl font-bold text-secondary-900">87%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">User Growth</h3>
          <div className="h-64 bg-secondary-100 rounded-lg flex items-center justify-center">
            <p className="text-secondary-500">Chart will be displayed here</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Course Performance</h3>
          <div className="h-64 bg-secondary-100 rounded-lg flex items-center justify-center">
            <p className="text-secondary-500">Chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-secondary-900 font-medium">New user registration</p>
              <p className="text-secondary-600 text-sm">Alice Johnson joined the platform</p>
            </div>
            <span className="text-secondary-500 text-sm">2 hours ago</span>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-secondary-900 font-medium">Course completed</p>
              <p className="text-secondary-600 text-sm">Bob Davis finished "Advanced React"</p>
            </div>
            <span className="text-secondary-500 text-sm">4 hours ago</span>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-secondary-900 font-medium">New course created</p>
              <p className="text-secondary-600 text-sm">Dr. Sarah Johnson added "Web Security"</p>
            </div>
            <span className="text-secondary-500 text-sm">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
