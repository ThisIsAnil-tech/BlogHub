import React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Home } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center max-w-lg bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="inline-flex p-4 bg-red-100 dark:bg-red-900 dark:bg-opacity-20 rounded-full text-red-500 mb-6">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Sorry, the page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-white hover:bg-secondary font-medium rounded-lg transition-colors shadow"
        >
          <Home size={18} className="mr-2" />
          Back to Homepage
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
