import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'

// Import recommendation metadata
const PILLAR_NAMES = {
  human: 'Human Vulnerability',
  infrastructure: 'Email Infrastructure',
  financial: 'Financial Process Controls',
}

// Simplified recommendation metadata (client-side)
const RECOMMENDATIONS = {
  q1: { title: 'Implement Regular Phishing Training', impact: 'HIGH', cost: 'LOW' },
  q2: { title: 'Run Phishing Simulations', impact: 'HIGH', cost: 'LOW' },
  q3: { title: 'Create Safe Reporting Culture', impact: 'MEDIUM', cost: 'FREE' },
  q4: { title: 'Update Controls After Incidents', impact: 'MEDIUM', cost: 'FREE' },
  q5: { title: 'Deploy Password Manager', impact: 'HIGH', cost: 'LOW' },
  q6: { title: 'Configure SPF Record', impact: 'HIGH', cost: 'FREE' },
  q7: { title: 'Enable DKIM Signing', impact: 'HIGH', cost: 'FREE' },
  q8: { title: 'Deploy DMARC Policy', impact: 'CRITICAL', cost: 'FREE' },
  q9: { title: 'Enforce DMARC (quarantine/reject)', impact: 'CRITICAL', cost: 'FREE' },
  q10: { title: 'Mandate MFA for Email', impact: 'CRITICAL', cost: 'FREE' },
  q11: { title: 'Phone Verify Banking Changes', impact: 'CRITICAL', cost: 'FREE' },
  q12: { title: 'Dual Approval for Large Payments', impact: 'HIGH', cost: 'FREE' },
  q13: { title: 'Cross-Channel Verification', impact: 'HIGH', cost: 'FREE' },
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const [exporting, setExporting] = useState(false)

  const { assessment, domain } = location.state || {}

  useEffect(() => {
    if (!assessment) {
      navigate('/')
    }
  }, [assessment, navigate])

  if (!assessment) {
    return null
  }

  const { totalScore, riskLevel, pillarBreakdown, questionResponses } = assessment

  // Generate recommendations from responses
  const recommendations = Object.entries(questionResponses)
    .filter(([_, value]) => value === 100)
    .map(([questionId]) => ({
      questionId,
      ...RECOMMENDATIONS[questionId],
    }))
    .sort((a, b) => {
      const impactOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
      return impactOrder[b.impact] - impactOrder[a.impact]
    })

  const topRecommendations = recommendations.slice(0, 3)

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW':
        return 'risk-badge-low'
      case 'MEDIUM':
        return 'risk-badge-medium'
      case 'HIGH':
        return 'risk-badge-high'
      default:
        return 'risk-badge-medium'
    }
  }

  const getRiskMessage = (level) => {
    switch (level) {
      case 'LOW':
        return 'Your organization has strong phishing controls in place. Continue monitoring and maintaining these standards.'
      case 'MEDIUM':
        return 'Your organization has exploitable gaps in phishing defenses. Address the recommendations below to reduce risk.'
      case 'HIGH':
        return 'Your organization is actively vulnerable to phishing attacks. Immediate action required on critical issues.'
      default:
        return ''
    }
  }

  const exportToPDF = () => {
    setExporting(true)
    
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      let yPos = 20

      // Header
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('CyberSafe-SA Phishing Readiness Report', pageWidth / 2, yPos, {
        align: 'center',
      })
      yPos += 10

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, {
        align: 'center',
      })
      yPos += 15

      if (domain) {
        doc.text(`Domain: ${domain}`, 20, yPos)
        yPos += 10
      }

      // Risk Score
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Overall Risk Assessment', 20, yPos)
      yPos += 10

      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total Risk Score: ${totalScore}/100`, 20, yPos)
      yPos += 7
      doc.text(`Risk Level: ${riskLevel}`, 20, yPos)
      yPos += 10

      doc.setFontSize(10)
      doc.text(getRiskMessage(riskLevel), 20, yPos, { maxWidth: pageWidth - 40 })
      yPos += 20

      // Pillar Breakdown
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Risk by Pillar', 20, yPos)
      yPos += 10

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      Object.entries(pillarBreakdown).forEach(([pillar, score]) => {
        doc.text(`${PILLAR_NAMES[pillar]}: ${score}/100`, 20, yPos)
        yPos += 7
      })
      yPos += 10

      // Top Recommendations
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Priority Recommendations', 20, yPos)
      yPos += 10

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      topRecommendations.forEach((rec, index) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}. ${rec.title}`, 20, yPos)
        yPos += 7
        
        doc.setFont('helvetica', 'normal')
        doc.text(`Impact: ${rec.impact} | Cost: ${rec.cost}`, 25, yPos)
        yPos += 10
      })

      // Footer
      yPos = doc.internal.pageSize.getHeight() - 20
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(
        'CyberSafe-SA | Zero Data Retention | POPIA Compliant',
        pageWidth / 2,
        yPos,
        { align: 'center' }
      )

      // Save
      doc.save(`CyberSafe-SA-Report-${Date.now()}.pdf`)
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Your Phishing Readiness Report</h1>
        {domain && (
          <p className="text-gray-600">
            Assessment for: <strong>{domain}</strong>
          </p>
        )}
      </div>

      {/* Risk Score Card */}
      <div className="card mb-8 text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Overall Risk Score</h2>
          <div className="text-7xl font-bold text-gray-900 mb-4">{totalScore}</div>
          <div className={getRiskColor(riskLevel)}>{riskLevel} RISK</div>
        </div>

        <div className="max-w-2xl mx-auto text-left bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-700">{getRiskMessage(riskLevel)}</p>
        </div>
      </div>

      {/* Pillar Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(pillarBreakdown).map(([pillar, score]) => (
          <div key={pillar} className="card">
            <h3 className="text-lg font-semibold mb-2">{PILLAR_NAMES[pillar]}</h3>
            <div className="text-4xl font-bold mb-2">{score}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  score <= 30
                    ? 'bg-green-500'
                    : score <= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Priority Recommendations */}
      {topRecommendations.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            🎯 Top 3 Priority Actions
          </h2>
          <p className="text-gray-600 mb-6">
            Address these high-impact issues first to significantly reduce your phishing risk.
          </p>

          <div className="space-y-4">
            {topRecommendations.map((rec, index) => (
              <div
                key={rec.questionId}
                className="border-l-4 border-sa-green bg-gray-50 p-4 rounded-r-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">
                    {index + 1}. {rec.title}
                  </h3>
                  <div className="flex space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        rec.impact === 'CRITICAL'
                          ? 'bg-red-100 text-red-700'
                          : rec.impact === 'HIGH'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {rec.impact}
                    </span>
                    <span className="px-2 py-1 text-xs font-bold rounded bg-green-100 text-green-700">
                      {rec.cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Issues */}
      {recommendations.length > 3 && (
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Additional Recommendations ({recommendations.length - 3})
          </h2>
          <ul className="space-y-2">
            {recommendations.slice(3).map((rec) => (
              <li key={rec.questionId} className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">{rec.title}</span>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded ${
                    rec.impact === 'CRITICAL'
                      ? 'bg-red-100 text-red-700'
                      : rec.impact === 'HIGH'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {rec.impact}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={exportToPDF}
          disabled={exporting}
          className="btn-primary"
        >
          {exporting ? 'Generating PDF...' : '📄 Export to PDF'}
        </button>
        <Link to="/" className="btn-secondary text-center">
          ← Start New Assessment
        </Link>
      </div>

      {/* Privacy Notice */}
      <div className="mt-12 bg-blue-50 border border-blue-200 px-4 py-3 rounded">
        <p className="text-sm text-gray-700">
          <strong>🔒 Privacy:</strong> This report was generated client-side. No data
          was stored on our servers. Save or export this report now - it will not be
          available later.
        </p>
      </div>
    </div>
  )
}
