export default function PatientPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Patient Portal</h1>
              <p className="text-secondary-600 mt-1">Welcome back, John</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Messages
              </button>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="card text-left hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Book Session</h3>
                <p className="text-sm text-secondary-600">Schedule your next appointment</p>
              </div>
            </div>
          </button>

          <button className="card text-left hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Take Assessment</h3>
                <p className="text-sm text-secondary-600">Complete your wellness check</p>
              </div>
            </div>
          </button>

          <button className="card text-left hover:scale-105 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Resources</h3>
                <p className="text-sm text-secondary-600">Access therapy materials</p>
              </div>
            </div>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Upcoming Sessions</h2>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-secondary-900">Dr. Sarah Johnson</p>
                    <p className="text-sm text-secondary-600">Individual Therapy</p>
                  </div>
                  <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full">Tomorrow</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary-700 font-medium">2:00 PM - 2:50 PM</span>
                  <button className="text-primary-600 hover:text-primary-700">Join Video</button>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-secondary-900">Dr. Sarah Johnson</p>
                    <p className="text-sm text-secondary-600">Follow-up Session</p>
                  </div>
                  <span className="text-xs bg-slate-200 text-secondary-600 px-2 py-1 rounded-full">Next Week</span>
                </div>
                <div className="text-sm text-secondary-600">
                  Monday, 2:00 PM - 2:50 PM
                </div>
              </div>
            </div>
          </div>

          {/* Mood Tracker */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Mood Tracker</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-secondary-700">How are you feeling today?</span>
                  <span className="text-sm text-secondary-500">Rate 1-5</span>
                </div>
                <div className="flex space-x-2">
                  {[1,2,3,4,5].map((i) => (
                    <button 
                      key={i} 
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        i === 4 
                          ? 'bg-primary-600 border-primary-600 text-white' 
                          : 'border-slate-300 hover:border-primary-400 text-secondary-600'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                <h3 className="font-medium text-secondary-900 mb-3">This Week's Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Average Mood</span>
                    <span className="font-medium text-primary-600">3.8/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Improvement</span>
                    <span className="font-medium text-success">+12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Resources</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-medium text-secondary-900">Coping Strategies</p>
                    <p className="text-sm text-secondary-600">Techniques for managing stress</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🧘</span>
                  <div>
                    <p className="font-medium text-secondary-900">Mindfulness Exercises</p>
                    <p className="text-sm text-secondary-600">Guided meditation and breathing</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="font-medium text-secondary-900">Journal Prompts</p>
                    <p className="text-sm text-secondary-600">Daily reflection questions</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-medium text-secondary-900">Crisis Support</p>
                    <p className="text-sm text-secondary-600">24/7 emergency contacts</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}