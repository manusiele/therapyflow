'use client'

import { useState } from 'react'

interface SessionNotesProps {
  sessionId: string
  initialNotes?: string
  onSave: (notes: string) => void
}

export default function SessionNotes({ sessionId, initialNotes = '', onSave }: SessionNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(notes)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Session Notes</h2>
          <p className="text-secondary-600 mt-1">Session ID: {sessionId}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-secondary-500">Auto-saved</span>
          <div className="w-2 h-2 bg-success rounded-full"></div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">
            Clinical Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter detailed session notes, observations, treatment progress, and next steps..."
            className="input-field h-64 resize-none"
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Session Goals
            </label>
            <textarea
              placeholder="What were the primary goals for this session?"
              className="input-field h-24 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-3">
              Homework/Action Items
            </label>
            <textarea
              placeholder="Assignments or tasks for the patient to complete..."
              className="input-field h-24 resize-none"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <div className="flex items-center space-x-4">
            <select className="input-field w-auto">
              <option>Session Type: Individual</option>
              <option>Session Type: Group</option>
              <option>Session Type: Couples</option>
              <option>Session Type: Family</option>
            </select>
            <select className="input-field w-auto">
              <option>Duration: 50 minutes</option>
              <option>Duration: 60 minutes</option>
              <option>Duration: 90 minutes</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button className="btn-secondary">
              Save Draft
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Complete Session'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}