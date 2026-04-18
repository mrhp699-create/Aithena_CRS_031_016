import React, { useState } from 'react';
import { PlusIcon, PencilIcon, EyeIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'HTML/CSS Project',
      course: 'Introduction to Web Development',
      dueDate: '2025-01-30',
      status: 'active',
      submissions: 23,
      totalStudents: 45
    },
    {
      id: 2,
      title: 'React Component Design',
      course: 'Advanced React Development',
      dueDate: '2025-01-25',
      status: 'active',
      submissions: 18,
      totalStudents: 32
    },
    {
      id: 3,
      title: 'Database Schema Design',
      course: 'Web Development Fundamentals',
      dueDate: '2025-01-15',
      status: 'completed',
      submissions: 28,
      totalStudents: 35
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getSubmissionPercentage = (submissions, total) => {
    return Math.round((submissions / total) * 100);
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Assignments</h1>
          <p className="text-secondary-600">Create and manage course assignments</p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Assignment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card p-6">
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'all', label: 'All Assignments', count: assignments.length },
            { key: 'active', label: 'Active', count: assignments.filter(a => a.status === 'active').length },
            { key: 'completed', label: 'Completed', count: assignments.filter(a => a.status === 'completed').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-secondary-900">{assignment.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-secondary-600 mb-3">{assignment.course}</p>

                  <div className="flex items-center space-x-6 text-sm text-secondary-500">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>{assignment.submissions}/{assignment.totalStudents} submissions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Progress Bar */}
                  <div className="w-32">
                    <div className="flex justify-between text-xs text-secondary-500 mb-1">
                      <span>Progress</span>
                      <span>{getSubmissionPercentage(assignment.submissions, assignment.totalStudents)}%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getSubmissionPercentage(assignment.submissions, assignment.totalStudents)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors" title="View submissions">
                      <EyeIcon className="h-5 w-5 text-secondary-600" />
                    </button>
                    <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors" title="Edit assignment">
                      <PencilIcon className="h-5 w-5 text-secondary-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No assignments found</h3>
            <p className="text-secondary-500">Create your first assignment to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignments;
