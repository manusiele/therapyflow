export default function PatientPortal() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Patient Portal</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Upcoming Sessions</h2>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="font-medium">Dr. Sarah Johnson</p>
                <p className="text-sm text-gray-600">Tomorrow, 2:00 PM</p>
                <p className="text-xs text-gray-500">Individual Therapy</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Mood Tracker</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Today's Mood</span>
                <div className="flex space-x-1">
                  {[1,2,3,4,5].map((i) => (
                    <button key={i} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-primary transition">
                      {i}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">Rate your mood from 1-5</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Resources</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
                📚 Coping Strategies
              </button>
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
                🧘 Mindfulness Exercises
              </button>
              <button className="w-full text-left p-2 hover:bg-gray-50 rounded">
                📝 Journal Prompts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}