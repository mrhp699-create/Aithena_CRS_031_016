import React, { useState } from 'react';
import { DocumentTextIcon, ClockIcon, CheckCircleIcon, ExclamationCircleIcon, PaperClipIcon } from '@heroicons/react/24/outline';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'HTML/CSS Portfolio Project',
      course: 'Introduction to Web Development',
      description: 'Create a personal portfolio website using HTML and CSS',
      dueDate: '2025-01-30',
      status: 'pending',
      submitted: false,
      grade: null
    },
    {
      id: 2,
      title: 'React Component Design',
      course: 'Advanced React Development',
      description: 'Design and implement reusable React components',
      dueDate: '2025-01-25',
      status: 'submitted',
      submitted: true,
      submittedDate: '2025-01-24',
      grade: null
    },
    {
      id: 3,
      title: 'Database Schema Design',
      course: 'Web Development Fundamentals',
      description: 'Design a database schema for an e-commerce platform',
      dueDate: '2025-01-15',
      status: 'graded',
      submitted: true,
      submittedDate: '2025-01-14',
      grade: 92
    },
    {
      id: 4,
      title: 'JavaScript Algorithms',
      course: 'JavaScript Fundamentals',
      description: 'Implement common algorithms in JavaScript',
      dueDate: '2025-02-05',
      status: 'pending',
      submitted: false,
      grade: null
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ExclamationCircleIcon className="h-5 w-5 text-yellow-600" />;
      case 'submitted': return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case 'graded': return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'overdue': return <ExclamationCircleIcon className="h-5 w-5 text-red-600" />;
      default: return <DocumentTextIcon className="h-5 w-5 text-secondary-600" />;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.status === filter;
  });

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && !assignments.find(a => a.dueDate === dueDate)?.submitted;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Assignments</h1>
          <p className="text-secondary-600">Track your assignment progress and submissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Total Assignments</p>
              <p className="text-2xl font-bold text-secondary-900">{assignments.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-secondary-900">
                {assignments.filter(a => a.status === 'graded').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-secondary-900">
                {assignments.filter(a => a.status === 'pending').length}
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
              <p className="text-secondary-600 text-sm font-medium">Avg Grade</p>
              <p className="text-2xl font-bold text-secondary-900">
                {Math.round(assignments.filter(a => a.grade).reduce((sum, a) => sum + a.grade, 0) /
                  assignments.filter(a => a.grade).length || 0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card p-6">
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'all', label: 'All Assignments', count: assignments.length },
            { key: 'pending', label: 'Pending', count: assignments.filter(a => a.status === 'pending').length },
            { key: 'submitted', label: 'Submitted', count: assignments.filter(a => a.status === 'submitted').length },
            { key: 'graded', label: 'Graded', count: assignments.filter(a => a.status === 'graded').length }
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
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-secondary-900">{assignment.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                    {isOverdue(assignment.dueDate) && assignment.status === 'pending' && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                  </div>

                  <p className="text-secondary-600 mb-2">{assignment.course}</p>
                  <p className="text-secondary-500 text-sm mb-4">{assignment.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-secondary-500">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    {assignment.submitted && (
                      <div className="flex items-center space-x-1">
                        <PaperClipIcon className="h-4 w-4" />
                        <span>Submitted: {new Date(assignment.submittedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {assignment.grade && (
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-green-600">Grade: {assignment.grade}%</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {assignment.status === 'pending' && (
                    <button className="btn-primary text-sm px-4 py-2">
                      Submit Assignment
                    </button>
                  )}
                  {assignment.status === 'submitted' && (
                    <button className="btn-outline text-sm px-4 py-2">
                      View Submission
                    </button>
                  )}
                  {assignment.status === 'graded' && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{assignment.grade}%</div>
                      <div className="text-xs text-secondary-500">Grade</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="h-8 w-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No assignments found</h3>
            <p className="text-secondary-500">You don't have any assignments matching the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
