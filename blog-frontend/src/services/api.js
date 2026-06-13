import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial: send HttpOnly cookies with request (e.g., refresh token)
  timeout: 10000, // 10 second timeout
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor: Attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: Handle expired tokens
api.interceptors.response.use(
  (response) => {
    if (response.data !== undefined) {
      return response.data
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Check if error is 401 and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Check if it's token expiration
      if (error.response.data?.error === 'TokenExpiredError') {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return api(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Attempt token rotation via HttpOnly refresh cookie
          const response = await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            { withCredentials: true }
          )
          
          const { accessToken } = response.data
          localStorage.setItem('token', accessToken)
          
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          
          processQueue(null, accessToken)
          isRefreshing = false
          
          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          isRefreshing = false
          
          localStorage.removeItem('token')
          if (window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login'
          }
          return Promise.reject(refreshError)
        }
      } else {
        // Normal 401 error (unauthorized, user modified, or deleted)
        localStorage.removeItem('token')
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api