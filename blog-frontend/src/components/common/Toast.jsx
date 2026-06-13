import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const Toast = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 4000,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      textColor: 'text-green-100',
      iconColor: 'text-green-300',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-500',
      textColor: 'text-red-100',
      iconColor: 'text-red-300',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-100',
      iconColor: 'text-yellow-300',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-100',
      iconColor: 'text-blue-300',
    },
  }

  const config = typeConfig[type] || typeConfig.info
  const Icon = config.icon

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed ${positionClasses[position]} z-50 max-w-sm`}
        >
          <div className={`${config.bgColor} rounded-lg shadow-xl overflow-hidden`}>
            <div className="flex items-start p-4">
              <div className="flex-shrink-0">
                <Icon className={`${config.iconColor} w-6 h-6`} />
              </div>
              <div className="ml-3 flex-grow">
                <p className={`text-sm font-medium ${config.textColor}`}>
                  {message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={handleClose}
                  className={`${config.iconColor} hover:opacity-75 transition-opacity`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="h-1 bg-white bg-opacity-30"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast