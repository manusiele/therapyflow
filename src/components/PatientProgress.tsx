'use client'

import { useAppSelector } from '@/store/hooks'

export default function PatientProgress() {
  const { sessions } = useAppSelector((state) => state.session)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Patient Progress</h2>
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-gray-600">No session data available yet</p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="flex justify-between border-b pb-2">
              <span className="font-medium">{session.session_type}</span>
              <span className="text-primary">{session.status}</span>
            </div>
          ))
        )}
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Mood Improvement</span>
            <span className="text-sm font-semibold text-green-600">+15%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Session Attendance</span>
            <span className="text-sm font-semibold text-primary">95%</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Connect to Supabase to see live progress data
      </p>
    </div>
  )
}
