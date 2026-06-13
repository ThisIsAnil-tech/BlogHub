import api from './api'

export const analyticsService = {
  getAnalytics: async (period = '7d') => {
    return api.get('/analytics', { params: { period } })
  },

  getRealtimeAnalytics: async () => {
    return api.get('/analytics/realtime')
  },

  getPopularContent: async (limit = 10, period = '7d') => {
    return api.get('/analytics/popular', { params: { limit, period } })
  },
}