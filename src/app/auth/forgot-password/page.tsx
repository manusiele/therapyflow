'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Always use production URL when deployed
      const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      const redirectUrl = isProduction 
        ? 'https://therapyflowclinic.vercel.app/auth/reset-password'
        : `${window.location.origin}/auth/reset-password`

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (resetError) {
        setError(resetError.message)
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setIsLoading(false)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-4">
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
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reset Password</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">We'll send you a reset link</p>
            </div>
          </div>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Check Your Email</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                We've sent a password reset link to <span className="font-medium text-slate-900 dark:text-slate-100">{email}</span>
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              <Link 
                href="/auth/login"
                className="inline-block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Forgot Password?</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Remember your password?{' '}
                  <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Back to login
                  </Link>
                </p>
              </div>
            </>
          )}
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
