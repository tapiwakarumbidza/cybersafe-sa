import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-sa-green rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🛡️</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                CyberSafe-SA
              </span>
            </Link>
            
            <div className="flex space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-sa-green font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/assessment"
                className="text-gray-700 hover:text-sa-green font-medium transition-colors"
              >
                Assessment
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-sa-green font-medium transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">CyberSafe-SA</h3>
              <p className="text-gray-400 text-sm">
                Free phishing readiness assessment for South African organizations.
                Zero data retention. POPIA compliant.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Privacy</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>✓ No data storage</li>
                <li>✓ No user accounts</li>
                <li>✓ No tracking cookies</li>
                <li>✓ Client-side export only</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Resources</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>
                  <a
                    href="https://www.sabric.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    SABRIC Cybersecurity
                  </a>
                </li>
                <li>
                  <a
                    href="https://dmarc.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    DMARC Resources
                  </a>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p className="mb-2">
              Made with 💚 by <span className="text-sa-gold font-semibold">Tapiwa Karumbidza</span>
            </p>
            <p>
              © 2026 CyberSafe-SA | Defensive Security Only | 
              <Link to="/about" className="hover:text-white ml-1">
                Legal Disclaimer
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
