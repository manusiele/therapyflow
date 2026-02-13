'use client'

import { useState } from 'react'

interface AssessmentFormProps {
  assessmentType: string
  onSubmit: (responses: Record<string, any>) => void
}

export default function AssessmentForm({ assessmentType, onSubmit }: AssessmentFormProps) {
  const [responses, setResponses] = useState<Record<string, any>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(responses)
  }

  const questions = {
    'PHQ-9': [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep',
      'Feeling tired or having little energy'
    ],
    'GAD-7': [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing'
    ]
  }

  const currentQuestions = questions[assessmentType as keyof typeof questions] || []

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{assessmentType} Assessment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentQuestions.map((question, index) => (
          <div key={index} className="space-y-2">
            <p className="font-medium">{question}</p>
            <div className="flex space-x-4">
              {['Not at all', 'Several days', 'More than half', 'Nearly every day'].map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optionIndex}
                    onChange={(e) => setResponses({
                      ...responses,
                      [`question-${index}`]: parseInt(e.target.value)
                    })}
                    className="text-primary"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Submit Assessment
        </button>
      </form>
    </div>
  )
}