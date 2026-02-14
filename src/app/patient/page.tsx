'use client'

import Image from 'next/image'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'

export default function PatientPortal() {
  const { theme } = useTheme()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Image 
                  src={theme === 'dark' ? '/logo/logo-horizontal-dark.png' : '/logo/logo-horizontal.png'}
                  alt="TherapyFlow" 
                  width={320}
                  height={64}
                  className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                  priority
                />
              </Link>
              <div className="border-l border-slate-300 dark:border-slate-600 pl-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Patient Portal</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Welcome back, John</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="btn-secondary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Messages
              </button>
              <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="card text-left hover:scale-105 transition-transform">
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

          <button className="card text-left hover:scale-105 transition-transform">
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
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Join Video</button>
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
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Mood Tracker</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-700 dark:text-slate-300">How are you feeling today?</span>
                  <span className="text-sm text-slate-500 dark:text-slate-500">Rate 1-5</span>
                </div>
                <div className="flex space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <button 
                      key={i} 
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        i === 4 
                          ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500 text-white' 
                          : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">This Week's Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Average Mood</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">3.8/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Improvement</span>
                    <span className="font-medium text-green-600 dark:text-green-400">+12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="card">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Resources</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Coping Strategies</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Techniques for managing stress</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🧘</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Mindfulness Exercises</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Guided meditation and breathing</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Journal Prompts</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Daily reflection questions</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">Crisis Support</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">24/7 emergency contacts</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}