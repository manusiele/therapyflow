import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="text-xl font-semibold text-secondary-900">TherapyFlow</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard" className="btn-secondary">
                For Therapists
              </Link>
              <Link href="/patient" className="btn-primary">
                Patient Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
              Mental Health
              <span className="text-primary-600 block">Management Platform</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Streamline therapy sessions, track patient progress, and enhance mental health outcomes 
              with our comprehensive, HIPAA-compliant platform designed for modern healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
                Start Free Trial
              </Link>
              <Link href="/patient" className="btn-secondary text-lg px-8 py-4">
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Everything you need for effective therapy management
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Comprehensive tools designed to enhance the therapeutic relationship and improve patient outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card group hover:scale-105 animate-slide-up">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Session Management</h3>
              <p className="text-secondary-600 leading-relaxed">
                Intelligent scheduling with automated reminders, session notes, and progress tracking 
                to keep your practice organized and efficient.
              </p>
            </div>
            
            <div className="card group hover:scale-105 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent-200 transition-colors">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Progress Analytics</h3>
              <p className="text-secondary-600 leading-relaxed">
                Visual dashboards and standardized assessments (PHQ-9, GAD-7) provide data-driven 
                insights into patient progress and treatment effectiveness.
              </p>
            </div>
            
            <div className="card group hover:scale-105 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Secure Communication</h3>
              <p className="text-secondary-600 leading-relaxed">
                HIPAA-compliant messaging, secure file sharing, and encrypted data storage 
                ensure patient privacy and regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-secondary-600">Active Therapists</div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="text-3xl font-bold text-primary-600 mb-2">2,000+</div>
              <div className="text-secondary-600">Patients Served</div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-secondary-600">Satisfaction Rate</div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-secondary-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <span className="text-xl font-semibold">TherapyFlow</span>
          </div>
          <p className="text-secondary-400 mb-6">
            Empowering mental health professionals with modern technology
          </p>
          <div className="flex justify-center space-x-6 text-sm text-secondary-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
