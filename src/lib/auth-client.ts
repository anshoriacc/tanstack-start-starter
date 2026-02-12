import { createAuthClient } from 'better-auth/react'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import type { DummyUserData } from './auth'

export interface SignInDummyResponse {
  data: {
    user: DummyUserData
    success: true
  } | null
  error: {
    message: string
  } | null
}

export interface RefreshTokenResponse {
  data: {
    success: true
  } | null
  error: {
    message: string
  } | null
}

export interface SignOutResponse {
  data: {
    success: true
  } | null
  error: {
    message: string
  } | null
}

interface FetchResponse<T> {
  data?: T
  error?: { message: string }
}

const dummyAuthClientPlugin = () => ({
  id: 'dummy-auth-client',
  getActions: ($fetch: typeof fetch) => ({
    signIn: {
      dummy: async (credentials: {
        username: string
        password: string
        expiresInMins?: number
      }): Promise<SignInDummyResponse> => {
        try {
          const result = (await $fetch('/sign-in/dummy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            credentials: 'include',
          })) as FetchResponse<{ user: DummyUserData; success: true }>

          if (result.error) {
            return {
              data: null,
              error: result.error,
            }
          }

          // Notify all listeners that session has changed
          notifySessionChange()

          return {
            data: result.data || null,
            error: null,
          }
        } catch (err) {
          return {
            data: null,
            error: {
              message: err instanceof Error ? err.message : 'Login failed',
            },
          }
        }
      },
    },
    refreshToken: async (params?: {
      refreshToken?: string
      expiresInMins?: number
    }): Promise<RefreshTokenResponse> => {
      try {
        const result = (await $fetch('/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params || {}),
          credentials: 'include',
        })) as FetchResponse<{ success: true }>

        if (result.error) {
          return {
            data: null,
            error: result.error,
          }
        }

        // Notify all listeners that session has changed
        notifySessionChange()

        return {
          data: result.data || null,
          error: null,
        }
      } catch (err) {
        return {
          data: null,
          error: {
            message: err instanceof Error ? err.message : 'Refresh failed',
          },
        }
      }
    },
    signOut: {
      dummy: async (): Promise<SignOutResponse> => {
        try {
          const result = (await $fetch('/sign-out/dummy', {
            method: 'POST',
            credentials: 'include',
          })) as FetchResponse<{ success: true }>

          if (result.error) {
            return {
              data: null,
              error: result.error,
            }
          }

          // Notify all listeners that session has changed
          notifySessionChange()

          return {
            data: result.data || null,
            error: null,
          }
        } catch (err) {
          return {
            data: null,
            error: {
              message: err instanceof Error ? err.message : 'Logout failed',
            },
          }
        }
      },
    },
  }),
})

// Client-side baseURL - use window.location.origin for relative URLs to work
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.BETTER_AUTH_URL || 'http://localhost:3000'
}

/**
 * Better Auth client instance.
 * Note: authClient.useSession() will return null because we're using custom dummy auth.
 * Use the `useSession()` hook exported below instead.
 */
export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [dummyAuthClientPlugin()],
})

export type AuthClient = typeof authClient

// Cookie names - only include client-accessible cookies
// Note: access_token and refresh_token are now httpOnly for security
const USER_DATA_COOKIE = 'dummy_user_data'
const SESSION_ID_COOKIE = 'dummy_session_id'
const SESSION_EXPIRES_COOKIE = 'dummy_session_expires'

// Cookie helpers
export const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

/**
 * Get user data from client-accessible cookie
 * Note: Access token is httpOnly and cannot be read client-side
 */
export const getUserData = (): DummyUserData | null => {
  const userDataStr = getCookieValue(USER_DATA_COOKIE)
  if (!userDataStr) return null
  try {
    return JSON.parse(userDataStr)
  } catch {
    return null
  }
}

// Session types
// Note: Session no longer includes token since access_token is httpOnly
export interface Session {
  id: string
  userId: string
  expiresAt: Date
}

export interface SessionState {
  data: { user: DummyUserData; session: Session } | null
  error: Error | null
  isPending: boolean
}

/**
 * Read session from cookies - stable function
 * Note: Access token is httpOnly and not accessible client-side
 */
const readSessionFromCookies = (): SessionState => {
  // Server-side rendering
  if (typeof document === 'undefined') {
    return { data: null, error: null, isPending: true }
  }

  const userData = getUserData()
  const sessionId = getCookieValue(SESSION_ID_COOKIE)
  const sessionExpires = getCookieValue(SESSION_EXPIRES_COOKIE)

  // Check if all required cookies are present
  // Note: We don't check for access token since it's httpOnly
  if (!userData || !sessionId || !sessionExpires) {
    return { data: null, error: null, isPending: false }
  }

  // Check if session is expired
  const expiresAt = new Date(sessionExpires)
  if (expiresAt < new Date()) {
    return { data: null, error: null, isPending: false }
  }

  const session: Session = {
    id: sessionId,
    userId: userData.id,
    expiresAt,
  }

  return {
    data: {
      user: userData,
      session,
    },
    error: null,
    isPending: false,
  }
}

// Global state for session updates
let sessionVersion = 0
const listeners = new Set<() => void>()

export const notifySessionChange = () => {
  sessionVersion++
  listeners.forEach((listener) => listener())
}

/**
 * Custom useSession hook for dummy auth.
 * Optimized following Vercel React Best Practices (rerender-defer-reads).
 * Uses ref for initial state to avoid hydration mismatches and unnecessary re-renders.
 *
 * Use this instead of authClient.useSession() - which returns null with custom auth.
 *
 * @example
 * function MyComponent() {
 *   const { data, error, isPending } = useSession()
 *   if (isPending) return <div>Loading...</div>
 *   if (!data) return <div>Not logged in</div>
 *   return <div>Hello {data.user.name}</div>
 * }
 */
export function useSession() {
  // Use ref for the initial session read to avoid hydration mismatches
  // and prevent unnecessary subscriptions during render
  const initialSessionRef = useRef<SessionState | null>(null)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  // Lazy initialization - only read cookies once on first render
  if (initialSessionRef.current === null) {
    if (typeof document === 'undefined') {
      initialSessionRef.current = { data: null, error: null, isPending: true }
    } else {
      initialSessionRef.current = readSessionFromCookies()
    }
  }

  // State ref for current value (avoid useState to prevent subscription overhead)
  const sessionRef = useRef<SessionState>(initialSessionRef.current)

  // Keep ref in sync with initial value
  if (initialSessionRef.current !== sessionRef.current) {
    sessionRef.current = initialSessionRef.current
  }

  useEffect(() => {
    // Read session on mount (client-side) in case cookies changed during SSR -> hydration
    const currentSession = readSessionFromCookies()
    sessionRef.current = currentSession
    forceUpdate()

    // Subscribe to session changes from other components/auth actions
    const handleChange = () => {
      sessionRef.current = readSessionFromCookies()
      forceUpdate()
    }

    listeners.add(handleChange)
    return () => {
      listeners.delete(handleChange)
    }
  }, [])

  const refetch = useCallback(() => {
    notifySessionChange()
  }, [])

  return {
    ...sessionRef.current,
    isRefetching: false,
    refetch,
  }
}

/**
 * Helper to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { data, isPending } = useSession()
  return !isPending && !!data
}
