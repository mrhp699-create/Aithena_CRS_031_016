import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Configure axios defaults
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  axios.defaults.withCredentials = true;

  // Axios interceptor to handle token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const response = await axios.post('/auth/refresh');
          const { accessToken } = response.data;

          // Update authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          // Retry original request
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/auth/me');
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/login', { email, password });

      const { user, accessToken } = response.data;

      // Store token and set authorization header
      localStorage.setItem('accessToken', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setUser(user);
      setIsAuthenticated(true);

      console.log('Login successful - user set:', user);
      console.log('isAuthenticated set to true');
      toast.success(`Welcome back, ${user.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/register', userData);

      const { user, accessToken } = response.data;

      // Store token and set authorization header
      localStorage.setItem('accessToken', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      setUser(user);
      setIsAuthenticated(true);

      toast.success(`Welcome to Aithena LMS, ${user.name}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('accessToken');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await axios.put(`/users/${user._id}`, updates);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

