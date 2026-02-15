'use client'

import { useState } from 'react'

interface NotificationSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  userRole: 'therapist' | 'patient'
}

export default function NotificationSettingsModal({ 
  isOpen, 
  onClose,
  userRole 
}: NotificationSettingsModalProps) {
  const [settings, setSettings] = useState({
    // Email notifications
    emailEnabled: true,
    emailSessionReminders: true,
    emailSessionConfirmations: true,
    emailSessionCancellations: true,
    emailNewMessages: true,
    emailWeeklySummary: userRole === 'therapist',
    
    // SMS notifications
    smsEnabled: false,
    smsSessionReminders: false,
    smsSessionStarting: false,
    smsUrgentOnly: true,
    
    // Timing
    reminderTiming: '24', // hours before session
    
    // Push notifications (PWA)
    pushEnabled: true,
    pushNewMessages: true,
    pushSessionReminders: true
  })

  const handleSave = () => {
    // In production, save to database
    console.log('Notification settings saved:', settings)
    onClose()
  }

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notification Settings</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage how you receive updates and reminders
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Email Notifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Email Notifications</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Receive updates via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailEnabled}
                  onChange={() => handleToggle('emailEnabled')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.emailEnabled && (
              <div className="space-y-3 pl-13">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Session reminders</span>
                  <input
                    type="checkbox"
                    checked={settings.emailSessionReminders}
                    onChange={() => handleToggle('emailSessionReminders')}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Session confirmations</span>
                  <input
                    type="checkbox"
                    checked={settings.emailSessionConfirmations}
                    onChange={() => handleToggle('emailSessionConfirmations')}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Session cancellations</span>
                  <input
                    type="checkbox"
                    checked={settings.emailSessionCancellations}
                    onChange={() => handleToggle('emailSessionCancellations')}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">New messages</span>
                  <input
                    type="checkbox"
                    checked={settings.emailNewMessages}
                    onChange={() => handleToggle('emailNewMessages')}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </label>
                {userRole === 'therapist' && (
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-300">Weekly summary</span>
                    <input
                      type="checkbox"
                      checked={settings.emailWeeklySummary}
                      onChange={() => handleToggle('emailWeeklySummary')}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* SMS Notifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">SMS Notifications</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Receive text messages</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsEnabled}
                  onChange={() => handleToggle('smsEnabled')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            {settings.smsEnabled && (
              <div className="space-y-3 pl-13">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Session reminders</span>
                  <input
                    type="checkbox"
                    checked={settings.smsSessionReminders}
                    onChange={() => handleToggle('smsSessionReminders')}
                    className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Session starting soon (15 min)</span>
                  <input
                    type="checkbox"
                    checked={settings.smsSessionStarting}
                    onChange={() => handleToggle('smsSessionStarting')}
                    className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Urgent notifications only</span>
                  <input
                    type="checkbox"
                    checked={settings.smsUrgentOnly}
                    onChange={() => handleToggle('smsUrgentOnly')}
                    className="w-4 h-4 text-green-600 border-slate-300 rounded focus:ring-green-500"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Push Notifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">Push Notifications</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Browser notifications</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushEnabled}
                  onChange={() => handleToggle('pushEnabled')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {settings.pushEnabled && (
              <div className="space-y-3 pl-13">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">New messages</span>
                  <input
                    type="checkbox"
                    checked={settings.pushNewMessages}
                    onChange={() => handleToggle('pushNewMessages')}
                    className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Session reminders</span>
                  <input
                    type="checkbox"
                    checked={settings.pushSessionReminders}
                    onChange={() => handleToggle('pushSessionReminders')}
                    className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Reminder Timing */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Reminder Timing</h3>
            <label className="block">
              <span className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
                Send session reminders
              </span>
              <select
                value={settings.reminderTiming}
                onChange={(e) => setSettings(prev => ({ ...prev, reminderTiming: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="1">1 hour before</option>
                <option value="2">2 hours before</option>
                <option value="4">4 hours before</option>
                <option value="24">24 hours before</option>
                <option value="48">48 hours before</option>
              </select>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
