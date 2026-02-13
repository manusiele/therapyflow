'use client'

import { useAppSelector } from '@/store/hooks'

export default function PatientProgress() {
  const { sessions } = useAppSelector((state) => state.session)

  const progressData = [
    { patient: "John Doe", improvement: "+15%", sessions: 8, lastAssessment: "PHQ-9: 6" },
    { patient: "Jane Smith", improvement: "+22%", sessions: 12, lastAssessment: "GAD-7: 4" },
    { patient: "Michael Brown", improvement: "+8%", sessions: 3, lastAssessment: "PHQ-9: 12" },
  ]

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-secondary-900">Patient Progress</h2>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All Reports
        </button>
      </div>
      
      <div className="space-y-4">
        {progressData.map((patient, index) => (
          <div key={index} className="p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-secondary-900">{patient.patient}</p>
                <p className="text-sm text-secondary-600">{patient.sessions} sessions completed</p>
              </div>
              <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                parseInt(patient.improvement) > 15 
                  ? 'text-success bg-green-100' 
                  : 'text-warning bg-yellow-100'
              }`}>
                {patient.improvement}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-secondary-600">
                Latest: {patient.lastAssessment}
              </div>
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(parseInt(patient.improvement.replace('%', '')) * 3, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-success">87%</div>
          <div className="text-xs text-secondary-600">Avg Improvement</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-primary-600">95%</div>
          <div className="text-xs text-secondary-600">Attendance Rate</div>
        </div>
      </div>
    </div>
  )
}
