'use client'

import Link from 'next/link'

export default function SessionOverview() {
  const sessions = [
    { id: 1, patient: "John Doe", type: "Individual Therapy", time: "2:00 PM", duration: "50 min", status: "confirmed" },
    { id: 2, patient: "Jane Smith", type: "Couples Therapy", time: "3:30 PM", duration: "60 min", status: "confirmed" },
    { id: 3, patient: "Michael Brown", type: "Initial Consultation", time: "5:00 PM", duration: "90 min", status: "pending" },
  ]

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Today's Sessions</h2>
        <span className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
          {sessions.length} sessions
        </span>
      </div>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">
                  {session.patient.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{session.patient}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{session.type}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  session.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">{session.time}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">{session.duration}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Link href="/dashboard/schedule" className="w-full btn-secondary text-center block">
          View Full Schedule
        </Link>
      </div>
    </div>
  )
}
