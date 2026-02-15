'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import SessionOverview from '@/components/SessionOverview'
import PatientProgress from '@/components/PatientProgress'
import AddSessionModal, { SessionFormData } from '@/components/AddSessionModal'
import ProfileModal from '@/components/ProfileModal'
import PatientManagementModal from '@/components/PatientManagementModal'
import CalendarIntegrationModal from '@/components/CalendarIntegrationModal'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { therapists } from '@/lib/supabase'

export default function Dashboard() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isPatientManagementOpen, setIsPatientManagementOpen] = useState(false)
  const [isCalendarIntegrationOpen, setIsCalendarIntegrationOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: 'Therapist',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    bio: '',
    role: 'therapist' as const
  })

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
            name: data.name || 'Therapist',
            email: data.email || user.email,
            phone: data.phone || '',
            specialization: data.specialization || '',
            licenseNumber: data.license_number || '',
            bio: data.bio || '',
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

  const handleSaveProfile = async (data: typeof profileData) => {
    if (!user?.email) return

    try {
      const { data: therapistData } = await therapists.getByEmail(user.email)
      
      if (therapistData) {
        await therapists.update(therapistData.id, {
          name: data.name,
          phone: data.phone,
          specialization: data.specialization,
          license_number: data.licenseNumber,
          bio: data.bio
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image 
                src={theme === 'dark' ? '/logo/logo-horizontal-dark.png' : '/logo/logo-horizontal.png'}
                alt="TherapyFlow" 
                width={350}
                height={70}
                className="h-[70px] w-auto"
                priority
              />
              <div className="border-l border-slate-300 dark:border-slate-600 pl-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {isLoading ? 'Loading...' : `Welcome back, ${profileData.name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button 
                onClick={() => setIsModalOpen(true)}
                title="New Session"
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
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                title="View Profile"
              >
                <span className="text-white font-medium text-sm">
                  {profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
    </div>
  )
}
