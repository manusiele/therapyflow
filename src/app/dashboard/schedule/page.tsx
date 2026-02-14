'use client'

import { useState } from 'react'
import Link from 'next/link'
import AddSessionModal, { SessionFormData } from '@/components/AddSessionModal'
import ThemeToggle from '@/components/ThemeToggle'

interface Session {
  id: string
  patient: string
  type: string
  time: string
  duration: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  notes?: string
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'day' | 'week'>('day')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data - would come from Redux/Supabase in production
  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', patient: 'John Doe', type: 'Individual Therapy', time: '09:00 AM', duration: '50 min', status: 'confirmed' },
    { id: '2', patient: 'Jane Smith', type: 'Couples Therapy', time: '10:30 AM', duration: '60 min', status: 'confirmed' },
    { id: '3', patient: 'Michael Brown', type: 'Initial Consultation', time: '02:00 PM', duration: '90 min', status: 'pending' },
    { id: '4', patient: 'Emily Davis', type: 'Individual Therapy', time: '03:30 PM', duration: '50 min', status: 'confirmed' },
    { id: '5', patient: 'Robert Wilson', type: 'Group Therapy', time: '05:00 PM', duration: '60 min', status: 'confirmed' },
  ])

  const handleAddSession = (sessionData: SessionFormData) => {
    // In production, this would dispatch to Redux and save to Supabase
    const newSession: Session = {
      id: String(sessions.length + 1),
      patient: 'New Patient', // Would lookup from patient_id
      type: sessionData.session_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      time: new Date(sessionData.scheduled_at).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      duration: `${sessionData.duration_minutes} min`,
      status: 'pending',
      notes: sessionData.notes
    }
    
    setSessions([...sessions, newSession])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Full Schedule</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{formatDate(selectedDate)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-secondary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Session
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Date Navigation */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() - 1)
                setSelectedDate(newDate)
              }}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              Today
            </button>
            
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() + 1)
                setSelectedDate(newDate)
              }}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Schedule */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Sessions ({sessions.length})
              </h2>
              
              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-600 dark:text-slate-400">No sessions scheduled for this day</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary mt-4"
                  >
                    Schedule Session
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">
                              {session.patient.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{session.patient}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(session.status)}`}>
                                {session.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{session.type}</p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {session.time}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {session.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-colors">
                            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mini Calendar */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Calendar</h3>
              <div className="text-center">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-slate-500 dark:text-slate-500 font-medium py-2">{day}</div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => (
                    <button
                      key={i}
                      className={`py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        i === 15 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Today's Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Total Sessions</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{sessions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Confirmed</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {sessions.filter(s => s.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Pending</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {sessions.filter(s => s.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Total Hours</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">4.5 hrs</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full btn-primary text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Session
                </button>
                <button className="w-full btn-secondary text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Block Time
                </button>
                <button className="w-full btn-secondary text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Session Modal */}
      <AddSessionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddSession}
      />
    </div>
  )
}
