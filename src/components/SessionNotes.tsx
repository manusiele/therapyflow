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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Session Notes</h2>
      <div className="space-y-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter session notes here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Session ID: {sessionId}
          </p>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </div>
    </div>
  )
}