'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { auth } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Sign in with Supabase
      const { data: authData, error: authError } = await auth.signIn(email, password)
      
      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setError('Login failed. Please try again.')
        setIsLoading(false)
        return
      }

      // Get user role from metadata
      const userRole = authData.user.user_metadata?.role

      // Redirect based on role
      if (userRole === 'therapist') {
        router.push('/dashboard')
      } else {
        router.push('/patient')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image 
              src={theme === 'dark' ? '/logo/logo-horizontal-dark.png' : '/logo/logo-horizontal.png'}
              alt="TherapyFlow" 
              width={300}
              height={60}
              className="h-16 w-auto mx-auto cursor-pointer hover:opacity-80 transition-opacity"
              priority
            />
          </Link>
          <p className="text-slate-600 dark:text-slate-400 mt-4">Welcome back! Please login to your account.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">Demo Credentials:</p>
            <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <p>Therapist: therapist@demo.com / any password</p>
              <p>Patient: patient@demo.com / any password</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
