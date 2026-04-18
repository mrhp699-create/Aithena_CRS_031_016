import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target.closest('form');
    const formDataObj = new FormData(form);
    const registerData = {
      name: formDataObj.get('name'),
      email: formDataObj.get('email'),
      password: formDataObj.get('password'),
      role: formDataObj.get('role') || 'student'
    };

    // Simple validation
    const newErrors = {};
    if (!registerData.name || registerData.name.trim().length < 2) {
      newErrors.name = 'Name is required and must be at least 2 characters';
    }
    if (!registerData.email || !/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!registerData.password || registerData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (registerData.password !== formDataObj.get('confirmPassword')) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await register(registerData);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-secondary-200';
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900">
            Create your account
          </h2>
          <p className="mt-2 text-secondary-600">
            Join Aithena LMS and start your learning journey
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                defaultValue=""
                className={`input-field ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue=""
                className={`input-field ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative cursor-pointer`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    defaultChecked
                    className="sr-only"
                  />
                  <div className={`p-4 border rounded-lg text-center transition-colors ${formData.role === 'student' ? 'border-primary-500 bg-primary-50' : 'border-secondary-300 hover:border-secondary-400'}`}>
                    <div className="text-2xl mb-2">🎓</div>
                    <div className="font-medium text-secondary-900">Student</div>
                    <div className="text-sm text-secondary-600">Learn & grow</div>
                  </div>
                </label>

                <label className={`relative cursor-pointer`}>
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    className="sr-only"
                  />
                  <div className={`p-4 border rounded-lg text-center transition-colors ${formData.role === 'teacher' ? 'border-primary-500 bg-primary-50' : 'border-secondary-300 hover:border-secondary-400'}`}>
                    <div className="text-2xl mb-2">👨‍🏫</div>
                    <div className="font-medium text-secondary-900">Teacher</div>
                    <div className="text-sm text-secondary-600">Share knowledge</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  defaultValue=""
                  className={`input-field pr-10 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-secondary-600">Password strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength(formData.password) >= 3 ? 'text-green-600' : passwordStrength(formData.password) >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {getPasswordStrengthText(passwordStrength(formData.password))}
                    </span>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength(formData.password))}`}
                      style={{ width: `${(passwordStrength(formData.password) / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  defaultValue=""
                  className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <span className="ml-2 text-sm text-secondary-700">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="button"
              className="w-full btn-primary"
              onClick={handleSubmit}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          {/* Links */}
          <div className="text-center">
            <span className="text-secondary-600">Already have an account? </span>
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

