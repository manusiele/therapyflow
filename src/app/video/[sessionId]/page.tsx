'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, sessions } from '@/lib/supabase'
import { generateRoomNameFromIds } from '@/lib/videoCall'

declare global {
  interface Window {
    DailyIframe: any
  }
}

interface Participant {
  userId: string
  userType: 'therapist' | 'patient'
  isOnline: boolean
  name: string
}

export default function VideoCallPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.sessionId as string
  const { user } = useAuth()
  
  const dailyContainerRef = useRef<HTMLDivElement>(null)
  const callFrameRef = useRef<any>(null)
  const presenceChannelRef = useRef<any>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionData, setSessionData] = useState<any>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [waitingForOther, setWaitingForOther] = useState(false)
  const [userRole, setUserRole] = useState<'therapist' | 'patient' | null>(null)

  // Initialize session and presence
  useEffect(() => {
    if (!user || !sessionId) return

    const initializeSession = async () => {
      try {
        // Fetch session data
        const { data: session, error: sessionError } = await sessions.getById(sessionId)
        
        if (sessionError || !session) {
          setError('Session not found')
          setIsLoading(false)
          return
        }

        setSessionData(session)

        // Determine user role
        const role = session.therapist_id === user.id ? 'therapist' : 'patient'
        setUserRole(role)

        // Update presence
        await updatePresence(sessionId, user.id, role, true)

        // Subscribe to presence changes
        subscribeToPresence(sessionId)

        // Check if other participant is online
        await checkParticipants(sessionId)

      } catch (err) {
        console.error('Error initializing session:', err)
        setError('Failed to initialize session')
        setIsLoading(false)
      }
    }

    initializeSession()

    return () => {
      // Cleanup: mark as offline
      if (user && sessionId && userRole) {
        updatePresence(sessionId, user.id, userRole, false)
      }
      if (presenceChannelRef.current) {
        supabase.removeChannel(presenceChannelRef.current)
      }
    }
  }, [user, sessionId])

  const updatePresence = async (
    sessionId: string,
    userId: string,
    userType: 'therapist' | 'patient',
    isOnline: boolean
  ) => {
    try {
      const { error } = await supabase
        .from('session_presence')
        .upsert({
          session_id: sessionId,
          user_id: userId,
          user_type: userType,
          is_online: isOnline,
          ...(isOnline ? { joined_at: new Date().toISOString() } : { left_at: new Date().toISOString() })
        })

      if (error) console.error('Error updating presence:', error)
    } catch (err) {
      console.error('Error in updatePresence:', err)
    }
  }

  const checkParticipants = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('session_presence')
        .select('*')
        .eq('session_id', sessionId)

      if (error) {
        console.error('Error checking participants:', error)
        return
      }

      const onlineCount = data?.filter(p => p.is_online).length || 0
      
      if (onlineCount < 2) {
        setWaitingForOther(true)
        // Send notification to other participant
        await notifyOtherParticipant(sessionId)
      } else {
        setWaitingForOther(false)
        // Both online, start video call
        initializeVideoCall()
      }
    } catch (err) {
      console.error('Error checking participants:', err)
    }
  }

  const subscribeToPresence = (sessionId: string) => {
    const channel = supabase
      .channel(`session_presence:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_presence',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          console.log('Presence change:', payload)
          checkParticipants(sessionId)
        }
      )
      .subscribe()

    presenceChannelRef.current = channel
  }

  const notifyOtherParticipant = async (sessionId: string) => {
    if (!sessionData || !userRole) return

    const otherUserId = userRole === 'therapist' 
      ? sessionData.patient_id 
      : sessionData.therapist_id

    try {
      // Send notification via API
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: otherUserId,
          subject: 'Therapy Session Starting',
          message: `Your therapy session is ready. Please join the video call.`,
          sessionId
        })
      })
    } catch (err) {
      console.error('Error sending notification:', err)
    }
  }

  const initializeVideoCall = async () => {
    if (!sessionData || !user || !userRole) return

    // Load Daily.co script
    const loadDailyScript = () => {
      if (window.DailyIframe) {
        setupDaily()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://unpkg.com/@daily-co/daily-js'
      script.crossOrigin = 'anonymous'
      script.async = true
      script.onload = () => setupDaily()
      script.onerror = () => {
        setError('Failed to load video call service')
        setIsLoading(false)
      }
      document.body.appendChild(script)
    }

    const setupDaily = async () => {
      if (!dailyContainerRef.current || callFrameRef.current) return

      try {
        const roomName = generateRoomNameFromIds(
          sessionData.therapist_id,
          sessionData.patient_id,
          sessionData.scheduled_at
        )

        // Create room
        const createRoomResponse = await fetch('/api/daily/create-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomName }),
        })

        const roomData = await createRoomResponse.json()

        if (!createRoomResponse.ok) {
          throw new Error(roomData.error || 'Failed to create room')
        }

        // Create Daily call frame
        const callFrame = window.DailyIframe.createFrame(dailyContainerRef.current, {
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
          },
          showLeaveButton: true,
          showFullscreenButton: true,
        })

        callFrameRef.current = callFrame

        callFrame.on('joined-meeting', () => {
          setIsLoading(false)
          console.log('Joined meeting')
        })

        callFrame.on('left-meeting', () => {
          handleEndCall()
        })

        callFrame.on('error', (error: any) => {
          console.error('Daily error:', error)
          setError('Video call error occurred')
        })

        // Join the room
        const displayName = userRole === 'therapist' 
          ? sessionData.therapist?.name || 'Therapist'
          : sessionData.patient?.name || 'Patient'

        await callFrame.join({
          url: `https://manusiele.daily.co/${roomName}`,
          userName: displayName,
        })

      } catch (err) {
        console.error('Error setting up video call:', err)
        setError('Failed to initialize video call')
        setIsLoading(false)
      }
    }

    loadDailyScript()
  }

  const handleEndCall = async () => {
    if (callFrameRef.current) {
      callFrameRef.current.destroy()
      callFrameRef.current = null
    }
    
    if (user && sessionId && userRole) {
      await updatePresence(sessionId, user.id, userRole, false)
    }
    
    router.push(userRole === 'therapist' ? '/dashboard' : '/patient')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Please log in to join the session</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div>
            <h2 className="text-white font-semibold text-sm sm:text-base">Therapy Session</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Secure & Private</p>
          </div>
        </div>
        <button
          onClick={handleEndCall}
          className="text-white hover:text-red-400 transition-colors px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center space-x-2 text-sm"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="hidden sm:inline">End Call</span>
        </button>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative">
        {waitingForOther && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
            <div className="text-center max-w-md px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-white text-lg sm:text-xl font-semibold mb-2">
                Waiting for {userRole === 'therapist' ? 'patient' : 'therapist'}
              </h3>
              <p className="text-slate-400 text-sm sm:text-base mb-4">
                The other participant has been notified. The session will start when they join.
              </p>
              <div className="bg-slate-800 rounded-lg p-4 text-left">
                <p className="text-slate-300 text-sm mb-2">While you wait:</p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Check your camera and microphone</li>
                  <li>• Ensure you're in a quiet space</li>
                  <li>• Review session notes if needed</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {isLoading && !waitingForOther && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg">Connecting...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="text-center max-w-md px-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white text-lg mb-2">Connection Error</p>
              <p className="text-slate-400 text-sm mb-6">{error}</p>
              <button
                onClick={handleEndCall}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        <div ref={dailyContainerRef} className="w-full h-full" />
      </div>

      {/* Footer */}
      <div className="bg-slate-900 px-4 sm:px-6 py-2 sm:py-3 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-2 sm:space-x-4 text-slate-400">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Encrypted</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
