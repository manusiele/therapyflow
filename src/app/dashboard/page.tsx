import SessionOverview from '@/components/SessionOverview'
import PatientProgress from '@/components/PatientProgress'

export default function Dashboard() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Therapist Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <SessionOverview />
          <PatientProgress />
        </div>
      </div>
    </div>
  )
}
