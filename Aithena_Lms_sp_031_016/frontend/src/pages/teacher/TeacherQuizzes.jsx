import React, { useState } from 'react';
import { PlusIcon, PencilIcon, EyeIcon, QuestionMarkCircleIcon, TrophyIcon } from '@heroicons/react/24/outline';

const TeacherQuizzes = () => {
  const [quizzes, setQuizzes] = useState([
    {
      id: 1,
      title: 'HTML Fundamentals Quiz',
      course: 'Introduction to Web Development',
      questions: 15,
      attempts: 42,
      avgScore: 78,
      status: 'published',
      createdAt: '2025-01-20'
    },
    {
      id: 2,
      title: 'React Hooks Assessment',
      course: 'Advanced React Development',
      questions: 20,
      attempts: 28,
      avgScore: 82,
      status: 'published',
      createdAt: '2025-01-18'
    },
    {
      id: 3,
      title: 'CSS Layout Challenge',
      course: 'Web Design Principles',
      questions: 12,
      attempts: 0,
      avgScore: 0,
      status: 'draft',
      createdAt: '2025-01-15'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    return status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
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
          <p className="text-secondary-600">Create and manage course assessments</p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Quiz
        </button>
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
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Total Attempts</p>
              <p className="text-2xl font-bold text-secondary-900">
                {quizzes.reduce((sum, quiz) => sum + quiz.attempts, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrophyIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Avg Score</p>
              <p className="text-2xl font-bold text-secondary-900">
                {Math.round(quizzes.filter(q => q.attempts > 0).reduce((sum, quiz) => sum + quiz.avgScore, 0) /
                  quizzes.filter(q => q.attempts > 0).length || 0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-secondary-600 text-sm font-medium">Published</p>
              <p className="text-2xl font-bold text-secondary-900">
                {quizzes.filter(quiz => quiz.status === 'published').length}
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
            { key: 'published', label: 'Published', count: quizzes.filter(q => q.status === 'published').length },
            { key: 'draft', label: 'Drafts', count: quizzes.filter(q => q.status === 'draft').length }
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
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span>{quiz.attempts} attempts</span>
                    </div>
                    {quiz.attempts > 0 && (
                      <div className="flex items-center space-x-1">
                        <TrophyIcon className="h-4 w-4" />
                        <span className={getScoreColor(quiz.avgScore)}>
                          Avg: {quiz.avgScore}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors" title="View results">
                    <EyeIcon className="h-5 w-5 text-secondary-600" />
                  </button>
                  <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors" title="Edit quiz">
                    <PencilIcon className="h-5 w-5 text-secondary-600" />
                  </button>
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
            <p className="text-secondary-500">Create your first quiz to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherQuizzes;
