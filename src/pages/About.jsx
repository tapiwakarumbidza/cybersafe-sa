export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">About CyberSafe-SA</h1>

      {/* Creator Attribution */}
      <div className="card mb-8 bg-gradient-to-r from-sa-green/10 to-sa-gold/10 border-2 border-sa-gold">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">👨‍💻</div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Created by Tapiwa Karumbidza</h3>
            <p className="text-gray-700 mt-1">
              Built as a portfolio project to demonstrate full-stack security engineering. 
              CyberSafe-SA combines frontend development, backend API design, DNS verification, 
              and security principles into a production-ready assessment tool.
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          CyberSafe-SA provides a free, privacy-first phishing readiness assessment
          specifically for <strong>South African </strong> organizations. 
          We help SMEs, NGOs, schools, and clinics understand their vulnerability to 
          phishing attacks and take action before incidents occur.
        </p>
        <p className="text-gray-700">
          <strong>Core Question:</strong> How likely is your organization to suffer
          financial or data loss due to phishing in the next 90 days?
        </p>
      </div>

      {/* How It Works */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Assessment Model (v2.1)</h3>
            <p className="text-gray-700 mb-2">
              Our scoring model evaluates three pillars:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><strong>Human Vulnerability (45%):</strong> Staff awareness, training, reporting culture</li>
              <li><strong>Email Infrastructure (35%):</strong> SPF, DKIM, DMARC, MFA controls</li>
              <li><strong>Financial Process Controls (20%):</strong> Verification procedures for transactions</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">2. Technical Verification</h3>
            <p className="text-gray-700">
              If you provide your email domain, we automatically check DNS records for
              SPF, DKIM, and DMARC configuration. This eliminates guesswork and provides
              accurate technical scoring.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">3. Risk Scoring</h3>
            <p className="text-gray-700 mb-2">
              Your responses generate a risk score (0-100):
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li><strong>0-30 (LOW):</strong> Strong controls in place</li>
              <li><strong>31-60 (MEDIUM):</strong> Exploitable gaps exist</li>
              <li><strong>61-100 (HIGH):</strong> Active vulnerability</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">4. Actionable Recommendations</h3>
            <p className="text-gray-700">
              We prioritize recommendations by impact and cost, focusing on high-impact,
              low-cost improvements you can implement immediately.
            </p>
          </div>
        </div>
      </div>

      {/* SA Threat Context */}
      <div className="card mb-8 bg-yellow-50 border border-yellow-200">
        <h2 className="text-2xl font-semibold mb-4">🇿🇦 South African Threat Focus</h2>
        <p className="text-gray-700 mb-4">
          Our assessment is tailored to common phishing patterns targeting SA organizations:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>
            <strong>Invoice Fraud:</strong> Fake supplier emails with changed banking details
          </li>
          <li>
            <strong>CEO Impersonation:</strong> Urgent payment requests from spoofed executive emails
          </li>
          <li>
            <strong>SARS Scams:</strong> Fake tax refund or compliance emails
          </li>
          <li>
            <strong>WhatsApp Business Compromise:</strong> Attackers hijacking business WhatsApp accounts
          </li>
          <li>
            <strong>Banking Credential Theft:</strong> Fake Capitec, FNB, Standard Bank login pages
          </li>
        </ul>
      </div>

      {/* Privacy & Data Handling */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">🔒 Privacy & Data Handling</h2>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
          <p className="font-semibold text-green-800 mb-2">
            ✓ POPIA Compliant by Design
          </p>
          <p className="text-gray-700 text-sm">
            We comply with South Africa's Protection of Personal Information Act (POPIA)
            through zero data retention.
          </p>
        </div>

        <h3 className="text-xl font-semibold mb-3">What We DON'T Store:</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mb-4">
          <li>Domain names</li>
          <li>Email addresses</li>
          <li>Questionnaire responses</li>
          <li>Risk scores or assessment results</li>
          <li>IP addresses or user identifiers</li>
          <li>Any personal or organizational data</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3">How It Works:</h3>
        <p className="text-gray-700 mb-2">
          All assessment data is processed in-memory on our servers and immediately
          discarded. Results are transmitted to your browser and exist only there.
          When you close your browser tab, the data is gone forever.
        </p>
        <p className="text-gray-700">
          <strong>Export Tip:</strong> Use the PDF export feature to save your results
          locally before closing the page.
        </p>
      </div>

      {/* Legal Disclaimer */}
      <div className="card mb-8 bg-red-50 border border-red-200">
        <h2 className="text-2xl font-semibold mb-4">⚖️ Legal Disclaimer</h2>
        
        <div className="text-gray-700 space-y-3 text-sm">
          <p>
            <strong>Defensive Security Only:</strong> This tool is designed exclusively
            for defensive cybersecurity purposes. It assesses your own organization's
            readiness, not third-party systems.
          </p>
          
          <p>
            <strong>No Warranty:</strong> This assessment is provided "as is" without
            warranty of any kind. While we strive for accuracy, cyber risk is complex
            and context-dependent. This tool provides guidance, not guarantees.
          </p>
          
          <p>
            <strong>Not Professional Advice:</strong> This assessment does not constitute
            professional cybersecurity consulting, legal advice, or compliance certification.
            For comprehensive security audits, consult qualified professionals.
          </p>
          
          <p>
            <strong>DNS Queries:</strong> When you provide a domain, we perform standard
            DNS queries (SPF, DKIM, DMARC lookups) using public DNS servers. These are
            passive checks that do not interact with your email systems.
          </p>
          
          <p>
            <strong>Limitation of Liability:</strong> CyberSafe-SA and its creators
            are not liable for any damages, losses, or security incidents that may
            occur as a result of using this tool or acting (or failing to act) on its
            recommendations.
          </p>
          
          <p>
            <strong>Ethical Use:</strong> By using this tool, you agree to use it only
            for assessing your own organization's security posture, not for unauthorized
            testing of third-party systems.
          </p>
        </div>
      </div>

      {/* Open Source & Contact */}
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Technology & Resources</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Built With:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
            <li>React + Vite (Frontend)</li>
            <li>Node.js + Vercel Serverless Functions (Backend)</li>
            <li>Tailwind CSS (Styling)</li>
            <li>Native DNS module (No external APIs)</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Recommended Resources:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <a
                href="https://www.sabric.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sa-blue hover:underline"
              >
                SABRIC - South African Banking Risk Information Centre
              </a>
            </li>
            <li>
              <a
                href="https://dmarc.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sa-blue hover:underline"
              >
                DMARC.org - Email Authentication Resources
              </a>
            </li>
            <li>
              <a
                href="https://www.staysafeonline.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sa-blue hover:underline"
              >
                StaySafeOnline - Cybersecurity Training
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
