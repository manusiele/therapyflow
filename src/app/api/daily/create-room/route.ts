import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { roomName } = await request.json()

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.DAILY_API_KEY

    if (!apiKey) {
      console.error('DAILY_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Video call service not configured' },
        { status: 500 }
      )
    }

    // Create room in Daily.co
    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        name: roomName,
        privacy: 'private',
        properties: {
          enable_screenshare: true,
          enable_chat: true,
          start_video_off: false,
          start_audio_off: false,
          enable_recording: 'cloud', // Optional: enable recording
          max_participants: 2, // Limit to therapist + patient
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2), // Expire in 2 hours
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      // If room already exists, that's okay - return success
      if (data.error === 'room-name-already-exists' || response.status === 400) {
        return NextResponse.json({
          success: true,
          room: {
            name: roomName,
            url: `https://manusiele.daily.co/${roomName}`,
            exists: true
          }
        })
      }

      console.error('Daily.co API error:', data)
      return NextResponse.json(
        { error: data.error || 'Failed to create room' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      room: {
        name: data.name,
        url: data.url,
        created: true
      }
    })

  } catch (error) {
    console.error('Error creating Daily.co room:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
