import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">TherapyFlow</h1>
          <p className="text-xl text-gray-600">
            Mental Health & Therapy Management Platform
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3 text-primary">Session Management</h2>
            <p className="text-gray-700">
              Schedule, track, and manage therapy sessions with integrated calendar and reminder systems.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3 text-primary">Progress Tracking</h2>
            <p className="text-gray-700">
              Monitor patient progress with assessments, mood tracking, and treatment analytics.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3 text-primary">Secure Communication</h2>
            <p className="text-gray-700">
              HIPAA-compliant messaging and resource sharing between therapists and patients.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link 
            href="/dashboard" 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Therapist Dashboard
          </Link>
          <Link 
            href="/patient" 
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Patient Portal
          </Link>
        </div>
      </div>
    </main>
  )
}
