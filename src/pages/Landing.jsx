import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')

  const handleStart = () => {
    // Optional domain - can skip directly to assessment
    navigate('/assessment', { state: { domain: domain || null } })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleStart()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-block w-20 h-20 bg-sa-green rounded-full flex items-center justify-center">
            <span className="text-white text-5xl">🛡️</span>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          CyberSafe-SA
        </h1>
        
        <p className="text-2xl text-gray-600 mb-8">
          How likely is your organization to be phished in the next 90 days?
        </p>
        
        <div className="max-w-2xl mx-auto text-left bg-blue-50 border-l-4 border-sa-blue p-6 rounded-r-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🎯 Built for South African SMEs
          </h3>
          <ul className="text-gray-700 space-y-2">
            <li>✓ Free phishing readiness assessment (13 questions)</li>
            <li>✓ Checks email security (SPF, DKIM, DMARC)</li>
            <li>✓ Actionable recommendations prioritized by impact</li>
            <li>✓ Zero data storage - POPIA compliant by design</li>
          </ul>
        </div>
      </div>

      {/* Domain Input (Optional) */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Step 1: Email Domain (Optional)
        </h2>
        
        <p className="text-gray-600 mb-4">
          Enter your organization's email domain to check technical security controls.
          We'll verify SPF, DKIM, and DMARC records.
        </p>
        
        <div className="mb-4">
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
            Email Domain
          </label>
          <input
            type="text"
            id="domain"
            className="input-field"
            placeholder="example.co.za"
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value)
              setError('')
            }}
            onKeyPress={handleKeyPress}
          />
          <p className="text-sm text-gray-500 mt-2">
            Example: <code className="bg-gray-100 px-2 py-1 rounded">yourcompany.co.za</code>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-yellow-50 border border-yellow-200 px-4 py-3 rounded mb-4">
          <p className="text-sm text-gray-700">
            <strong>Skip this step?</strong> You can complete the assessment without a domain.
            You'll just need to answer technical questions manually.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={handleStart}
          className="btn-primary text-xl px-12 py-4"
        >
          Start Assessment →
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          Takes 5-7 minutes | No account required
        </p>
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <div className="card text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-lg font-semibold mb-2">Zero Data Storage</h3>
          <p className="text-gray-600 text-sm">
            Your responses are never saved. Results exist only in your browser.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-3">⚖️</div>
          <h3 className="text-lg font-semibold mb-2">POPIA Compliant</h3>
          <p className="text-gray-600 text-sm">
            No personal data collected. No consent banner needed.
          </p>
        </div>
        
        <div className="card text-center">
          <div className="text-4xl mb-3">🇿🇦</div>
          <h3 className="text-lg font-semibold mb-2">SA Threat Focus</h3>
          <p className="text-gray-600 text-sm">
            Tailored to invoice fraud, CEO impersonation, and WhatsApp scams.
          </p>
        </div>
      </div>
    </div>
  )
}
