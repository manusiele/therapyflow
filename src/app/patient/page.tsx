'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ProfileModal, { ProfileData } from '@/components/ProfileModal'
import BookSessionModal, { BookingData } from '@/components/BookSessionModal'
import AssessmentModal, { AssessmentData } from '@/components/AssessmentModal'
import MessagesModal from '@/components/MessagesModal'
import MoodTracker from '@/components/MoodTracker'
import ResourcesPanel from '@/components/ResourcesPanel'
import NotificationsDropdown from '@/components/NotificationsDropdown'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { patients, sessions, messages, therapists, notifications } from '@/lib/supabase'

interface Session {
  id: string
  therapist_id: string
  patient_id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  session_type: string
  therapist?: {
    name: string
  }
}

export default function PatientPortal() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false)
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [patientId, setPatientId] = useState<string>('')
  const [assessmentHistory, setAssessmentHistory] = useState<Array<{
    date: string
    assessmentType: string
    score: number
  }>>([])
  const [profileData, setProfileData] = useState({
    name: 'Patient',
    email: '',
    phone: '',
    dateOfBirth: '',
    emergencyContact: '',
    role: 'client' as const
  })

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/patient/login')
    }
  }, [user, router])

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user?.email) return

      try {
        const { data, error } = await patients.getByEmail(user.email)
        
        if (error) {
          console.error('Error fetching patient data:', error)
          return
        }

        if (data) {
          const dbPatientId = (data as any).id
          setPatientId(dbPatientId)
          console.log('Patient ID loaded:', dbPatientId)
          
          setProfileData({
            name: (data as any).name || 'Patient',
            email: (data as any).email || user.email,
            phone: (data as any).phone || '',
            dateOfBirth: (data as any).date_of_birth || '',
            emergencyContact: (data as any).emergency_contact || '',
            role: 'client'
          })

          // Fetch patient's sessions
          if (dbPatientId) {
            const { data: sessionsData, error: sessionsError } = await sessions.getAll({ patientId: dbPatientId })
            
            if (sessionsError) {
              console.error('Error fetching sessions:', sessionsError)
            } else if (sessionsData) {
              // Filter for upcoming sessions
              const now = new Date()
              const upcoming = (sessionsData as any[])
                .filter((session: any) => new Date(session.scheduled_at) >= now)
                .sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
              
              setUpcomingSessions(upcoming)
            }
          }
        }
      } catch (err) {
        console.error('Error loading patient profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatientData()
  }, [user])

  const handleSaveProfile = async (data: ProfileData) => {
    if (!user?.email) return

    try {
      const { data: patientData } = await patients.getByEmail(user.email)
      
      if (patientData && (patientData as any).id) {
        await patients.update((patientData as any).id, {
          name: data.name,
          phone: data.phone,
          date_of_birth: data.dateOfBirth,
          emergency_contact: data.emergencyContact
        })
      }

      setProfileData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth || '',
        emergencyContact: data.emergencyContact || '',
        role: 'client' as const
      })
      setIsProfileModalOpen(false)
      showToastMessage('Profile updated successfully!')
      console.log('Profile updated:', data)
    } catch (err) {
      console.error('Error updating profile:', err)
      showToastMessage('Failed to update profile')
    }
  }

  const handleBookSession = async (data: BookingData) => {
      if (!patientId) {
        showToastMessage('Please log in to book a session.')
        return
      }

      setIsSubmittingBooking(true)

      try {
        // Create the session in the database with pending status
        const scheduledAt = new Date(`${data.preferredDate}T${data.preferredTime}`)

        const { data: sessionData, error: sessionError } = await sessions.create({
          patient_id: patientId,
          therapist_id: data.therapistId,
          session_type: data.sessionType,
          scheduled_at: scheduledAt.toISOString(),
          duration_minutes: 50, // Default duration
          status: 'pending',
          notes: data.notes || ''
        })

        if (sessionError) {
          console.error('Error creating session:', sessionError)
          showToastMessage('Failed to book session. Please try again.')
          setIsSubmittingBooking(false)
          return
        }

        console.log('Session created:', sessionData)

        // Get therapist name for the confirmation message
        const { data: therapistData } = await therapists.getById(data.therapistId)
        const therapistName = therapistData ? (therapistData as any).name : 'your therapist'

        // Create or get conversation between patient and therapist
        const conversationResult = await messages.createConversation(data.therapistId, patientId)
        console.log('Conversation result:', conversationResult)

        if (conversationResult.error) {
          console.error('Error creating conversation:', conversationResult.error)
        }

        // Send a message notification to the therapist
        const therapistMessage = await messages.sendMessage({
          sender_id: patientId,
          sender_type: 'patient',
          receiver_id: data.therapistId,
          receiver_type: 'therapist',
          content: `🔔 New Session Request

  ${data.sessionType.charAt(0).toUpperCase() + data.sessionType.slice(1)} Therapy Session

  📅 Date: ${new Date(scheduledAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
  ⏰ Time: ${new Date(scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
  ⏱️ Duration: 50 minutes

  ${data.notes ? `📝 Notes: ${data.notes}` : ''}

  Please review and confirm this appointment.`
        })

        console.log('Therapist message result:', therapistMessage)

        if (therapistMessage.error) {
          console.error('Error sending notification to therapist:', therapistMessage.error)
        }

        // Create notification for therapist
        await notifications.create({
          user_id: data.therapistId,
          user_type: 'therapist',
          type: 'session_request',
          title: 'New Session Request',
          message: `${profileData.name} has requested a ${data.sessionType} therapy session on ${new Date(scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${new Date(scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`,
          related_id: (sessionData as any)?.id
        })

        // Send a confirmation message back to the patient
        const patientMessage = await messages.sendMessage({
          sender_id: data.therapistId,
          sender_type: 'therapist',
          receiver_id: patientId,
          receiver_type: 'patient',
          content: `✅ Booking Request Received

  Your session booking request has been sent to ${therapistName}.

  📅 Session Details:
  • Therapist: ${therapistName}
  • Type: ${data.sessionType.charAt(0).toUpperCase() + data.sessionType.slice(1)} Therapy
  • Date: ${new Date(scheduledAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
  • Time: ${new Date(scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
  • Duration: 50 minutes
  • Status: ⏳ Pending Confirmation

  ${therapistName} will review your request and confirm the appointment shortly. You'll receive a notification once it's confirmed.`
        })

        console.log('Patient message result:', patientMessage)

        if (patientMessage.error) {
          console.error('Error sending confirmation to patient:', patientMessage.error)
        }

        // Refresh sessions list
        const { data: updatedSessions } = await sessions.getAll({ patientId })
        if (updatedSessions) {
          const now = new Date()
          const upcoming = (updatedSessions as any[])
            .filter((session: any) => new Date(session.scheduled_at) >= now)
            .sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
          setUpcomingSessions(upcoming)
        }

        setIsBookingModalOpen(false)
        setIsSubmittingBooking(false)
        showToastMessage('Booking request sent! Check your messages for confirmation details.')
      } catch (err) {
        console.error('Error booking session:', err)
        showToastMessage('Failed to book session. Please try again.')
        setIsSubmittingBooking(false)
      }
    }

  const handleTakeAssessment = (data: AssessmentData) => {
    const newAssessment = {
      date: new Date().toISOString(),
      assessmentType: data.assessmentType,
      score: data.score
    }
    setAssessmentHistory(prev => [newAssessment, ...prev])
    setIsAssessmentModalOpen(false)
    showToastMessage(`${data.assessmentType} assessment completed! Score: ${data.score}`)
    // In production, save to Supabase
    console.log('Assessment completed:', data)
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/patient">
              <Image 
                src={theme === 'dark' ? '/logo/logo-horizontal-dark.png' : '/logo/logo-horizontal.png'}
                alt="TherapyFlow" 
                width={320}
                height={64}
                className="h-12 sm:h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                priority
              />
            </Link>

            {/* Actions Section */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Toggle theme"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              {patientId ? (
                <NotificationsDropdown userId={patientId} userType="patient" />
              ) : (
                <div className="p-2 opacity-50" title="Loading notifications...">
                  <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              )}
              <button 
                onClick={() => setIsMessagesModalOpen(true)}
                title="Messages"
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="w-9 h-9 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                title={`${profileData.name} - View Profile`}
              >
                <span className="text-white font-medium text-sm">
                  {profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="card text-left hover:scale-105 transition-transform"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Book Session</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Schedule your next appointment</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setIsAssessmentModalOpen(true)}
            className="card text-left hover:scale-105 transition-transform"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Take Assessment</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Complete your wellness check</p>
              </div>
            </div>
          </button>

          <button className="card text-left hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Resources</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Access therapy materials</p>
              </div>
            </div>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Upcoming Sessions</h2>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">Loading sessions...</p>
                </div>
              ) : upcomingSessions.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-600 dark:text-slate-400">No upcoming sessions</p>
                  <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Book a session
                  </button>
                </div>
              ) : (
                upcomingSessions.map((session, index) => {
                  const sessionDate = new Date(session.scheduled_at)
                  const endTime = new Date(sessionDate.getTime() + session.duration_minutes * 60000)
                  const isNow = Math.abs(sessionDate.getTime() - currentTime.getTime()) < 30 * 60000 // Within 30 minutes
                  const isToday = sessionDate.toDateString() === currentTime.toDateString()
                  
                  return (
                    <div 
                      key={session.id}
                      className={`p-4 rounded-lg border ${
                        isNow 
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' 
                          : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {(session.therapist as any)?.name || 'Therapist'}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {session.session_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Therapy Session'}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isNow 
                            ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                            : isToday
                            ? 'bg-green-600 dark:bg-green-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                        }`}>
                          {isNow ? 'Now' : isToday ? 'Today' : sessionDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className={`font-medium ${
                          isNow ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                        {isNow && (
                          <Link 
                            href={`/video/${session.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          >
                            Join Video
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Mood Tracker */}
          <MoodTracker assessmentHistory={assessmentHistory} />

          {/* Resources */}
          <ResourcesPanel />
        </div>
      </main>

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
        profileData={profileData}
        onSave={handleSaveProfile}
      />

      {/* Book Session Modal */}
      <BookSessionModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookSession}
        isSubmitting={isSubmittingBooking}
      />

      {/* Assessment Modal */}
      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        onSubmit={handleTakeAssessment}
      />

      {/* Messages Modal */}
      <MessagesModal
        isOpen={isMessagesModalOpen}
        onClose={() => setIsMessagesModalOpen(false)}
        userRole="client"
      />
    </div>
  )
}