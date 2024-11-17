'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Bell, 
  Mail, 
  Phone, 
  Calendar,
  Save,
  Database,
  FileDown
} from 'lucide-react';

interface NotificationSettings {
  emailPickupReminders: boolean;
  emailPaymentReminders: boolean;
  smsPickupReminders: boolean;
  smsPaymentReminders: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'monthly';
}

export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailPickupReminders: true,
    emailPaymentReminders: true,
    smsPickupReminders: false,
    smsPaymentReminders: false,
    reminderFrequency: 'daily',
  });

  const handleSaveSettings = () => {
    // TODO: Implement actual settings save
    toast.success('Settings saved successfully');
  };

  const handleExportData = () => {
    // TODO: Implement actual data export
    toast.success('Data exported successfully');
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-medium">Notification Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </h3>
              <div className="ml-6 space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailPickupReminders}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      emailPickupReminders: e.target.checked
                    }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Pickup Reminders</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailPaymentReminders}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      emailPaymentReminders: e.target.checked
                    }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Payment Reminders</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                SMS Notifications
              </h3>
              <div className="ml-6 space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsPickupReminders}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      smsPickupReminders: e.target.checked
                    }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Pickup Reminders</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsPaymentReminders}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      smsPaymentReminders: e.target.checked
                    }))}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Payment Reminders</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Reminder Frequency
              </h3>
              <div className="ml-6">
                <select
                  value={notificationSettings.reminderFrequency}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    reminderFrequency: e.target.value as NotificationSettings['reminderFrequency']
                  }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-medium">Data Management</h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FileDown className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
} 