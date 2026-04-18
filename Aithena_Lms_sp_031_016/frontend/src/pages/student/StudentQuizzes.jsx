import React, { useState } from 'react';
import { QuestionMarkCircleIcon, PlayIcon, EyeIcon, TrophyIcon, ClockIcon } from '@heroicons/react/24/outline';

const StudentQuizzes = () => {
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: 'HTML Fundamentals Quiz',
      course: 'Introduction to Web Development',
      questions: 15,
      duration: '30 min',
      dueDate: '2025-01-30',
      status: 'available',
      attempts: 0,
      maxAttempts: 3,
      bestScore: null
    },
    {
      id: 2,
      title: 'React Hooks Assessment',
      course: 'Advanced React Development',
      questions: 20,
      duration: '45 min',
      dueDate: '2025-01-25',
      status: 'completed',
      attempts: 2,
      maxAttempts: 3,
      bestScore: 85
    },
    {
      id: 3,
      title: 'CSS Layout Challenge',
      course: 'Web Design Principles',
      questions: 12,
      duration: '25 min',
      dueDate: '2025-02-05',
      status: 'available',
      attempts: 0,
      maxAttempts: 2,
      bestScore: null
    },
    {
      id: 4,
      title: 'JavaScript Fundamentals Test',
      course: 'JavaScript Fundamentals',
      questions: 25,
      duration: '60 min',
      dueDate: '2025-01-20',
      status: 'expired',
      attempts: 1,
      maxAttempts: 3,
      bestScore: 78
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <PlayIcon className="h-5 w-5 text-green-600" />;
      case 'completed': return <TrophyIcon className="h-5 w-5 text-blue-600" />;
      case 'expired': return <ClockIcon className="h-5 w-5 text-red-600" />;
      case 'in-progress': return <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-600" />;
      default: return <QuestionMarkCircleIcon className="h-5 w-5 text-secondary-600" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'all') return true;
    return quiz.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Quizzes</h1>
          <p className="text-secondary-600">Test your knowledge and track your progress</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Total Quizzes</p>
              <p className="text-2xl font-bold text-secondary-900">{quizzes.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrophyIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-secondary-900">
                {quizzes.filter(q => q.status === 'completed').length}
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
              <p className="text-secondary-600 text-sm font-medium">Avg Score</p>
              <p className="text-2xl font-bold text-secondary-900">
                {Math.round(quizzes.filter(q => q.bestScore).reduce((sum, q) => sum + q.bestScore, 0) /
                  quizzes.filter(q => q.bestScore).length || 0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <PlayIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Available Now</p>
              <p className="text-2xl font-bold text-secondary-900">
                {quizzes.filter(q => q.status === 'available').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card p-6">
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'all', label: 'All Quizzes', count: quizzes.length },
            { key: 'available', label: 'Available', count: quizzes.filter(q => q.status === 'available').length },
            { key: 'completed', label: 'Completed', count: quizzes.filter(q => q.status === 'completed').length },
            { key: 'expired', label: 'Expired', count: quizzes.filter(q => q.status === 'expired').length }
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

        {/* Quizzes List */}
        <div className="space-y-4">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-secondary-900">{quiz.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(quiz.status)}`}>
                      {quiz.status}
                    </span>
                  </div>

                  <p className="text-secondary-600 mb-3">{quiz.course}</p>

                  <div className="flex items-center space-x-6 text-sm text-secondary-500">
                    <div className="flex items-center space-x-1">
                      <QuestionMarkCircleIcon className="h-4 w-4" />
                      <span>{quiz.questions} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{quiz.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>
                    </div>
                    {quiz.attempts > 0 && (
                      <div className="flex items-center space-x-1">
                        <span>Attempts: {quiz.attempts}/{quiz.maxAttempts}</span>
                      </div>
                    )}
                    {quiz.bestScore && (
                      <div className="flex items-center space-x-1">
                        <TrophyIcon className="h-4 w-4" />
                        <span className={`font-medium ${getScoreColor(quiz.bestScore)}`}>
                          Best: {quiz.bestScore}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {quiz.status === 'available' && (
                    <button className="btn-primary flex items-center">
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Start Quiz
                    </button>
                  )}
                  {quiz.status === 'completed' && (
                    <button className="btn-outline flex items-center">
                      <EyeIcon className="h-5 w-5 mr-2" />
                      Review
                    </button>
                  )}
                  {quiz.status === 'expired' && (
                    <button className="btn-outline flex items-center opacity-50 cursor-not-allowed">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      Expired
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QuestionMarkCircleIcon className="h-8 w-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No quizzes found</h3>
            <p className="text-secondary-500">You don't have any quizzes matching the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQuizzes;
