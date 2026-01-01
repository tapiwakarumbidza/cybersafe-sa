import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// Question definitions matching scoring model v2.1
const QUESTIONS = {
  pillar1: {
    title: 'Pillar 1: Human Vulnerability (45%)',
    description: 'Staff awareness, training, and security culture',
    questions: [
      {
        id: 'q1',
        text: 'Does your organization conduct regular phishing awareness training for staff?',
        helpText: 'At least quarterly training sessions covering phishing recognition',
      },
      {
        id: 'q2',
        text: 'Have you conducted phishing simulations in the last 12 months?',
        helpText: 'Simulated phishing tests to measure staff response',
      },
      {
        id: 'q3',
        text: 'Do staff feel safe reporting suspicious emails without fear of blame?',
        helpText: 'Positive reporting culture where mistakes are learning opportunities',
      },
      {
        id: 'q4',
        text: 'Are security controls and training updated after phishing incidents?',
        helpText: 'Lessons learned from real attacks are incorporated into training',
      },
      {
        id: 'q5',
        text: 'Are unique passwords enforced (via policy or password manager)?',
        helpText: 'Staff cannot reuse the same password across multiple accounts',
      },
    ],
  },
  pillar2: {
    title: 'Pillar 2: Email Infrastructure (35%)',
    description: 'Technical email security controls',
    questions: [
      {
        id: 'q6',
        text: 'Is SPF (Sender Policy Framework) configured for your domain?',
        helpText: 'DNS record that specifies which servers can send email on your behalf',
        technical: true,
      },
      {
        id: 'q7',
        text: 'Is DKIM (DomainKeys Identified Mail) enabled?',
        helpText: 'Email signing to verify sender authenticity',
        technical: true,
      },
      {
        id: 'q8',
        text: 'Is DMARC (Domain-based Message Authentication) enabled?',
        helpText: 'Policy that tells receivers what to do with unauthenticated emails',
        technical: true,
      },
      {
        id: 'q9',
        text: 'Is your DMARC policy set to quarantine or reject (not just monitor)?',
        helpText: 'Enforced DMARC policy blocks suspicious emails',
        technical: true,
      },
      {
        id: 'q10',
        text: 'Is Multi-Factor Authentication (MFA) enforced on all email accounts?',
        helpText: 'Requires second verification method beyond password',
      },
    ],
  },
  pillar3: {
    title: 'Pillar 3: Financial Process Controls (20%)',
    description: 'Verification procedures for financial transactions',
    questions: [
      {
        id: 'q11',
        text: 'Do you require phone verification for banking detail changes?',
        helpText: 'Call back on known number before updating supplier/employee banking details',
      },
      {
        id: 'q12',
        text: 'Do payments above R10,000 require dual approval?',
        helpText: 'Two authorized people must approve large transactions',
      },
      {
        id: 'q13',
        text: 'Are urgent financial requests verified through a second channel?',
        helpText: 'Email request → verify by phone | WhatsApp → verify by email',
      },
    ],
  },
}

export default function Assessment() {
  const navigate = useNavigate()
  const location = useLocation()
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dnsChecking, setDnsChecking] = useState(false)
  
  const domain = location.state?.domain

  // Check DNS if domain provided
  useEffect(() => {
    if (domain) {
      checkDNS()
    }
  }, [domain])

  const checkDNS = async () => {
    setDnsChecking(true)
    setError('')
    
    try {
      const response = await fetch('/api/dns-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'DNS check failed')
      }

      // Auto-fill technical questions based on DNS results
      setResponses((prev) => ({
        ...prev,
        q6: data.spf?.exists && data.spf?.valid ? 0 : 100,
        q7: data.dkim?.exists && data.dkim?.valid ? 0 : 100,
        q8: data.dmarc?.exists && data.dmarc?.valid ? 0 : 100,
        q9:
          data.dmarc?.policy === 'quarantine' || data.dmarc?.policy === 'reject'
            ? 0
            : 100,
      }))
    } catch (err) {
      setError(`DNS check failed: ${err.message}. You can still answer questions manually.`)
    } finally {
      setDnsChecking(false)
    }
  }

  const handleAnswer = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const isComplete = () => {
    const allQuestionIds = Object.values(QUESTIONS)
      .flatMap((pillar) => pillar.questions.map((q) => q.id))
    
    return allQuestionIds.every((id) => responses[id] !== undefined)
  }

  const handleSubmit = async () => {
    if (!isComplete()) {
      setError('Please answer all questions before submitting.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)
    setError('')

    try {
      // Separate user responses from technical checks
      const userResponses = {}
      const technicalChecks = {}

      Object.entries(responses).forEach(([key, value]) => {
        if (['q6', 'q7', 'q8', 'q9'].includes(key)) {
          technicalChecks[key] = value
        } else {
          userResponses[key] = value
        }
      })

      const response = await fetch('/api/calculate-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userResponses, technicalChecks }),
      })

      // CRITICAL FIX: Parse JSON only after checking response status
      if (!response.ok) {
        let errorMessage = 'Risk calculation failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If JSON parsing fails, use generic error
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const assessment = await response.json()

      // Navigate to results with assessment data
      navigate('/results', { state: { assessment, domain } })
    } catch (err) {
      setError(`Failed to calculate risk: ${err.message}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  const getProgress = () => {
    const total = Object.values(QUESTIONS)
      .flatMap((pillar) => pillar.questions)
      .length
    const answered = Object.keys(responses).length
    return Math.round((answered / total) * 100)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Phishing Readiness Assessment</h1>
        <p className="text-gray-600">
          Answer 13 questions to assess your organization's vulnerability to phishing attacks
        </p>
        
        {domain && (
          <div className="mt-4 bg-green-50 border border-green-200 px-4 py-3 rounded">
            <p className="text-sm text-gray-700">
              <strong>Domain:</strong> {domain} 
              {dnsChecking && <span className="ml-2">- Checking DNS records...</span>}
              {!dnsChecking && <span className="ml-2 text-green-600">✓ DNS checked</span>}
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{getProgress()}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-sa-green h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Questions by Pillar */}
      {Object.entries(QUESTIONS).map(([pillarKey, pillar]) => (
        <div key={pillarKey} className="card mb-8">
          <h2 className="text-2xl font-semibold mb-2">{pillar.title}</h2>
          <p className="text-gray-600 mb-6">{pillar.description}</p>

          {pillar.questions.map((question) => (
            <div key={question.id} className="mb-8 pb-8 border-b last:border-b-0 last:mb-0 last:pb-0">
              <div className="mb-3">
                <label className="block text-lg font-medium text-gray-900 mb-2">
                  {question.text}
                </label>
                <p className="text-sm text-gray-600">{question.helpText}</p>
                {question.technical && !domain && (
                  <p className="text-sm text-yellow-600 mt-1">
                    💡 Tip: Provide a domain on the home page to auto-check this
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleAnswer(question.id, 0)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    responses[question.id] === 0
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                  }`}
                  disabled={dnsChecking}
                >
                  ✓ Yes
                </button>
                <button
                  onClick={() => handleAnswer(question.id, 100)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    responses[question.id] === 100
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                  }`}
                  disabled={dnsChecking}
                >
                  ✗ No / Unsure
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!isComplete() || loading}
          className="btn-primary text-xl px-12 py-4"
        >
          {loading ? 'Calculating...' : 'Calculate Risk Score →'}
        </button>
        
        {!isComplete() && (
          <p className="text-sm text-gray-500 mt-4">
            Please answer all questions to continue
          </p>
        )}
      </div>
    </div>
  )
}
