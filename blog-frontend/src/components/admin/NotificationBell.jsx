import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { notificationService } from '../../services/notifications'
import { Bell, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notificationSound, setNotificationSound] = useState(null)

  const { data: notifications, refetch } = useQuery({
    queryKey: ['notifications-bell'],
    queryFn: () => notificationService.getAll(true, 5),
    refetchInterval: 30000, // Check every 30 seconds
  })

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications-unread-bell'],
    queryFn: () => notificationService.getUnreadCount(),
  })

  // Play sound when new notification arrives
  useEffect(() => {
    if (unreadCount > 0) {
      // Create notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ')
      audio.volume = 0.3
      audio.play().catch(() => {})
      setNotificationSound(audio)
    }
  }, [unreadCount])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      refetch()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      refetch()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return '💬'
      case 'system':
        return '⚙️'
      case 'alert':
        return '⚠️'
      case 'success':
        return '✅'
      case 'user':
        return '👤'
      default:
        return '🔔'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-primary dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-dark dark:text-light">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-accent hover:text-opacity-90"
                    >
                      Mark all read
                    </button>
                  )}
                  <span className="text-xs text-gray-500">
                    {notifications?.length || 0} total
                  </span>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications && notifications.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-dark dark:text-light">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="ml-2 p-1 hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check size={14} />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.createdAt)}
                            </span>
                            {notification.link && (
                              <a
                                href={notification.link}
                                className="text-xs text-accent hover:text-opacity-90"
                              >
                                View
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell size={32} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No new notifications
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href="/admin/notifications"
                className="block w-full text-center text-sm text-accent hover:text-opacity-90"
              >
                View all notifications
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default NotificationBell