'use client'

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import NotificationPermission from '@/components/NotificationPermission'
import { registerServiceWorker } from '@/lib/registerServiceWorker'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <PWAInstallPrompt />
          <NotificationPermission />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  )
}
