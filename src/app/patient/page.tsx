'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import ProfileModal, { ProfileData } from '@/components/ProfileModal'
import BookSessionModal, { BookingData } from '@/components/BookSessionModal'
import AssessmentModal, { AssessmentData } from '@/components/AssessmentModal'
import MessagesModal from '@/components/MessagesModal'
import MoodTracker from '@/components/MoodTracker'
import ResourcesPanel from '@/components/ResourcesPanel'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { patients } from '@/lib/supabase'

export default function PatientPortal() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false)
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!user?.email) return

      try {
        const { data, error } = await patients.getByEmail(user.email)
        
        if (error) {
          console.error('Error fetching patient data:', error)
          return
        }

        if (data && data.name) {
          setProfileData({
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            dateOfBirth: data.date_of_birth || '',
            emergencyContact: data.emergency_contact || '',
            role: 'client'
          })
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
      
      if (patientData && patientData.id) {
        await patients.update(patientData.id, {
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

  const handleBookSession = (data: BookingData) => {
    setIsBookingModalOpen(false)
    showToastMessage('Booking request sent! You will receive a confirmation soon.')
    // In production, save to Supabase
    console.log('Booking request:', data)
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex justify-between items-center gap-3">
            {/* Logo and Title Section */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Link href="/" className="flex-shrink-0">
                <Image 
                  src={theme === 'dark' ? '/logo/logo-horizontal-dark.png' : '/logo/logo-horizontal.png'}
                  alt="TherapyFlow" 
                  width={320}
                  height={64}
                  className="h-10 sm:h-12 md:h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                  priority
                />
              </Link>
              <div className="hidden sm:block border-l border-slate-300 dark:border-slate-600 pl-2 sm:pl-4 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">Patient Portal</h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                  {isLoading ? 'Loading...' : `Welcome back, ${profileData.name.split(' ')[0]}`}
                </p>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
              <ThemeToggle />
              <button 
                onClick={() => setIsMessagesModalOpen(true)}
                title="Messages"
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700 text-white font-medium px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 dark:hover:shadow-purple-500/30 hover:scale-105 flex items-center"
              >
                <div className="relative z-10 flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center sm:mr-2.5 group-hover:bg-white/30 transition-colors">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="hidden sm:inline text-sm md:text-[15px]">Messages</span>
                </div>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-400/0 via-purple-300/30 to-purple-400/0 blur-xl"></div>
              </button>
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex-shrink-0"
                title="View Profile"
              >
                <span className="text-white font-medium text-xs sm:text-sm">
                  {profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Title - Shows below logo on small screens */}
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Patient Portal</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {isLoading ? 'Loading...' : `Welcome back, ${profileData.name.split(' ')[0]}`}
            </p>
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
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Dr. Sarah Johnson</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Individual Therapy</p>
                  </div>
                  <span className="text-xs bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded-full">Tomorrow</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">2:00 PM - 2:50 PM</span>
                  <Link 
                    href="/video/session-tomorrow-123"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Join Video
                  </Link>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Dr. Sarah Johnson</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Follow-up Session</p>
                  </div>
                  <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">Next Week</span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Monday, 2:00 PM - 2:50 PM
                </div>
              </div>
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