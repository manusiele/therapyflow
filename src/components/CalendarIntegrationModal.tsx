'use client'

import { useState } from 'react'

interface CalendarIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CalendarIntegrationModal({ isOpen, onClose }: CalendarIntegrationModalProps) {
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([])
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [autoSync, setAutoSync] = useState(true)

  const handleConnectGoogle = () => {
    // In production, this would initiate OAuth flow
    alert('Google Calendar integration would open OAuth flow here')
    setConnectedCalendars([...connectedCalendars, 'Google Calendar'])
  }

  const handleConnectOutlook = () => {
    // In production, this would initiate OAuth flow
    alert('Outlook Calendar integration would open OAuth flow here')
    setConnectedCalendars([...connectedCalendars, 'Outlook Calendar'])
  }

  const handleConnectApple = () => {
    // In production, this would initiate OAuth flow
    alert('Apple Calendar integration would open OAuth flow here')
    setConnectedCalendars([...connectedCalendars, 'Apple Calendar'])
  }

  const handleDisconnect = (calendar: string) => {
    setConnectedCalendars(connectedCalendars.filter(c => c !== calendar))
  }

  const handleExportICS = () => {
    // In production, this would generate and download an ICS file
    alert('ICS file would be downloaded here')
  }

  const handleSyncNow = () => {
    alert('Syncing calendar events...')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Calendar Integration</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Sync your sessions with external calendars
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
          {/* Sync Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Sync Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">Enable Calendar Sync</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Automatically sync sessions to connected calendars
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncEnabled}
                    onChange={(e) => setSyncEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">Auto-Sync</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Sync changes automatically every 15 minutes
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <button
                onClick={handleSyncNow}
                className="w-full btn-secondary py-2 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Sync Now</span>
              </button>
            </div>
          </div>

          {/* Connected Calendars */}
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Connected Calendars</h3>
            
            {connectedCalendars.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                No calendars connected yet
              </p>
            ) : (
              <div className="space-y-2 mb-4">
                {connectedCalendars.map((calendar) => (
                  <div
                    key={calendar}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{calendar}</span>
                    </div>
                    <button
                      onClick={() => handleDisconnect(calendar)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                    >
                      Disconnect
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={handleConnectGoogle}
                disabled={connectedCalendars.includes('Google Calendar')}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-slate-900 dark:text-slate-100">Connect Google Calendar</span>
              </button>

              <button
                onClick={handleConnectOutlook}
                disabled={connectedCalendars.includes('Outlook Calendar')}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#0078D4" d="M24 7.387v9.226a4.39 4.39 0 01-4.387 4.387h-2.613v-7.613h2.613v-1.742h-2.613V9.903h2.613V8.161h-2.613V.548h2.613A4.39 4.39 0 0124 4.935v2.452zM13.935 0v24L0 20.903V3.097L13.935 0z"/>
                </svg>
                <span className="font-medium text-slate-900 dark:text-slate-100">Connect Outlook Calendar</span>
              </button>

              <button
                onClick={handleConnectApple}
                disabled={connectedCalendars.includes('Apple Calendar')}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="font-medium text-slate-900 dark:text-slate-100">Connect Apple Calendar</span>
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Export Options</h3>
            
            <button
              onClick={handleExportICS}
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium text-slate-900 dark:text-slate-100">Export as ICS File</span>
            </button>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Download your schedule as an ICS file to import into any calendar application
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
