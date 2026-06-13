import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X } from 'lucide-react'

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Show consent after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setShowConsent(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary bg-opacity-25 rounded-lg text-primary flex-shrink-0">
            <Cookie size={28} className="animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white">We Value Your Privacy</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              We use cookies to secure your sessions (with HttpOnly cookies), remember preferences, and analyze site traffic. By clicking "Accept", you agree to our use of cookies. Read our{' '}
              <Link to="/cookie-policy" className="text-primary hover:underline font-semibold">
                Cookie Policy
              </Link>{' '}
              for details.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg text-sm transition-colors w-full md:w-auto text-center"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-primary hover:bg-secondary text-white font-medium rounded-lg text-sm transition-colors shadow-md w-full md:w-auto text-center"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
