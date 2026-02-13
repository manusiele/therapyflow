import SessionOverview from '@/components/SessionOverview'
import PatientProgress from '@/components/PatientProgress'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Therapist Dashboard</h1>
              <p className="text-secondary-600 mt-1">Welcome back, Dr. Sarah Johnson</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Session
              </button>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">SJ</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">8</div>
            <div className="text-sm text-secondary-600">Today's Sessions</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-accent-600 mb-1">24</div>
            <div className="text-sm text-secondary-600">Active Patients</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success mb-1">92%</div>
            <div className="text-sm text-secondary-600">Attendance Rate</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-warning mb-1">3</div>
            <div className="text-sm text-secondary-600">Pending Notes</div>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid lg:grid-cols-2 gap-8">
          <SessionOverview />
          <PatientProgress />
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-secondary-900 font-medium">Session completed with John Doe</p>
                  <p className="text-sm text-secondary-600">Individual therapy • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-secondary-900 font-medium">PHQ-9 assessment submitted by Jane Smith</p>
                  <p className="text-sm text-secondary-600">Score: 8 (Moderate) • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-secondary-900 font-medium">New patient registration: Michael Brown</p>
                  <p className="text-sm text-secondary-600">Initial consultation scheduled • Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
