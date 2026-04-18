import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowDownOnSquareIcon, PhotoIcon } from '@heroicons/react/24/outline';

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: '',
    duration: '',
    maxStudents: '',
    prerequisites: '',
    learningObjectives: '',
    syllabus: ''
  });

  const [thumbnail, setThumbnail] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating course:', courseData);
    // Handle course creation logic here
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard/teacher"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 text-secondary-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Create New Course</h1>
          <p className="text-secondary-600">Set up your course details and curriculum</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Thumbnail */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Course Thumbnail</h3>
          <div className="flex items-center space-x-6">
            <div className="w-48 h-32 bg-secondary-100 rounded-lg flex items-center justify-center">
              {thumbnail ? (
                <img src={thumbnail} alt="Course thumbnail" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <PhotoIcon className="h-12 w-12 text-secondary-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail"
              />
              <label
                htmlFor="thumbnail"
                className="btn-outline cursor-pointer inline-block"
              >
                Choose Image
              </label>
              <p className="text-sm text-secondary-500 mt-2">
                Recommended: 1280x720px, max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter course title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
                Course Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Describe what students will learn in this course"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={courseData.category}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select category</option>
                <option value="web-development">Web Development</option>
                <option value="data-science">Data Science</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-secondary-700 mb-2">
                Difficulty Level *
              </label>
              <select
                id="level"
                name="level"
                value={courseData.level}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-secondary-700 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={courseData.duration}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 20"
                min="1"
              />
            </div>

            <div>
              <label htmlFor="maxStudents" className="block text-sm font-medium text-secondary-700 mb-2">
                Maximum Students
              </label>
              <input
                type="number"
                id="maxStudents"
                name="maxStudents"
                value={courseData.maxStudents}
                onChange={handleChange}
                className="input-field"
                placeholder="Leave empty for unlimited"
                min="1"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-secondary-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={courseData.price}
                onChange={handleChange}
                className="input-field"
                placeholder="0 for free"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Course Details</h3>

          <div className="space-y-6">
            <div>
              <label htmlFor="prerequisites" className="block text-sm font-medium text-secondary-700 mb-2">
                Prerequisites
              </label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={courseData.prerequisites}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="What should students know before taking this course?"
              />
            </div>

            <div>
              <label htmlFor="learningObjectives" className="block text-sm font-medium text-secondary-700 mb-2">
                Learning Objectives
              </label>
              <textarea
                id="learningObjectives"
                name="learningObjectives"
                value={courseData.learningObjectives}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="What will students be able to do after completing this course?"
              />
            </div>

            <div>
              <label htmlFor="syllabus" className="block text-sm font-medium text-secondary-700 mb-2">
                Course Syllabus
              </label>
              <textarea
                id="syllabus"
                name="syllabus"
                value={courseData.syllabus}
                onChange={handleChange}
                rows={6}
                className="input-field"
                placeholder="Outline the course structure and modules"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Link
            to="/dashboard/teacher"
            className="btn-outline"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn-primary flex items-center"
          >
            <ArrowDownOnSquareIcon className="h-5 w-5 mr-2" />
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
