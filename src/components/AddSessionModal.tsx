'use client'

import { useState, useEffect } from 'react'
import { patients } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface AddSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (sessionData: SessionFormData) => void
  editSession?: Session | null
}

export interface SessionFormData {
  patient_id: string
  session_type: string
  scheduled_at: string
  duration_minutes: number
  notes: string
}

interface Session {
  id: string
  patient: string
  type: string
  time: string
  duration: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  notes?: string
}

interface Patient {
  id: string
  name: string
}

export default function AddSessionModal({ isOpen, onClose, onSubmit, editSession }: AddSessionModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<SessionFormData>({
    patient_id: '',
    session_type: 'individual',
    scheduled_at: '',
    duration_minutes: 50,
    notes: ''
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SessionFormData, string>>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [patientsList, setPatientsList] = useState<Patient[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)

  // Fetch patients from database
  useEffect(() => {
    const fetchPatients = async () => {
      if (!user) return
      
      try {
        setIsLoadingPatients(true)
        const { data, error } = await patients.getAll()
        
        if (error) {
          console.error('Error fetching patients:', error)
          return
        }

        if (data) {
          setPatientsList(data.map((p: any) => ({
            id: p.id,
            name: p.name
          })))
        }
      } catch (err) {
        console.error('Error loading patients:', err)
      } finally {
        setIsLoadingPatients(false)
      }
    }

    if (isOpen) {
      fetchPatients()
    }
  }, [isOpen, user])

  const sessionTypes = [
    'Individual Therapy',
    'Couples Therapy',
    'Family Therapy',
    'Group Therapy',
    'Initial Consultation',
    'Follow-up',
  ]

  const durations = [30, 45, 50, 60, 90, 120]

  // Populate form when editing
  useEffect(() => {
    if (editSession && patientsList.length > 0) {
      // Find patient ID by name
      const patient = patientsList.find(p => p.name === editSession.patient)
      
      // Convert time to datetime-local format
      const today = new Date().toISOString().split('T')[0]
      const timeStr = editSession.time
      const [time, period] = timeStr.split(' ')
      let [hours, minutes] = time.split(':').map(Number)
      
      if (period === 'PM' && hours !== 12) hours += 12
      if (period === 'AM' && hours === 12) hours = 0
      
      const scheduled_at = `${today}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      
      // Convert duration to minutes
      const duration_minutes = parseInt(editSession.duration)
      
      setFormData({
        patient_id: patient?.id || '',
        session_type: editSession.type.toLowerCase().replace(/ /g, '_'),
        scheduled_at,
        duration_minutes,
        notes: editSession.notes || ''
      })
    } else {
      // Reset form for new session
      setFormData({
        patient_id: '',
        session_type: 'individual',
        scheduled_at: '',
        duration_minutes: 50,
        notes: ''
      })
    }
    setErrors({})
    setIsDirty(false)
  }, [editSession, isOpen, patientsList])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SessionFormData, string>> = {}
    
    if (!formData.patient_id) {
      newErrors.patient_id = 'Please select a patient'
    }
    
    if (!formData.scheduled_at) {
      newErrors.scheduled_at = 'Please select a date and time'
    } else if (!editSession) {
      // Only validate future dates for new sessions
      const selectedDate = new Date(formData.scheduled_at)
      const now = new Date()
      if (selectedDate < now) {
        newErrors.scheduled_at = 'Cannot schedule sessions in the past'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    onSubmit(formData)
    setIsDirty(false)
    
    // Reset form
    setFormData({
      patient_id: '',
      session_type: 'individual',
      scheduled_at: '',
      duration_minutes: 50,
      notes: ''
    })
    setErrors({})
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setIsDirty(true)
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_minutes' ? parseInt(value) : value
    }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof SessionFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleClose = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        setIsDirty(false)
        setErrors({})
        onClose()
      }
    } else {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {editSession ? 'Edit Session' : 'Schedule New Session'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {editSession ? 'Update session details' : 'Add a new therapy session to your calendar'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* Patient Selection */}
              <div>
                <label htmlFor="patient_id" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Patient <span className="text-red-500">*</span>
                </label>
                <select
                  id="patient_id"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.patient_id 
                      ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  } text-slate-900 dark:text-slate-100`}
                  aria-invalid={!!errors.patient_id}
                  aria-describedby={errors.patient_id ? 'patient-error' : undefined}
                  disabled={isLoadingPatients}
                >
                  <option value="">
                    {isLoadingPatients ? 'Loading patients...' : 'Select a patient'}
                  </option>
                  {patientsList.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
                {errors.patient_id && (
                  <p id="patient-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.patient_id}
                  </p>
                )}
              </div>

              {/* Session Type */}
              <div>
                <label htmlFor="session_type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Session Type
                </label>
                <select
                  id="session_type"
                  name="session_type"
                  value={formData.session_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {sessionTypes.map(type => (
                    <option key={type} value={type.toLowerCase().replace(/ /g, '_')}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scheduled_at" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduled_at"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleChange}
                    required
                    min={editSession ? undefined : new Date().toISOString().slice(0, 16)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.scheduled_at 
                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                    } text-slate-900 dark:text-slate-100`}
                    aria-invalid={!!errors.scheduled_at}
                    aria-describedby={errors.scheduled_at ? 'datetime-error' : undefined}
                  />
                  {errors.scheduled_at && (
                    <p id="datetime-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                      {errors.scheduled_at}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="duration_minutes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="duration_minutes"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration}>
                        {duration} minutes
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  placeholder="Add any additional notes or preparation details..."
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500 text-right">
                  {formData.notes.length}/500 characters
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {editSession ? 'Update Session' : 'Schedule Session'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
