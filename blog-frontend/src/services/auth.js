import api from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response
  },

  getMe: async (token) => {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.user
  },

  updateProfile: async (profileData, token) => {
    const response = await api.put('/auth/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.user
  },

  logout: async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  },
}