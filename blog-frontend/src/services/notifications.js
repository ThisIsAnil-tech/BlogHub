import api from './api'

export const notificationService = {
  getAll: async (unreadOnly = false, limit = 20) => {
    const response = await api.get('/notifications', { 
      params: { unreadOnly, limit } 
    })
    return response
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count')
    return response.count
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`)
    return response
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read')
    return response
  },

  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`)
    return response
  },

  // WebSocket connection for real-time notifications
  connectWebSocket: (token, onNotification) => {
    // This is a mock implementation
    // In production, you would use Socket.IO or similar
    console.log('Connecting to WebSocket for real-time notifications')
    
    // Simulate incoming notifications
    const simulateNotification = () => {
      const notifications = [
        {
          id: Date.now(),
          title: 'New Comment',
          message: 'Someone commented on your post',
          type: 'comment',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/comments',
        },
        {
          id: Date.now() + 1,
          title: 'System Update',
          message: 'System maintenance scheduled',
          type: 'system',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/admin/dashboard',
        },
      ]
      
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
      onNotification(randomNotification)
    }
    
    // Simulate receiving notifications every 30-60 seconds
    const interval = setInterval(simulateNotification, 30000 + Math.random() * 30000)
    
    return {
      disconnect: () => {
        clearInterval(interval)
        console.log('Disconnected from WebSocket')
      },
    }
  },
}