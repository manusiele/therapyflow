'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { patients as patientsAPI, assessments as assessmentsAPI } from '@/lib/supabase'

interface PatientData {
  id: string
  name: string
  sessions_count: number
  latest_assessment: string
  improvement: number
}

export default function PatientProgress() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<PatientData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ avgImprovement: 0, attendanceRate: 0 })

  useEffect(() => {
    const fetchPatientProgress = async () => {
      if (!user?.id) return

      try {
        const { data: patientsData, error } = await patientsAPI.getAll(user.id)

        if (error) {
          console.error('Error fetching patients:', error)
          return
        }

        if (patientsData && patientsData.length > 0) {
          // Fetch assessment data for each patient
          const patientProgress = await Promise.all(
            patientsData.slice(0, 3).map(async (patient: any) => {
              const { data: assessments } = await assessmentsAPI.getRecent(patient.id, 2)
              
              let improvement = 0
              let latestAssessment = 'No assessments'
              
              if (assessments && assessments.length > 0) {
                const latest = assessments[0] as any
                latestAssessment = `${latest.assessment_type.toUpperCase()}: ${latest.score}`
                
                if (assessments.length > 1) {
                  const previous = assessments[1] as any
                  improvement = Math.round(((previous.score - latest.score) / previous.score) * 100)
                }
              }

              return {
                id: patient.id,
                name: patient.name,
                sessions_count: 0, // Would need to query sessions table
                latest_assessment: latestAssessment,
                improvement
              }
            })
          )

          setPatients(patientProgress)
          
          // Calculate stats
          const avgImprovement = patientProgress.reduce((acc, p) => acc + p.improvement, 0) / patientProgress.length || 0
          setStats({
            avgImprovement: Math.round(avgImprovement),
            attendanceRate: 95 // Would calculate from sessions data
          })
        }
      } catch (err) {
        console.error('Error loading patient progress:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatientProgress()
  }, [user])

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Patient Progress</h2>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          View All Reports
        </button>
      </div>
      
      {patients.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-slate-600 dark:text-slate-400">No patients yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {patients.map((patient) => (
            <div key={patient.id} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{patient.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {patient.sessions_count} sessions completed
                  </p>
                </div>
                {patient.improvement > 0 && (
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    patient.improvement > 15 
                      ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30' 
                      : 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    +{patient.improvement}%
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Latest: {patient.latest_assessment}
                </div>
                {patient.improvement > 0 && (
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(patient.improvement * 3, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {stats.avgImprovement}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Avg Improvement</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {stats.attendanceRate}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">Attendance Rate</div>
        </div>
      </div>
    </div>
  )
}
