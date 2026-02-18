'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AddSessionModal, { SessionFormData } from '@/components/AddSessionModal'
import ProfileModal, { ProfileData } from '@/components/ProfileModal'
import SessionNotes from '@/components/SessionNotes'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'

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
  const { theme } = useTheme()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'day' | 'week'>('day')
  const [viewCategory, setViewCategory] = useState<'therapist' | 'client'>('therapist')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [isBlockTimeModalOpen, setIsBlockTimeModalOpen] = useState(false)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [showAllAppointments, setShowAllAppointments] = useState(false)
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showSessionDetails, setShowSessionDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [showSessionNotes, setShowSessionNotes] = useState(false)
  const [sessionForNotes, setSessionForNotes] = useState<Session | null>(null)
  const [currentTime] = useState(new Date())
  
  // Profile data based on view category
  const [therapistProfile, setTherapistProfile] = useState<ProfileData>({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@therapyflow.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Clinical Psychology, Cognitive Behavioral Therapy',
    licenseNumber: 'PSY-12345-CA',
    bio: 'Experienced clinical psychologist specializing in CBT and trauma-informed care. Over 10 years of experience helping clients overcome anxiety, depression, and PTSD.',
    role: 'therapist' as const
  })
  
  const [clientProfile, setClientProfile] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 987-6543',
    role: 'client' as const
  })
  
  const currentProfile = viewCategory === 'therapist' ? therapistProfile : clientProfile

  // Get current time formatted
  const getCurrentTimeFormatted = () => {
    return currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const getEndTimeFormatted = (durationMin: number) => {
    const endTime = new Date(currentTime.getTime() + durationMin * 60000)
    return endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  // Mock data - Therapist sessions (therapist's schedule)
  const [therapistSessions, setTherapistSessions] = useState<Session[]>([
    { id: '1', patient: 'John Doe', type: 'Individual Therapy', time: getCurrentTimeFormatted(), duration: '50 min', status: 'confirmed' },
    { id: '2', patient: 'Jane Smith', type: 'Couples Therapy', time: '10:30 AM', duration: '60 min', status: 'confirmed' },
    { id: '3', patient: 'Michael Brown', type: 'Initial Consultation', time: '02:00 PM', duration: '90 min', status: 'pending' },
    { id: '4', patient: 'Emily Davis', type: 'Individual Therapy', time: '03:30 PM', duration: '50 min', status: 'confirmed' },
    { id: '5', patient: 'Robert Wilson', type: 'Group Therapy', time: '05:00 PM', duration: '60 min', status: 'confirmed' },
  ])

  // Mock data - Client sessions (from client's perspective - their own appointments)
  const [clientSessions, setClientSessions] = useState<Session[]>([
    { id: 'c1', patient: 'Dr. Sarah Johnson', type: 'Individual Therapy', time: '10:00 AM', duration: '50 min', status: 'confirmed', notes: 'Weekly therapy session' },
    { id: 'c2', patient: 'Dr. Sarah Johnson', type: 'Follow-up', time: '03:00 PM', duration: '30 min', status: 'pending', notes: 'Check-in session' },
  ])

  // Get sessions based on view category
  const sessions = viewCategory === 'therapist' ? therapistSessions : clientSessions
  const setSessions = viewCategory === 'therapist' ? setTherapistSessions : setClientSessions

  // Generate week days starting from selected date
  const getWeekDays = () => {
    const days = []
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay()) // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const weekDays = getWeekDays()

  // Mock sessions for different days in week view
  const getSessionsForDay = (date: Date) => {
    const dayOfWeek = date.getDay()
    // Return different sessions based on day (mock data)
    if (dayOfWeek === selectedDate.getDay()) {
      return sessions
    } else if (dayOfWeek === 1) { // Monday
      return [
        { id: 'w1', patient: 'Alice Cooper', type: 'Individual Therapy', time: '10:00 AM', duration: '50 min', status: 'confirmed' as const },
        { id: 'w2', patient: 'Bob Martin', type: 'Group Therapy', time: '03:00 PM', duration: '60 min', status: 'confirmed' as const },
      ]
    } else if (dayOfWeek === 3) { // Wednesday
      return [
        { id: 'w3', patient: 'Carol White', type: 'Couples Therapy', time: '11:00 AM', duration: '60 min', status: 'pending' as const },
      ]
    }
    return []
  }

  // Get all appointments across all days
  const getAllAppointments = () => {
    const allAppointments: Array<Session & { date: string }> = []
    
    // Add current day sessions
    sessions.forEach(session => {
      allAppointments.push({
        ...session,
        date: selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      })
    })

    // Add mock appointments for other days
    const mockAppointments = [
      { id: 'a1', patient: 'Alice Cooper', type: 'Individual Therapy', time: '10:00 AM', duration: '50 min', status: 'confirmed' as const, date: 'Feb 10, 2026' },
      { id: 'a2', patient: 'Bob Martin', type: 'Group Therapy', time: '03:00 PM', duration: '60 min', status: 'confirmed' as const, date: 'Feb 10, 2026' },
      { id: 'a3', patient: 'Carol White', type: 'Couples Therapy', time: '11:00 AM', duration: '60 min', status: 'pending' as const, date: 'Feb 12, 2026' },
      { id: 'a4', patient: 'David Lee', type: 'Individual Therapy', time: '02:00 PM', duration: '50 min', status: 'confirmed' as const, date: 'Feb 13, 2026' },
      { id: 'a5', patient: 'Emma Stone', type: 'Family Therapy', time: '04:00 PM', duration: '90 min', status: 'pending' as const, date: 'Feb 15, 2026' },
      { id: 'a6', patient: 'Frank Miller', type: 'Individual Therapy', time: '09:30 AM', duration: '50 min', status: 'confirmed' as const, date: 'Feb 17, 2026' },
      { id: 'a7', patient: 'Grace Park', type: 'Group Therapy', time: '01:00 PM', duration: '60 min', status: 'completed' as const, date: 'Feb 8, 2026' },
      { id: 'a8', patient: 'Henry Ford', type: 'Individual Therapy', time: '11:00 AM', duration: '50 min', status: 'cancelled' as const, date: 'Feb 9, 2026' },
    ]

    return [...allAppointments, ...mockAppointments].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  // Filter appointments based on selected filter
  const getFilteredAppointments = () => {
    const allAppointments = getAllAppointments()
    
    if (appointmentFilter === 'all') {
      return allAppointments
    }
    
    return allAppointments.filter(appointment => appointment.status === appointmentFilter)
  }

  // Get count for each status
  const getStatusCount = (status: 'all' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled') => {
    if (status === 'all') {
      return getAllAppointments().length
    }
    return getAllAppointments().filter(appointment => appointment.status === status).length
  }

  const handleAddSession = (sessionData: SessionFormData) => {
    if (editingSession) {
      // Update existing session
      const updatedSessions = sessions.map(session => {
        if (session.id === editingSession.id) {
          return {
            ...session,
            patient: editingSession.patient, // Keep same patient for now
            type: sessionData.session_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            time: new Date(sessionData.scheduled_at).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }),
            duration: `${sessionData.duration_minutes} min`,
            notes: sessionData.notes
          }
        }
        return session
      })
      
      setSessions(updatedSessions)
      showToastMessage('Session updated successfully!')
      setEditingSession(null)
    } else {
      // Add new session
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
      showToastMessage('Session added successfully!')
    }
  }

  const handleEditSession = (session: Session) => {
    setEditingSession(session)
    setIsModalOpen(true)
    setShowSessionDetails(false)
  }

  const handleBlockTime = () => {
    setIsBlockTimeModalOpen(true)
  }

  const handlePrintSchedule = () => {
    showToastMessage('Preparing schedule for print...')
    // In production, this would generate a PDF
    setTimeout(() => {
      window.print()
    }, 500)
  }

  const handleViewAllAppointments = () => {
    setShowAllAppointments(true)
  }

  const handleScheduleSettings = () => {
    setShowSettingsPanel(!showSettingsPanel)
  }

  const handleSaveProfile = (data: typeof currentProfile) => {
    if (viewCategory === 'therapist') {
      setTherapistProfile(data as typeof therapistProfile)
    } else {
      setClientProfile(data as typeof clientProfile)
    }
    setIsProfileModalOpen(false)
    showToastMessage('Profile updated successfully!')
    // In production, save to Supabase
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session)
    setShowSessionDetails(true)
  }

  const handleDeleteSession = (session: Session) => {
    setSessionToDelete(session)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteSession = () => {
    if (sessionToDelete) {
      setSessions(sessions.filter(s => s.id !== sessionToDelete.id))
      showToastMessage(`Session with ${sessionToDelete.patient} cancelled successfully`)
      setShowDeleteConfirm(false)
      setSessionToDelete(null)
      setShowSessionDetails(false)
    }
  }

  const handleOpenSessionNotes = (session: Session) => {
    setSessionForNotes(session)
    setShowSessionNotes(true)
    setShowSessionDetails(false)
  }

  const handleSaveSessionNotes = (notes: string) => {
    if (sessionForNotes) {
      const updatedSessions = sessions.map(s => 
        s.id === sessionForNotes.id ? { ...s, notes, status: 'completed' as const } : s
      )
      setSessions(updatedSessions)
      showToastMessage('Session notes saved and session marked as completed!')
      setShowSessionNotes(false)
      setSessionForNotes(null)
    }
  }

  // Keyboard shortcuts for better UX
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New Session
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        setIsModalOpen(true)
      }
      // Escape: Close modals
      if (e.key === 'Escape') {
        setIsModalOpen(false)
        setShowSessionDetails(false)
        setShowAllAppointments(false)
        setShowSettingsPanel(false)
        setIsBlockTimeModalOpen(false)
        setShowDeleteConfirm(false)
        setShowSessionNotes(false)
      }
      // Ctrl/Cmd + K: View all appointments
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowAllAppointments(true)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200'
      case 'scheduled': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
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
              <Link href="/dashboard">
                <Image 
                  src={theme === 'dark' ? '/logo/logo-horizontal-dark.png' : '/logo/logo-horizontal.png'}
                  alt="TherapyFlow" 
                  width={550}
                  height={700}
                  className="h-[70px] w-auto cursor-pointer hover:opacity-80 transition-opacity"
                  priority
                />
              </Link>
              <div className="border-l border-slate-300 dark:border-slate-600 pl-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Full Schedule</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {formatDate(selectedDate)} • {viewCategory === 'therapist' ? 'Therapist View' : 'Client View'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {viewCategory === 'therapist' && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  title="New Session (Ctrl+N)"
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-500/30 hover:scale-105 flex items-center"
                >
                  <div className="relative z-10 flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-2.5 group-hover:bg-white/30 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="text-[15px]">New Session</span>
                  </div>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-400/0 via-blue-300/30 to-blue-400/0 blur-xl"></div>
                </button>
              )}
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                title="View Profile"
              >
                <span className="text-white font-medium text-sm">
                  {viewCategory === 'therapist' ? 'SJ' : 'JD'}
                </span>
              </div>
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

          {/* View Category and View Toggle */}
          <div className="flex items-center space-x-3">
            {/* View Category Toggle */}
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewCategory('therapist')}
                className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                  viewCategory === 'therapist' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Therapist</span>
              </button>
              <button
                onClick={() => setViewCategory('client')}
                className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                  viewCategory === 'client' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Client</span>
              </button>
            </div>

            {/* Day/Week View Toggle */}
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
        </div>

        {/* Schedule Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Schedule */}
          <div className="lg:col-span-2 space-y-4">
            {view === 'day' ? (
              /* Day View */
              <div className="card">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                  {viewCategory === 'therapist' ? 'Sessions' : 'My Appointments'} ({sessions.length})
                </h2>
                
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-600 dark:text-slate-400">
                      {viewCategory === 'therapist' ? 'No sessions scheduled for this day' : 'No appointments scheduled for this day'}
                    </p>
                    {viewCategory === 'therapist' && (
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary mt-4"
                      >
                        Schedule Session
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div 
                        key={session.id}
                        onClick={() => handleSessionClick(session)}
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
            ) : (
              /* Week View */
              <div className="card">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                  Week Overview
                </h2>
                
                <div className="grid grid-cols-7 gap-3">
                  {weekDays.map((day, index) => {
                    const daySessions = getSessionsForDay(day)
                    const isToday = day.toDateString() === new Date().toDateString()
                    const isSelected = day.toDateString() === selectedDate.toDateString()
                    
                    return (
                      <div 
                        key={index}
                        className={`rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'
                        }`}
                      >
                        <div className={`p-3 text-center border-b ${
                          isSelected 
                            ? 'border-blue-200 dark:border-blue-700' 
                            : 'border-slate-200 dark:border-slate-700'
                        }`}>
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className={`text-lg font-bold ${
                            isToday 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : isSelected
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}>
                            {day.getDate()}
                          </div>
                          {isToday && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">Today</div>
                          )}
                        </div>
                        
                        <div className="p-2 space-y-2 min-h-[200px]">
                          {daySessions.length === 0 ? (
                            <div className="text-center py-4">
                              <div className="text-xs text-slate-400 dark:text-slate-500">No sessions</div>
                            </div>
                          ) : (
                            daySessions.map((session) => (
                              <div 
                                key={session.id}
                                onClick={() => handleSessionClick(session)}
                                className={`p-2 rounded text-xs cursor-pointer transition-all hover:scale-105 ${
                                  session.status === 'confirmed'
                                    ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50'
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                                }`}
                              >
                                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate mb-1">
                                  {session.patient}
                                </div>
                                <div className="text-slate-600 dark:text-slate-400 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {session.time}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Week Summary */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {weekDays.reduce((acc, day) => acc + getSessionsForDay(day).length, 0)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Total Sessions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {weekDays.reduce((acc, day) => 
                          acc + getSessionsForDay(day).filter(s => s.status === 'confirmed').length, 0
                        )}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Confirmed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {weekDays.reduce((acc, day) => 
                          acc + getSessionsForDay(day).filter(s => s.status === 'pending').length, 0
                        )}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Scheduled</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                  <span className="text-slate-600 dark:text-slate-400">Scheduled</span>
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
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h3>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Add Session - Primary Action */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="group w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white rounded-xl p-4 transition-all duration-200 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-500/20 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Add Session</div>
                        <div className="text-xs text-blue-100 dark:text-blue-200">Schedule new appointment</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>

                {/* Block Time */}
                <button 
                  onClick={handleBlockTime}
                  className="group w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Block Time</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Reserve time slot</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Print Schedule */}
                <button 
                  onClick={handlePrintSchedule}
                  className="group w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 border-2 border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">Print Schedule</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Export to PDF</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-slate-200 dark:border-slate-700"></div>

              {/* Additional Quick Links */}
              <div className="space-y-2">
                <button 
                  onClick={handleViewAllAppointments}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group">
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>View All Appointments</span>
                  </span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button 
                  onClick={handleScheduleSettings}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group">
                  <span className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Schedule Settings</span>
                  </span>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Session Modal */}
      <AddSessionModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSession(null)
        }}
        onSubmit={handleAddSession}
        editSession={editingSession}
      />

      {/* Block Time Modal */}
      {isBlockTimeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Block Time</h2>
              <button 
                onClick={() => setIsBlockTimeModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              showToastMessage('Time blocked successfully!')
              setIsBlockTimeModalOpen(false)
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedDate.toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Lunch break, Personal time"
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="recurring" className="text-sm text-slate-700 dark:text-slate-300">
                    Repeat weekly
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsBlockTimeModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Block Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettingsPanel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Schedule Settings</h2>
              <button 
                onClick={() => setShowSettingsPanel(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Working Hours */}
              <div className="card">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Working Hours</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Start Time</label>
                      <input type="time" defaultValue="09:00" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">End Time</label>
                      <input type="time" defaultValue="17:00" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Time Zone</label>
                      <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                        <option>EST</option>
                        <option>PST</option>
                        <option>CST</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Defaults */}
              <div className="card">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Session Defaults</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Default Duration</label>
                    <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                      <option>30 minutes</option>
                      <option selected>50 minutes</option>
                      <option>60 minutes</option>
                      <option>90 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Buffer Time Between Sessions</label>
                    <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                      <option>No buffer</option>
                      <option selected>10 minutes</option>
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="card">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Email reminders 24 hours before session</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">SMS reminders 1 hour before session</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Notify on cancellations</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSettingsPanel(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToastMessage('Settings saved successfully!')
                    setShowSettingsPanel(false)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Appointments Modal */}
      {showAllAppointments && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">All Appointments</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {getFilteredAppointments().length} {appointmentFilter === 'all' ? 'total' : appointmentFilter} appointments
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowAllAppointments(false)
                  setAppointmentFilter('all')
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setAppointmentFilter('all')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    appointmentFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  All ({getStatusCount('all')})
                </button>
                <button 
                  onClick={() => setAppointmentFilter('confirmed')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    appointmentFilter === 'confirmed'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  Confirmed ({getStatusCount('confirmed')})
                </button>
                <button 
                  onClick={() => setAppointmentFilter('pending')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    appointmentFilter === 'pending'
                      ? 'bg-yellow-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  Scheduled ({getStatusCount('scheduled')})
                </button>
                <button 
                  onClick={() => setAppointmentFilter('completed')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    appointmentFilter === 'completed'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  Completed ({getStatusCount('completed')})
                </button>
                <button 
                  onClick={() => setAppointmentFilter('cancelled')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    appointmentFilter === 'cancelled'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  Cancelled ({getStatusCount('cancelled')})
                </button>
              </div>
            </div>

            {/* Appointments List */}
            <div className="flex-1 overflow-y-auto p-6">
              {getFilteredAppointments().length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-600 dark:text-slate-400">No {appointmentFilter === 'all' ? '' : appointmentFilter} appointments found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getFilteredAppointments().map((appointment) => (
                    <div 
                      key={appointment.id}
                      className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-200 dark:border-slate-600 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">
                              {appointment.patient.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {appointment.patient}
                              </h3>
                              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {appointment.type}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {appointment.date}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {appointment.time}
                              </span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {appointment.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Showing {getFilteredAppointments().length} of {getAllAppointments().length} appointments
                </div>
                <button
                  onClick={() => {
                    setShowAllAppointments(false)
                    setAppointmentFilter('all')
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Details Modal - Gestalt Principles Applied */}
      {showSessionDetails && selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden">
            {/* Proximity: Header groups patient identity elements together */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 px-8 py-6 border-b border-blue-700 dark:border-blue-600">
              <div className="flex items-center justify-between">
                {/* Proximity & Closure: Avatar and info grouped, status badge completes the visual */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/30">
                      <span className="text-white font-bold text-2xl">
                        {selectedSession.patient.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {/* Closure: Status indicator completes the avatar */}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      selectedSession.status === 'confirmed' ? 'bg-green-500' :
                      selectedSession.status === 'pending' ? 'bg-yellow-500' :
                      selectedSession.status === 'completed' ? 'bg-blue-500' :
                      'bg-red-500'
                    }`}></div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedSession.patient}
                    </h2>
                    {/* Similarity: Badges use consistent styling */}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                        {selectedSession.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        selectedSession.status === 'confirmed' ? 'bg-green-500/90 text-white' :
                        selectedSession.status === 'pending' ? 'bg-yellow-500/90 text-white' :
                        selectedSession.status === 'completed' ? 'bg-blue-500/90 text-white' :
                        'bg-red-500/90 text-white'
                      }`}>
                        {selectedSession.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowSessionDetails(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content with Gestalt Principles */}
            <div className="p-8 space-y-6">
              {/* Similarity & Proximity: Info cards use consistent structure and are grouped */}
              <div className="grid grid-cols-3 gap-4">
                {/* Proximity: Icon and text grouped within each card */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</div>
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedSession.time}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</div>
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedSession.duration}</div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</div>
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{selectedSession.type}</div>
                </div>
              </div>

              {/* Proximity: Notes section groups icon with content */}
              {selectedSession.notes && (
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Session Notes</div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedSession.notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Continuity: Action buttons flow from primary to secondary with visual hierarchy */}
              <div className="space-y-3 pt-2">
                {/* Figure/Ground: Primary action stands out with stronger visual weight */}
                <Link
                  href={`/video/${selectedSession.id}`}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  title="Join video call (Ctrl+V)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Join Video Call</span>
                </Link>

                {/* Similarity: Secondary buttons share consistent styling - Only show for therapist view */}
                {viewCategory === 'therapist' ? (
                  <div className="space-y-3">
                    <button 
                      onClick={() => selectedSession && handleOpenSessionNotes(selectedSession)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      title="Add session notes"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Add Session Notes</span>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => selectedSession && handleEditSession(selectedSession)}
                        className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-xl transition-all border border-slate-300 dark:border-slate-600 flex items-center justify-center space-x-2"
                        title="Edit session (Ctrl+E)"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteSession(selectedSession)}
                        className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold py-3 px-4 rounded-xl transition-all border border-red-200 dark:border-red-800 flex items-center justify-center space-x-2"
                        title="Cancel session (Delete)"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowSessionDetails(false)}
                    className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-xl transition-all border border-slate-300 dark:border-slate-600"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && sessionToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Cancel Session?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-600">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                You are about to cancel the session with:
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {sessionToDelete.patient}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {sessionToDelete.type} • {sessionToDelete.time}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setSessionToDelete(null)
                }}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all"
              >
                Keep Session
              </button>
              <button
                onClick={confirmDeleteSession}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all"
              >
                Cancel Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-400 dark:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileData={currentProfile}
        onSave={handleSaveProfile}
      />

      {/* Session Notes Modal */}
      {showSessionNotes && sessionForNotes && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="my-8">
            <SessionNotes
              sessionId={sessionForNotes.id}
              initialNotes={sessionForNotes.notes || ''}
              onSave={handleSaveSessionNotes}
            />
          </div>
        </div>
      )}
    </div>
  )
}
