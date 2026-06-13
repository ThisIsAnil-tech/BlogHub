import React from 'react'
import { AlertCircle } from 'lucide-react'

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center">
        <AlertCircle className="text-red-500 mr-2 flex-shrink-0" size={20} />
        <p className="text-red-700 flex-grow text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage