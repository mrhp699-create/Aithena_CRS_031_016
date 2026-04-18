import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, StarIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';

const BrowseCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' }
  ];

  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Sarah Johnson',
      rating: 4.8,
      reviews: 1250,
      duration: '40 hours',
      students: 8547,
      price: 89.99,
      level: 'Beginner',
      category: 'web-development',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'React & Redux Masterclass',
      instructor: 'Prof. Michael Chen',
      rating: 4.9,
      reviews: 892,
      duration: '25 hours',
      students: 6234,
      price: 79.99,
      level: 'Intermediate',
      category: 'web-development',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Python for Data Science',
      instructor: 'Dr. Lisa Wang',
      rating: 4.7,
      reviews: 756,
      duration: '35 hours',
      students: 4521,
      price: 94.99,
      level: 'Intermediate',
      category: 'data-science',
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Maria Gonzalez',
      rating: 4.6,
      reviews: 634,
      duration: '28 hours',
      students: 3892,
      price: 69.99,
      level: 'Beginner',
      category: 'design',
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Browse Courses</h1>
          <p className="text-secondary-600">Discover new courses to expand your knowledge</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-secondary-600">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="card p-0 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Course Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <svg className="h-16 w-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            {/* Course Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-secondary-600 text-sm mb-3">
                by {course.instructor}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(course.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-secondary-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-secondary-600">
                  {course.rating} ({course.reviews})
                </span>
              </div>

              {/* Course Details */}
              <div className="flex items-center justify-between text-sm text-secondary-600 mb-4">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UsersIcon className="h-4 w-4" />
                  <span>{course.students.toLocaleString()}</span>
                </div>
              </div>

              {/* Price and Level */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-secondary-900">
                    ${course.price}
                  </span>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  course.level === 'Beginner'
                    ? 'bg-green-100 text-green-800'
                    : course.level === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>

              {/* Enroll Button */}
              <button className="w-full btn-primary mt-4">
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SearchIcon className="h-8 w-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No courses found</h3>
          <p className="text-secondary-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
