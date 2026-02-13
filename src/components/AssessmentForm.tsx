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
      'Trouble falling or staying asleep, or sleeping too much',
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
  const options = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">{assessmentType} Assessment</h2>
        <p className="text-secondary-600">
          Over the last 2 weeks, how often have you been bothered by any of the following problems?
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {currentQuestions.map((question, index) => (
          <div key={index} className="space-y-4">
            <p className="font-medium text-secondary-900 text-lg">{index + 1}. {question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {options.map((option, optionIndex) => (
                <label 
                  key={optionIndex} 
                  className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    responses[`question-${index}`] === optionIndex
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optionIndex}
                    onChange={(e) => setResponses({
                      ...responses,
                      [`question-${index}`]: parseInt(e.target.value)
                    })}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-secondary-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-8 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-secondary-600">
              Complete all questions to submit your assessment
            </div>
            <button
              type="submit"
              disabled={Object.keys(responses).length < currentQuestions.length}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Assessment
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}