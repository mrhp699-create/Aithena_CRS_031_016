import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  MicrophoneIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  UserIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const LandingPage = () => {
  const [stats, setStats] = useState({
    students: 12500,
    teachers: 450,
    courses: 320,
    satisfaction: 98
  });

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        students: Math.min(prev.students + Math.floor(Math.random() * 5), 15000),
        teachers: Math.min(prev.teachers + Math.floor(Math.random() * 2), 500),
        courses: Math.min(prev.courses + Math.floor(Math.random() * 3), 400),
        satisfaction: Math.min(prev.satisfaction + (Math.random() > 0.7 ? 0.1 : 0), 99.9)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BookOpenIcon,
      title: 'Comprehensive Course Management',
      description: 'Create, organize, and deliver engaging courses with multimedia content, assignments, and assessments.'
    },
    {
      icon: MicrophoneIcon,
      title: 'Text-to-Speech Technology',
      description: 'Advanced TTS functionality converts lecture content to audio, making learning accessible for all students.'
    },
    {
      icon: AcademicCapIcon,
      title: 'Interactive Learning',
      description: 'Engage students with quizzes, assignments, and real-time progress tracking.'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Track student performance, course completion rates, and learning outcomes with detailed insights.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Computer Science Professor',
      content: 'Aithena LMS has transformed how I deliver my courses. The TTS feature is incredible for accessibility.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Design Instructor',
      content: 'The platform is intuitive and powerful. My students love the interactive quizzes and assignments.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Student',
      content: 'As someone with visual impairments, the text-to-speech feature has made learning so much easier.',
      rating: 5,
      avatar: 'ER'
    }
  ];

  const teamMembers = [
    {
      name: 'Moaz Saeed',
      id: 'SP23-BCS-031',
      icon: UserIcon
    },
    {
      name: 'Areeba Khan',
      id: 'SP23-BCS-016',
      icon: UserIcon
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-secondary-900 mb-6">
              Revolutionize
              <span className="text-gradient block">Education</span>
              with Aithena LMS
            </h1>
            <p className="text-xl md:text-2xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              The most advanced learning management system designed for modern education.
              Create engaging courses, track progress, and deliver exceptional learning experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center group"
              >
                Get Started Free
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="btn-outline text-lg px-8 py-4"
                >
                  Login as Student
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Login as Teacher
                </Link>
              </div>
            </div>

            {/* Demo Video Placeholder */}
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video bg-secondary-200 rounded-xl shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <div className="text-center">
                    <PlayIcon className="h-24 w-24 text-primary-600 mx-auto mb-4 opacity-50" />
                    <p className="text-secondary-600 text-lg">Platform Demo Video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                {stats.students.toLocaleString()}+
              </div>
              <div className="text-secondary-600 font-medium">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                {stats.teachers}+
              </div>
              <div className="text-secondary-600 font-medium">Expert Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                {stats.courses}+
              </div>
              <div className="text-secondary-600 font-medium">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                {stats.satisfaction.toFixed(1)}%
              </div>
              <div className="text-secondary-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and deliver exceptional learning experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-12 w-12 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Simple steps to transform your teaching and learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Create Your Course
              </h3>
              <p className="text-secondary-600">
                Teachers can easily create courses with lectures, assignments, and quizzes using our intuitive interface.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Engage Students
              </h3>
              <p className="text-secondary-600">
                Students enroll in courses and access content with features like text-to-speech and interactive assessments.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                Track Progress
              </h3>
              <p className="text-secondary-600">
                Monitor student performance with detailed analytics and provide personalized feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Join thousands of educators and learners who trust Aithena LMS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-secondary-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-secondary-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              The passionate developers behind Aithena LMS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="card p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <member.icon className="h-10 w-10 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-secondary-600 mb-6">
                    {member.id}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <EnvelopeIcon className="h-6 w-6 text-primary-600 hover:text-primary-700 cursor-pointer transition-colors" />
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600 hover:text-primary-700 cursor-pointer transition-colors" />
                    <div className="h-6 w-6 bg-primary-600 hover:bg-primary-700 rounded cursor-pointer transition-colors flex items-center justify-center">
                      <span className="text-white text-xs font-bold">in</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Education?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join Aithena LMS today and experience the future of learning management.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-secondary-50 transition-colors duration-200 group"
          >
            Start Your Free Trial
            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

