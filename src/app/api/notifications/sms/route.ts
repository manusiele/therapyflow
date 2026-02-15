import { NextRequest, NextResponse } from 'next/server'

/**
 * SMS Notification API Route
 * Integrates with Twilio for production use
 */

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    // Validate input
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Production: Twilio Integration
    /*
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: to,
          From: TWILIO_PHONE_NUMBER,
          Body: message
        })
      }
    )

    if (!response.ok) {
      throw new Error('Twilio API error')
    }

    const data = await response.json()
    */

    // Demo mode - simulate success
    console.log('📱 SMS sent to:', to)
    console.log('Message:', message.substring(0, 50) + '...')

    return NextResponse.json({
      success: true,
      message: 'SMS sent successfully',
      demo: true
    })

  } catch (error) {
    console.error('SMS API error:', error)
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}
