import axios from 'axios'
// import { authClient } from './auth/client'

// const DUMMYJSON_BASE_URL = 'https://dummyjson.com'

// /**
//  * IMPORTANT SECURITY NOTE:
//  *
//  * The access token is now httpOnly (not accessible by JavaScript) for security.
//  * This means the client-side code cannot read the token to attach to requests.
//  *
//  * RECOMMENDED ARCHITECTURE:
//  * Create server-side API routes that proxy requests to DummyJSON.
//  * The server can read the httpOnly cookie and attach the Authorization header.
//  *
//  * Example:
//  * - Client calls: /api/proxy/users/me
//  * - Server reads httpOnly cookie, calls DummyJSON with token
//  * - Server returns response to client
//  *
//  * For now, this axios instance can be used for unauthenticated requests only.
//  * For authenticated requests, use server functions or create proxy endpoints.
//  */

// const axiosApi = axios.create({
//   baseURL: DUMMYJSON_BASE_URL,
// })

// let isRefreshing = false
// let refreshSubscribers: Array<() => void> = []

// const subscribeTokenRefresh = (callback: () => void) => {
//   refreshSubscribers.push(callback)
// }

// const onTokenRefreshed = () => {
//   refreshSubscribers.forEach((callback) => callback())
//   refreshSubscribers = []
// }

// // Note: Token is no longer attached client-side since it's httpOnly
// // The server must handle authenticated requests
// axiosApi.interceptors.request.use(
//   (config) => {
//     // Tokens are httpOnly - cannot be read client-side
//     // Use server functions for authenticated requests instead
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// axiosApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve) => {
//           subscribeTokenRefresh(() => {
//             // Retry the request after refresh
//             // Note: Token is httpOnly, so we just retry
//             // The server proxy will read the new token from cookie
//             resolve(axiosApi(originalRequest))
//           })
//         })
//       }

//       originalRequest._retry = true
//       isRefreshing = true

//       try {
//         // Attempt to refresh token
//         // The refresh token is also httpOnly, sent automatically via cookies
//         const result = await authClient.refreshToken({})
//         if (result.error) {
//           throw new Error(result.error.message)
//         }

//         // Notify subscribers that token was refreshed
//         onTokenRefreshed()

//         // Retry the original request
//         // Note: Token is httpOnly, so we just retry
//         // The server proxy will read the new token from cookie
//         return axiosApi(originalRequest)
//       } catch (refreshError) {
//         window.location.href = '/login'
//         return Promise.reject(refreshError)
//       } finally {
//         isRefreshing = false
//       }
//     }

//     return Promise.reject(error)
//   },
// )

const axiosApi = axios.create({})

export { axiosApi }
