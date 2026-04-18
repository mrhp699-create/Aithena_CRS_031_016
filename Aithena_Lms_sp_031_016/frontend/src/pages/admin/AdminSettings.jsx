import React, { useState } from 'react';
import { CogIcon, ArrowDownOnSquareIcon, ShieldCheckIcon, CircleStackIcon } from '@heroicons/react/24/outline';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Aithena LMS',
    siteDescription: 'Modern AI-Powered Learning Management System',
    allowRegistration: true,
    requireEmailVerification: true,
    maxFileSize: 10,
    maintenanceMode: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle settings save
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">System Settings</h1>
          <p className="text-secondary-600">Configure platform settings and preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CogIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-secondary-900">General Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-secondary-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter site name"
              />
            </div>

            <div>
              <label htmlFor="maxFileSize" className="block text-sm font-medium text-secondary-700 mb-2">
                Max File Size (MB)
              </label>
              <input
                type="number"
                id="maxFileSize"
                name="maxFileSize"
                value={settings.maxFileSize}
                onChange={handleChange}
                className="input-field"
                min="1"
                max="100"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="siteDescription" className="block text-sm font-medium text-secondary-700 mb-2">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Enter site description"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-secondary-900">Security Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowRegistration"
                name="allowRegistration"
                checked={settings.allowRegistration}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="allowRegistration" className="ml-2 text-sm text-secondary-700">
                Allow new user registration
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireEmailVerification"
                name="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="requireEmailVerification" className="ml-2 text-sm text-secondary-700">
                Require email verification for new accounts
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 text-sm text-secondary-700">
                Enable maintenance mode
              </label>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CircleStackIcon className="h-6 w-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-secondary-900">Database Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-secondary-900 mb-2">Database Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-secondary-700">Connected to MongoDB</span>
              </div>
            </div>

            <div className="bg-secondary-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-secondary-900 mb-2">Last Backup</h4>
              <p className="text-sm text-secondary-700">December 27, 2025 at 8:00 AM</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary flex items-center"
          >
            <ArrowDownOnSquareIcon className="h-5 w-5 mr-2" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
