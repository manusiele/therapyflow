/**
 * Video Call Utilities for Jitsi Meet Integration
 */

/**
 * Generate a unique room name for a therapy session
 * Format: sessionId_timestamp for uniqueness and security
 */
export function generateRoomName(sessionId: string): string {
  const timestamp = Date.now()
  return `${sessionId}_${timestamp}`
}

/**
 * Generate room name from therapist and patient IDs
 * This creates a consistent room name for recurring sessions
 */
export function generateRoomNameFromIds(therapistId: string, patientId: string, sessionDate?: string): string {
  const dateStr = sessionDate ? new Date(sessionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  const hash = `${therapistId}_${patientId}_${dateStr}`.replace(/-/g, '')
  return hash.substring(0, 32) // Limit length for cleaner URLs
}

/**
 * Validate if a room name is valid
 */
export function isValidRoomName(roomName: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(roomName) && roomName.length >= 8 && roomName.length <= 64
}

/**
 * Get Jitsi Meet configuration for therapy sessions
 */
export function getJitsiConfig() {
  return {
    domain: 'meet.jit.si', // Can be changed to self-hosted domain
    options: {
      // Privacy & Security
      enableLobbyChat: false,
      enableInsecureRoomNameWarning: true,
      doNotStoreRoom: true,
      disableInviteFunctions: true,
      
      // Recording (disabled by default for privacy)
      disableRecording: true,
      
      // Quality settings
      resolution: 720,
      constraints: {
        video: {
          height: { ideal: 720, max: 1080, min: 360 }
        }
      }
    }
  }
}

/**
 * Check if browser supports WebRTC
 */
export function isWebRTCSupported(): boolean {
  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.RTCPeerConnection
  )
}

/**
 * Request camera and microphone permissions
 */
export async function requestMediaPermissions(): Promise<{ audio: boolean; video: boolean }> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    stream.getTracks().forEach(track => track.stop()) // Stop the stream after checking
    return { audio: true, video: true }
  } catch (error) {
    console.error('Media permissions error:', error)
    return { audio: false, video: false }
  }
}
