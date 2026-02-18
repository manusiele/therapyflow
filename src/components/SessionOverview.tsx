'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { sessions as sessionsAPI } from '@/lib/supabase'

interface Session {
  id: string
  patient_id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  session_type: string
  patient?: {
    name: string
  }
}

export default function SessionOverview() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      if (!user?.id) return

      try {
        // Fetch sessions for the next 7 days instead of just today
        const startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + 7)
        endDate.setHours(23, 59, 59, 999)
        
        const { data, error } = await sessionsAPI.getAll({
          therapistId: user.id
        })

        if (error) {
          console.error('Error fetching sessions:', error)
          return
        }

        if (data) {
          // Filter for upcoming sessions and sort by date
          const upcoming = (data as any[])
            .filter(session => {
              const sessionDate = new Date(session.scheduled_at)
              return sessionDate >= startDate && sessionDate <= endDate
            })
            .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
            .slice(0, 5) // Show max 5 upcoming sessions
          
          setSessions(upcoming)
        }
      } catch (err) {
        console.error('Error loading sessions:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUpcomingSessions()
  }, [user])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getSessionType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Upcoming Sessions</h2>
        <span className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
        </span>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-600 dark:text-slate-400 mb-2">No upcoming sessions</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">Schedule a session to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">
                    {session.patient?.name ? session.patient.name.split(' ').map(n => n[0]).join('') : 'P'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {session.patient?.name || 'Patient'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getSessionType(session.session_type)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${
                    session.status === 'confirmed' ? 'bg-green-500' : 
                    session.status === 'pending' ? 'bg-yellow-500' :
                    session.status === 'completed' ? 'bg-blue-500' :
                    'bg-slate-400'
                  }`}></span>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">
                    {formatTime(session.scheduled_at)}
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {session.duration_minutes} min
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link 
          href="/dashboard/schedule" 
          className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          View Full Schedule
        </Link>
      </div>
    </div>
  )
}
