import React from 'react'
import { Link } from 'react-router-dom'
import { ServerCrash, RefreshCw } from 'lucide-react'

const ErrorPage = () => {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center max-w-lg bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="inline-flex p-4 bg-orange-100 dark:bg-orange-900 dark:bg-opacity-20 rounded-full text-orange-500 mb-6">
          <ServerCrash size={48} />
        </div>
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">500</h1>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Server Error</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Something went wrong on our end. Please refresh the page or try again later.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handleReload}
            className="inline-flex items-center px-6 py-3 bg-accent text-dark font-medium rounded-lg transition-colors shadow hover:bg-opacity-90 w-full sm:w-auto justify-center"
          >
            <RefreshCw size={18} className="mr-2" />
            Reload Page
          </button>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-dark dark:text-light hover:bg-gray-300 dark:hover:bg-gray-600 font-medium rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
