import axios from 'axios'
import { authClient } from './auth-client'

/**
 * API client for authenticated requests.
 *
 * This client routes requests through the server-side proxy (/api/proxy/*)
 * which reads the httpOnly access token and attaches it to requests to DummyJSON.
 *
 * Usage:
 * ```typescript
 * // Instead of calling DummyJSON directly:
 * // const user = await axios.get('https://dummyjson.com/users/me')
 *
 * // Use the proxy client:
 * const user = await apiClient.get('/users/me')
 * ```
 */

// Create axios instance that routes through the proxy
const apiClient = axios.create({
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Track refresh state
let isRefreshing = false
let refreshSubscribers: Array<() => void> = []

const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback)
}

const onTokenRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback())
  refreshSubscribers = []
}

// Response interceptor to handle 401 errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - token might be expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for refresh to complete and retry
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to refresh the token
        // The refresh token is sent automatically via httpOnly cookie
        const result = await authClient.refreshToken({})

        if (result.error) {
          throw new Error(result.error.message)
        }

        // Token refreshed successfully
        onTokenRefreshed()

        // Retry the original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export { apiClient }
