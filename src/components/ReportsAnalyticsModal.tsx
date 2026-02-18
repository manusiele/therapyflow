'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { sessions, patients, therapists } from '@/lib/supabase'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ReportsAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  userRole: 'therapist' | 'patient'
}

export default function ReportsAnalyticsModal({ 
  isOpen, 
  onClose,
  userRole 
}: ReportsAnalyticsModalProps) {
  const { user } = useAuth()
  const [selectedReport, setSelectedReport] = useState<string>('overview')
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf')
  const [isLoading, setIsLoading] = useState(true)

  // Real data from Supabase
  const [therapistStats, setTherapistStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    cancelledSessions: 0,
    activePatients: 0,
    averageSessionDuration: 0,
    attendanceRate: 0,
    revenue: 0,
    hoursWorked: 0
  })

  const [patientStats, setPatientStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    missedSessions: 0,
    assessmentScores: {
      phq9: [] as number[],
      gad7: [] as number[]
    },
    moodTrend: 'stable',
    adherenceRate: 0
  })

  // Fetch therapist stats
  useEffect(() => {
    const fetchTherapistStats = async () => {
      if (!isOpen || userRole !== 'therapist' || !user?.id) return

      setIsLoading(true)
      try {
        // Fetch all sessions for therapist
        const { data: sessionsData, error: sessionsError } = await sessions.getAll({ 
          therapistId: user.id 
        })

        if (sessionsError) {
          console.error('Error fetching sessions:', sessionsError)
          return
        }

        // Fetch all patients for therapist
        const { data: patientsData, error: patientsError } = await patients.getAll(user.id)

        if (patientsError) {
          console.error('Error fetching patients:', patientsError)
          return
        }

        if (sessionsData && patientsData) {
          const allSessions = sessionsData as any[]
          const totalSessions = allSessions.length
          const completedSessions = allSessions.filter(s => s.status === 'completed').length
          const cancelledSessions = allSessions.filter(s => s.status === 'cancelled').length
          const activePatients = patientsData.length

          // Calculate average session duration
          const totalDuration = allSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
          const averageSessionDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0

          // Calculate attendance rate
          const scheduledSessions = allSessions.filter(s => s.status !== 'cancelled').length
          const attendanceRate = scheduledSessions > 0 
            ? Math.round((completedSessions / scheduledSessions) * 100) 
            : 0

          // Calculate revenue (assuming $100 per session - adjust as needed)
          const revenue = completedSessions * 100

          // Calculate hours worked
          const hoursWorked = Math.round(totalDuration / 60)

          setTherapistStats({
            totalSessions,
            completedSessions,
            cancelledSessions,
            activePatients,
            averageSessionDuration,
            attendanceRate,
            revenue,
            hoursWorked
          })
        }
      } catch (err) {
        console.error('Error loading therapist stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTherapistStats()
  }, [isOpen, userRole, user])

  // Fetch patient stats
  useEffect(() => {
    const fetchPatientStats = async () => {
      if (!isOpen || userRole !== 'patient' || !user?.email) return

      setIsLoading(true)
      try {
        // Get patient data
        const { data: patientData, error: patientError } = await patients.getByEmail(user.email)

        if (patientError || !patientData) {
          console.error('Error fetching patient:', patientError)
          return
        }

        const patientId = (patientData as any).id

        // Fetch sessions for patient
        const { data: sessionsData, error: sessionsError } = await sessions.getAll({ 
          patientId 
        })

        if (sessionsError) {
          console.error('Error fetching sessions:', sessionsError)
          return
        }

        if (sessionsData) {
          const allSessions = sessionsData as any[]
          const totalSessions = allSessions.length
          const completedSessions = allSessions.filter(s => s.status === 'completed').length
          const missedSessions = allSessions.filter(s => s.status === 'cancelled').length

          // Calculate adherence rate
          const scheduledSessions = allSessions.filter(s => s.status !== 'cancelled').length
          const adherenceRate = scheduledSessions > 0 
            ? Math.round((completedSessions / scheduledSessions) * 100) 
            : 0

          setPatientStats({
            totalSessions,
            completedSessions,
            missedSessions,
            assessmentScores: {
              phq9: [],
              gad7: []
            },
            moodTrend: adherenceRate > 80 ? 'improving' : 'stable',
            adherenceRate
          })
        }
      } catch (err) {
        console.error('Error loading patient stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatientStats()
  }, [isOpen, userRole, user])

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      exportToPDF()
    } else if (exportFormat === 'csv') {
      exportToCSV()
    } else if (exportFormat === 'excel') {
      exportToExcel()
    }
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const currentDate = new Date().toLocaleDateString()
    
    // Add header
    doc.setFontSize(20)
    doc.text('TherapyFlow Report', 14, 20)
    doc.setFontSize(10)
    doc.text(`Generated: ${currentDate}`, 14, 28)
    doc.text(`Report Type: ${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)}`, 14, 34)
    doc.text(`Date Range: ${dateRange}`, 14, 40)
    
    if (userRole === 'therapist') {
      // Therapist report
      doc.setFontSize(14)
      doc.text('Practice Overview', 14, 52)
      
      // Stats table
      autoTable(doc, {
        startY: 58,
        head: [['Metric', 'Value']],
        body: [
          ['Total Sessions', therapistStats.totalSessions.toString()],
          ['Completed Sessions', therapistStats.completedSessions.toString()],
          ['Cancelled Sessions', therapistStats.cancelledSessions.toString()],
          ['Active Patients', therapistStats.activePatients.toString()],
          ['Average Session Duration', `${therapistStats.averageSessionDuration} min`],
          ['Attendance Rate', `${therapistStats.attendanceRate}%`],
          ['Revenue', `$${therapistStats.revenue.toLocaleString()}`],
          ['Hours Worked', `${therapistStats.hoursWorked} hrs`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      })
      
      // Session trends table
      doc.addPage()
      doc.setFontSize(14)
      doc.text('Session Trends', 14, 20)
      
      autoTable(doc, {
        startY: 28,
        head: [['Month', 'Total', 'Completed', 'Cancelled']],
        body: sessionTrendsData.map(item => [
          item.month,
          item.sessions.toString(),
          item.completed.toString(),
          item.cancelled.toString()
        ]),
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      })
      
    } else {
      // Patient report
      doc.setFontSize(14)
      doc.text('Your Progress Overview', 14, 52)
      
      autoTable(doc, {
        startY: 58,
        head: [['Metric', 'Value']],
        body: [
          ['Total Sessions', patientStats.totalSessions.toString()],
          ['Completed Sessions', patientStats.completedSessions.toString()],
          ['Missed Sessions', patientStats.missedSessions.toString()],
          ['Adherence Rate', `${patientStats.adherenceRate}%`],
          ['Mood Trend', patientStats.moodTrend],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      })
      
      // Assessment scores table
      doc.addPage()
      doc.setFontSize(14)
      doc.text('Assessment Score Trends', 14, 20)
      
      autoTable(doc, {
        startY: 28,
        head: [['Week', 'PHQ-9', 'GAD-7']],
        body: assessmentScoresData.map(item => [
          item.week,
          item.phq9.toString(),
          item.gad7.toString()
        ]),
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      })
    }
    
    // Save the PDF
    doc.save(`therapyflow-report-${selectedReport}-${currentDate}.pdf`)
  }

  const exportToCSV = () => {
    let csvContent = ''
    const currentDate = new Date().toLocaleDateString()
    
    if (userRole === 'therapist') {
      // Therapist CSV
      csvContent = 'TherapyFlow Therapist Report\n'
      csvContent += `Generated: ${currentDate}\n`
      csvContent += `Report Type: ${selectedReport}\n`
      csvContent += `Date Range: ${dateRange}\n\n`
      
      csvContent += 'Practice Overview\n'
      csvContent += 'Metric,Value\n'
      csvContent += `Total Sessions,${therapistStats.totalSessions}\n`
      csvContent += `Completed Sessions,${therapistStats.completedSessions}\n`
      csvContent += `Cancelled Sessions,${therapistStats.cancelledSessions}\n`
      csvContent += `Active Patients,${therapistStats.activePatients}\n`
      csvContent += `Average Session Duration,${therapistStats.averageSessionDuration} min\n`
      csvContent += `Attendance Rate,${therapistStats.attendanceRate}%\n`
      csvContent += `Revenue,$${therapistStats.revenue}\n`
      csvContent += `Hours Worked,${therapistStats.hoursWorked} hrs\n\n`
      
      csvContent += 'Session Trends\n'
      csvContent += 'Month,Total,Completed,Cancelled\n'
      sessionTrendsData.forEach(item => {
        csvContent += `${item.month},${item.sessions},${item.completed},${item.cancelled}\n`
      })
    } else {
      // Patient CSV
      csvContent = 'TherapyFlow Patient Report\n'
      csvContent += `Generated: ${currentDate}\n`
      csvContent += `Report Type: ${selectedReport}\n`
      csvContent += `Date Range: ${dateRange}\n\n`
      
      csvContent += 'Progress Overview\n'
      csvContent += 'Metric,Value\n'
      csvContent += `Total Sessions,${patientStats.totalSessions}\n`
      csvContent += `Completed Sessions,${patientStats.completedSessions}\n`
      csvContent += `Missed Sessions,${patientStats.missedSessions}\n`
      csvContent += `Adherence Rate,${patientStats.adherenceRate}%\n`
      csvContent += `Mood Trend,${patientStats.moodTrend}\n\n`
      
      csvContent += 'Assessment Scores\n'
      csvContent += 'Week,PHQ-9,GAD-7\n'
      assessmentScoresData.forEach(item => {
        csvContent += `${item.week},${item.phq9},${item.gad7}\n`
      })
    }
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `therapyflow-report-${selectedReport}-${currentDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    // For Excel, we'll use CSV format with .xls extension
    // For a proper Excel file, you'd need a library like xlsx
    let csvContent = ''
    const currentDate = new Date().toLocaleDateString()
    
    if (userRole === 'therapist') {
      csvContent = 'TherapyFlow Therapist Report\n'
      csvContent += `Generated: ${currentDate}\n`
      csvContent += `Report Type: ${selectedReport}\n`
      csvContent += `Date Range: ${dateRange}\n\n`
      
      csvContent += 'Practice Overview\n'
      csvContent += 'Metric\tValue\n'
      csvContent += `Total Sessions\t${therapistStats.totalSessions}\n`
      csvContent += `Completed Sessions\t${therapistStats.completedSessions}\n`
      csvContent += `Cancelled Sessions\t${therapistStats.cancelledSessions}\n`
      csvContent += `Active Patients\t${therapistStats.activePatients}\n`
      csvContent += `Average Session Duration\t${therapistStats.averageSessionDuration} min\n`
      csvContent += `Attendance Rate\t${therapistStats.attendanceRate}%\n`
      csvContent += `Revenue\t$${therapistStats.revenue}\n`
      csvContent += `Hours Worked\t${therapistStats.hoursWorked} hrs\n\n`
      
      csvContent += 'Session Trends\n'
      csvContent += 'Month\tTotal\tCompleted\tCancelled\n'
      sessionTrendsData.forEach(item => {
        csvContent += `${item.month}\t${item.sessions}\t${item.completed}\t${item.cancelled}\n`
      })
    } else {
      csvContent = 'TherapyFlow Patient Report\n'
      csvContent += `Generated: ${currentDate}\n`
      csvContent += `Report Type: ${selectedReport}\n`
      csvContent += `Date Range: ${dateRange}\n\n`
      
      csvContent += 'Progress Overview\n'
      csvContent += 'Metric\tValue\n'
      csvContent += `Total Sessions\t${patientStats.totalSessions}\n`
      csvContent += `Completed Sessions\t${patientStats.completedSessions}\n`
      csvContent += `Missed Sessions\t${patientStats.missedSessions}\n`
      csvContent += `Adherence Rate\t${patientStats.adherenceRate}%\n`
      csvContent += `Mood Trend\t${patientStats.moodTrend}\n\n`
      
      csvContent += 'Assessment Scores\n'
      csvContent += 'Week\tPHQ-9\tGAD-7\n'
      assessmentScoresData.forEach(item => {
        csvContent += `${item.week}\t${item.phq9}\t${item.gad7}\n`
      })
    }
    
    // Download as Excel-compatible file
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `therapyflow-report-${selectedReport}-${currentDate}.xls`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Mock chart data for visualization
  const sessionTrendsData = [
    { month: 'Jan', sessions: 45, completed: 42, cancelled: 3 },
    { month: 'Feb', sessions: 52, completed: 48, cancelled: 4 },
    { month: 'Mar', sessions: 48, completed: 45, cancelled: 3 },
    { month: 'Apr', sessions: 58, completed: 54, cancelled: 4 },
    { month: 'May', sessions: 62, completed: 58, cancelled: 4 },
    { month: 'Jun', sessions: 55, completed: 51, cancelled: 4 },
  ]

  const revenueData = [
    { month: 'Jan', revenue: 4500, expenses: 1200 },
    { month: 'Feb', revenue: 5200, expenses: 1300 },
    { month: 'Mar', revenue: 4800, expenses: 1250 },
    { month: 'Apr', revenue: 5800, expenses: 1400 },
    { month: 'May', revenue: 6200, expenses: 1450 },
    { month: 'Jun', revenue: 5500, expenses: 1350 },
  ]

  const assessmentScoresData = [
    { week: 'Week 1', phq9: 15, gad7: 16 },
    { week: 'Week 2', phq9: 13, gad7: 14 },
    { week: 'Week 3', phq9: 11, gad7: 12 },
    { week: 'Week 4', phq9: 9, gad7: 10 },
    { week: 'Week 5', phq9: 8, gad7: 9 },
    { week: 'Week 6', phq9: 7, gad7: 8 },
  ]

  const moodTrendsData = [
    { day: 'Mon', mood: 6 },
    { day: 'Tue', mood: 7 },
    { day: 'Wed', mood: 5 },
    { day: 'Thu', mood: 8 },
    { day: 'Fri', mood: 7 },
    { day: 'Sat', mood: 8 },
    { day: 'Sun', mood: 9 },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-700/50">
        {/* Header - Subtle Dark Theme */}
        <div className="px-6 py-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Reports & Analytics</h2>
            <p className="text-sm text-slate-400 mt-1">
              {userRole === 'therapist' ? 'Practice insights and performance metrics' : 'Your progress and wellness journey'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex bg-slate-900/50">
          {/* Sidebar - Subtle Dark Theme */}
          <div className="w-64 border-r border-slate-700/50 p-4 overflow-y-auto bg-slate-800/40">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedReport('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedReport === 'overview'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'hover:bg-slate-700/30 text-slate-300 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium">Overview</span>
                </div>
              </button>

              {userRole === 'therapist' ? (
                <>
                  <button
                    onClick={() => setSelectedReport('sessions')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedReport === 'sessions'
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'hover:bg-slate-700/30 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Sessions</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedReport('patients')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedReport === 'patients'
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'hover:bg-slate-700/30 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Patients</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedReport('revenue')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedReport === 'revenue'
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'hover:bg-slate-700/30 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Revenue</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedReport('progress')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedReport === 'progress'
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'hover:bg-slate-700/30 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="font-medium">Progress</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedReport('assessments')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedReport === 'assessments'
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'hover:bg-slate-700/30 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="font-medium">Assessments</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedReport('mood')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedReport === 'mood'
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'hover:bg-slate-700/30 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Mood Trends</span>
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Date Range Selector */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-600/50 rounded-lg bg-slate-700/50 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            {/* Export Button */}
            <div className="mt-4">
              <button
                onClick={handleExport}
                className="w-full bg-blue-600/80 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Report</span>
              </button>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="w-full mt-2 px-3 py-2 border border-slate-600/50 rounded-lg bg-slate-700/50 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
          </div>

          {/* Main Content - Subtle Dark Theme */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedReport === 'overview' && userRole === 'therapist' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-100">Practice Overview</h3>
                
                {/* Stats Grid - Subtle Muted Colors */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-5 border border-slate-600/30 text-center">
                    <div className="text-2xl font-bold text-slate-200">{therapistStats.totalSessions}</div>
                    <div className="text-sm text-slate-400 mt-1">Total<br/>Sessions</div>
                  </div>
                  <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-5 border border-slate-600/30 text-center">
                    <div className="text-2xl font-bold text-emerald-500">{therapistStats.activePatients}</div>
                    <div className="text-sm text-slate-400 mt-1">Active<br/>Patients</div>
                  </div>
                  <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-5 border border-slate-600/30 text-center">
                    <div className="text-2xl font-bold text-purple-400">{therapistStats.attendanceRate}%</div>
                    <div className="text-sm text-slate-400 mt-1">Attendance<br/>Rate</div>
                  </div>
                  <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-5 border border-slate-600/30 text-center">
                    <div className="text-2xl font-bold text-amber-500">${therapistStats.revenue.toLocaleString()}</div>
                    <div className="text-sm text-slate-400 mt-1">Revenue</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-6 border border-slate-600/30">
                  <h4 className="font-semibold text-slate-100 mb-4">Session Trends</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sessionTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#e2e8f0'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="sessions" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Total Sessions"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="completed" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Completed"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cancelled" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          name="Cancelled"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-6 border border-slate-600/30">
                  <h4 className="font-semibold text-slate-100 mb-4">Revenue Overview</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#e2e8f0'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#f59e0b" name="Revenue" />
                        <Bar dataKey="expenses" fill="#6366f1" name="Expenses" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'overview' && userRole === 'patient' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-100">Your Progress Overview</h3>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-5 border border-slate-600/30 text-center">
                    <div className="text-2xl font-bold text-slate-200">{patientStats.completedSessions}</div>
                    <div className="text-sm text-slate-400 mt-1">Sessions<br/>Completed</div>
                  </div>
                  <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-5 border border-slate-600/30 text-center">
                    <div className="text-2xl font-bold text-emerald-500">{patientStats.adherenceRate}%</div>
                    <div className="text-sm text-slate-400 mt-1">Adherence<br/>Rate</div>
                  </div>
                  <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-5 border border-slate-600/30 text-center">
                    <div className="text-2xl font-bold text-slate-200 capitalize">{patientStats.moodTrend}</div>
                    <div className="text-sm text-slate-400 mt-1">Mood<br/>Trend</div>
                  </div>
                </div>

                {/* Progress Chart */}
                <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-6 border border-slate-600/30">
                  <h4 className="font-semibold text-slate-100 mb-4">Assessment Score Trends</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={assessmentScoresData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                        <XAxis dataKey="week" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" domain={[0, 20]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#e2e8f0'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="phq9" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="PHQ-9 (Depression)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="gad7" 
                          stroke="#a855f7" 
                          strokeWidth={2}
                          name="GAD-7 (Anxiety)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">Lower scores indicate improvement</p>
                </div>

                {/* Mood Trends Chart */}
                <div className="bg-slate-700/30 backdrop-blur-md rounded-xl p-6 border border-slate-600/30">
                  <h4 className="font-semibold text-slate-100 mb-4">Weekly Mood Trends</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={moodTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
                        <XAxis dataKey="day" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" domain={[0, 10]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            color: '#e2e8f0'
                          }}
                        />
                        <Bar dataKey="mood" fill="#10b981" name="Mood Rating" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">Scale: 1 (Poor) to 10 (Excellent)</p>
                </div>
              </div>
            )}

            {/* Other report types would be rendered here */}
            {selectedReport !== 'overview' && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <svg className="w-20 h-20 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium text-slate-300">Report: {selectedReport}</p>
                  <p className="text-sm mt-2 text-slate-500">Detailed {selectedReport} analytics would appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
