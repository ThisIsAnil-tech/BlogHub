import React, { useState } from 'react'
import Layout from '../../components/layout/Layout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '../../services/notifications'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import {
  Bell,
  Check,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info,
  MessageSquare,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all') // all, unread
  const queryClient = useQueryClient()

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications', filter],
    queryFn: () => notificationService.getAll(filter === 'unread', 50),
  })

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: () => notificationService.getUnreadCount(),
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      queryClient.invalidateQueries(['notifications-unread'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to mark as read')
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      queryClient.invalidateQueries(['notifications-unread'])
      toast.success('All notifications marked as read')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to mark all as read')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      queryClient.invalidateQueries(['notifications-unread'])
      toast.success('Notification deleted')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete notification')
    },
  })

  const deleteAllMutation = useMutation({
    mutationFn: () => {
      const ids = notifications?.data?.map(n => n.id) || []
      return Promise.all(ids.map(id => notificationService.delete(id)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      queryClient.invalidateQueries(['notifications-unread'])
      toast.success('All notifications deleted')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete notifications')
    },
  })

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return MessageSquare
      case 'system':
        return Info
      case 'alert':
        return AlertCircle
      case 'success':
        return CheckCircle
      case 'user':
        return User
      default:
        return Bell
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'comment':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900'
      case 'system':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900'
      case 'alert':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900'
      case 'success':
        return 'text-green-500 bg-green-100 dark:bg-green-900'
      case 'user':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-900'
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900'
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light">
              Notifications
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your notifications and alerts
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isLoading || unreadCount === 0}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors disabled:opacity-50"
            >
              <Check size={18} className="mr-2" />
              Mark All Read
            </button>
            <button
              onClick={() => deleteAllMutation.mutate()}
              disabled={deleteAllMutation.isLoading || !notifications?.data?.length}
              className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 flex items-center transition-colors disabled:opacity-50"
            >
              <Trash2 size={18} className="mr-2" />
              Clear All
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary rounded-lg mr-4">
                <Bell className="text-dark" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark dark:text-light">
                  {notifications?.data?.length || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Notifications
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                <Bell className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark dark:text-light">
                  {unreadCount || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Unread Notifications
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                <Bell className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-dark dark:text-light">
                  {Math.max((notifications?.data?.length || 0) - (unreadCount || 0), 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Read Notifications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-gray-700 shadow'
                  : 'hover:bg-white dark:hover:bg-gray-700'
              }`}
            >
              All Notifications
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                filter === 'unread'
                  ? 'bg-white dark:bg-gray-700 shadow'
                  : 'hover:bg-white dark:hover:bg-gray-700'
              }`}
            >
              Unread Only
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {notifications?.data && notifications.data.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.data.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-4 ${getNotificationColor(notification.type)}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-dark dark:text-light">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                className="p-1 hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteMutation.mutate(notification.id)}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(notification.createdAt)}
                          </span>
                          {notification.link && (
                            <a
                              href={notification.link}
                              className="text-xs text-accent hover:text-opacity-90"
                            >
                              View Details →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-dark dark:text-light mb-2">
                No notifications
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'unread'
                  ? 'You have no unread notifications'
                  : 'You have no notifications yet'}
              </p>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
            Notification Preferences
          </h3>
          <div className="space-y-4">
            {[
              { label: 'New Comments', description: 'Get notified when someone comments on your posts' },
              { label: 'System Updates', description: 'Receive important system notifications' },
              { label: 'New Followers', description: 'Get notified when someone follows you' },
              { label: 'Email Notifications', description: 'Receive notifications via email' },
            ].map((pref, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-dark dark:text-light">
                    {pref.label}
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {pref.description}
                  </p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    className="sr-only"
                    id={`pref-${index}`}
                    defaultChecked={index < 2}
                  />
                  <label
                    htmlFor={`pref-${index}`}
                    className="block w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer transition-colors"
                  >
                    <span className="block w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white dark:bg-gray-300 transition-transform transform translate-x-0" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default NotificationsPage