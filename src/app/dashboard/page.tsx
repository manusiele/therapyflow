'use client'

import { useState } from 'react'
import Image from 'next/image'
import SessionOverview from '@/components/SessionOverview'
import PatientProgress from '@/components/PatientProgress'
import AddSessionModal, { SessionFormData } from '@/components/AddSessionModal'
import ThemeToggle from '@/components/ThemeToggle'

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddSession = (sessionData: SessionFormData) => {
    // In production, this would dispatch to Redux and save to Supabase
    console.log('New session:', sessionData)
    // Show success notification, refresh data, etc.
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="dark:bg-white/10 dark:backdrop-blur-md dark:border dark:border-white/20 dark:rounded-xl dark:px-4 dark:py-2 dark:shadow-lg dark:shadow-blue-500/10">
                <Image 
                  src="/logo/logo-horizontal.png" 
                  alt="TherapyFlow" 
                  width={350}
                  height={70}
                  className="h-[70px] w-auto"
                  priority
                />
              </div>
              <div className="border-l border-slate-300 dark:border-slate-600 pl-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Welcome back, Dr. Sarah Johnson</p>
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
              <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">SJ</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">8</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Today's Sessions</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">24</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Patients</div>
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
    </div>
  )
}
