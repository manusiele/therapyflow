'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SessionOverview from '@/components/SessionOverview'
import PatientProgress from '@/components/PatientProgress'
import AddSessionModal, { SessionFormData } from '@/components/AddSessionModal'
import ProfileModal, { ProfileData } from '@/components/ProfileModal'
import PatientManagementModal from '@/components/PatientManagementModal'
import CalendarIntegrationModal from '@/components/CalendarIntegrationModal'
import MessagesModal from '@/components/MessagesModal'
import ReportsAnalyticsModal from '@/components/ReportsAnalyticsModal'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { therapists } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isPatientManagementOpen, setIsPatientManagementOpen] = useState(false)
  const [isCalendarIntegrationOpen, setIsCalendarIntegrationOpen] = useState(false)
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false)
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'Therapist',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    bio: '',
    role: 'therapist' as const
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/therapist/login')
    }
  }, [user, router])

  useEffect(() => {
    const fetchTherapistData = async () => {
      if (!user?.email) return

      try {
        const { data, error } = await therapists.getByEmail(user.email)
        
        if (error) {
          console.error('Error fetching therapist data:', error)
          return
        }

        if (data) {
          setProfileData({
            name: (data as any).name || 'Therapist',
            email: (data as any).email || user.email,
            phone: (data as any).phone || '',
            specialization: (data as any).specialization || '',
            licenseNumber: (data as any).license_number || '',
            bio: (data as any).bio || '',
            role: 'therapist'
          })
        }
      } catch (err) {
        console.error('Error loading therapist profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTherapistData()
  }, [user])

  const handleAddSession = (sessionData: SessionFormData) => {
    // In production, this would dispatch to Redux and save to Supabase
    console.log('New session:', sessionData)
    // Show success notification, refresh data, etc.
  }

  const handleSaveProfile = async (data: ProfileData) => {
    if (!user?.email) return

    try {
      const { data: therapistData } = await therapists.getByEmail(user.email)
      
      if (therapistData && (therapistData as any).id) {
        await therapists.update((therapistData as any).id, {
          name: data.name,
          phone: data.phone,
          specialization: data.specialization || '',
          license_number: data.licenseNumber || '',
          bio: data.bio || ''
        })
      }

      setProfileData(data)
      setIsProfileModalOpen(false)
      console.log('Profile updated:', data)
    } catch (err) {
      console.error('Error updating profile:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Image 
                src={theme === 'dark' ? '/logo/logo-horizontal-dark.png' : '/logo/logo-horizontal.png'}
                alt="TherapyFlow" 
                width={350}
                height={70}
                className="h-12 sm:h-[70px] w-auto"
                priority
              />
              <div className="border-l border-slate-300 dark:border-slate-600 pl-2 sm:pl-4">
                <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {isLoading ? 'Loading...' : `Welcome back, ${profileData.name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
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
                onClick={() => setIsModalOpen(true)}
                title="New Session"
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="w-9 h-9 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                title="Profile"
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => setIsPatientManagementOpen(true)}
            className="card text-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">24</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Patients</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">8</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Today's Sessions</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">92%</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Attendance Rate</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">3</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Pending Notes</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setIsPatientManagementOpen(true)}
            className="card hover:shadow-lg transition-all group text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Patient Management</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">View and manage patient profiles</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setIsCalendarIntegrationOpen(true)}
            className="card hover:shadow-lg transition-all group text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Calendar Integration</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sync with Google, Outlook, Apple</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setIsReportsModalOpen(true)}
            className="card hover:shadow-lg transition-all group text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Reports & Analytics</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">View insights and export data</p>
              </div>
            </div>
          </button>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid lg:grid-cols-2 gap-8">
          <SessionOverview />
          <PatientProgress />
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-slate-100 font-medium">Session completed with John Doe</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Individual therapy • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-slate-100 font-medium">PHQ-9 assessment submitted by Jane Smith</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Score: 8 (Moderate) • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-slate-100 font-medium">New patient registration: Michael Brown</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Initial consultation scheduled • Yesterday</p>
                </div>
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

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileData={profileData}
        onSave={handleSaveProfile}
      />

      {/* Patient Management Modal */}
      <PatientManagementModal
        isOpen={isPatientManagementOpen}
        onClose={() => setIsPatientManagementOpen(false)}
      />

      {/* Calendar Integration Modal */}
      <CalendarIntegrationModal
        isOpen={isCalendarIntegrationOpen}
        onClose={() => setIsCalendarIntegrationOpen(false)}
      />

      {/* Messages Modal */}
      <MessagesModal
        isOpen={isMessagesModalOpen}
        onClose={() => setIsMessagesModalOpen(false)}
        userRole="therapist"
      />

      {/* Reports & Analytics Modal */}
      <ReportsAnalyticsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
        userRole="therapist"
      />
    </div>
  )
}
