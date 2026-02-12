import { betterAuth } from 'better-auth'
import { createAuthEndpoint } from 'better-auth/api'
import { z } from 'zod'
import type { BetterAuthPlugin } from 'better-auth'
import { randomBytes } from 'crypto'

const DUMMYJSON_BASE_URL = 'https://dummyjson.com'

// Trusted origins for CSRF protection
const TRUSTED_ORIGINS = [
  process.env.BETTER_AUTH_URL || 'http://localhost:3010',
  'http://localhost:3010',
  'https://localhost:3010',
].filter(Boolean)

export interface DummyAuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface DummyRefreshResponse {
  accessToken: string
  refreshToken: string
}

export interface DummyUserData {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

// Helper to generate a secure random token using cryptographically secure random bytes
const generateToken = () => {
  return randomBytes(32).toString('hex')
}

// Input sanitization helper - removes potentially dangerous characters
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>"']/g, '') // Remove common XSS characters
    .slice(0, 100) // Limit length
}

// CSRF origin validation helper
const validateOrigin = (ctx: { headers: Headers }): boolean => {
  const origin = ctx.headers.get('origin')
  const referer = ctx.headers.get('referer')

  // Check origin header
  if (
    origin &&
    !TRUSTED_ORIGINS.some((trusted) => origin.startsWith(trusted))
  ) {
    return false
  }

  // Check referer header as fallback
  if (
    !origin &&
    referer &&
    !TRUSTED_ORIGINS.some((trusted) => referer.startsWith(trusted))
  ) {
    return false
  }

  return true
}

// Enhanced validation schemas with sanitization
const credentialsSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens',
    )
    .transform(sanitizeInput),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
  expiresInMins: z
    .number()
    .min(1, 'Expiration must be at least 1 minute')
    .max(60, 'Expiration must be less than 60 minutes')
    .optional()
    .default(30),
})

const dummyAuthPlugin = (): BetterAuthPlugin => ({
  id: 'dummy-auth',
  endpoints: {
    signInDummy: createAuthEndpoint(
      '/sign-in/dummy',
      {
        method: 'POST',
        body: credentialsSchema,
      },
      async (ctx) => {
        // CSRF origin validation
        if (!validateOrigin(ctx)) {
          return ctx.json(
            { error: 'Invalid origin - CSRF check failed' },
            { status: 403 },
          )
        }

        const { username, password, expiresInMins } = ctx.body

        const response = await fetch(`${DUMMYJSON_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, expiresInMins }),
        })

        if (!response.ok) {
          return ctx.json(
            {
              error: 'Invalid credentials',
            },
            { status: 401 },
          )
        }

        const data: DummyAuthResponse = await response.json()

        const userData: DummyUserData = {
          id: data.id.toString(),
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          image: data.image,
        }

        // Calculate consistent expiration
        const sessionMaxAge = 60 * expiresInMins
        const expiresAt = new Date(Date.now() + expiresInMins * 60 * 1000)

        // Store access token (httpOnly for security - prevents XSS token theft)
        ctx.setCookie('dummy_access_token', data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: sessionMaxAge,
          path: '/',
        })

        // Store refresh token (httpOnly for security)
        ctx.setCookie('dummy_refresh_token', data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days - refresh token lives longer
          path: '/',
        })

        // Store user data (accessible by client for UI display only)
        ctx.setCookie('dummy_user_data', JSON.stringify(userData), {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: sessionMaxAge,
          path: '/',
        })

        // Store session metadata
        const sessionId = `session_${Date.now()}_${generateToken()}`

        ctx.setCookie('dummy_session_id', sessionId, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: sessionMaxAge,
          path: '/',
        })

        ctx.setCookie('dummy_session_expires', expiresAt.toISOString(), {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: sessionMaxAge,
          path: '/',
        })

        return ctx.json({
          user: userData,
          success: true,
        })
      },
    ),

    refreshToken: createAuthEndpoint(
      '/refresh-token',
      {
        method: 'POST',
        body: z.object({
          refreshToken: z.string().optional(),
          expiresInMins: z.number().optional().default(30),
        }),
      },
      async (ctx) => {
        // CSRF origin validation for refresh token endpoint
        if (!validateOrigin(ctx)) {
          return ctx.json(
            { error: 'Invalid origin - CSRF check failed' },
            { status: 403 },
          )
        }

        const refreshTokenFromBody = ctx.body.refreshToken
        const refreshTokenFromCookie = ctx.getCookie('dummy_refresh_token')
        const refreshToken = refreshTokenFromBody || refreshTokenFromCookie

        if (!refreshToken) {
          return ctx.json(
            {
              error: 'No refresh token provided',
            },
            { status: 401 },
          )
        }

        const response = await fetch(`${DUMMYJSON_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refreshToken,
            expiresInMins: ctx.body.expiresInMins,
          }),
        })

        if (!response.ok) {
          // Clear all cookies on failed refresh
          ctx.setCookie('dummy_access_token', '', { maxAge: 0, path: '/' })
          ctx.setCookie('dummy_refresh_token', '', { maxAge: 0, path: '/' })
          ctx.setCookie('dummy_user_data', '', { maxAge: 0, path: '/' })
          ctx.setCookie('dummy_session_id', '', { maxAge: 0, path: '/' })
          ctx.setCookie('dummy_session_expires', '', { maxAge: 0, path: '/' })
          return ctx.json(
            {
              error: 'Invalid refresh token',
            },
            { status: 401 },
          )
        }

        const data: DummyRefreshResponse = await response.json()
        const userDataStr = ctx.getCookie('dummy_user_data')

        if (userDataStr) {
          // Update access token (httpOnly for security)
          ctx.setCookie('dummy_access_token', data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * ctx.body.expiresInMins,
            path: '/',
          })

          // Update refresh token
          ctx.setCookie('dummy_refresh_token', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          })

          // Update session expiration
          const expiresAt = new Date(
            Date.now() + ctx.body.expiresInMins * 60 * 1000,
          )
          ctx.setCookie('dummy_session_expires', expiresAt.toISOString(), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * ctx.body.expiresInMins,
            path: '/',
          })
        }

        return ctx.json({
          success: true,
        })
      },
    ),

    signOutDummy: createAuthEndpoint(
      '/sign-out/dummy',
      {
        method: 'POST',
      },
      async (ctx) => {
        // CSRF origin validation for sign out
        if (!validateOrigin(ctx)) {
          return ctx.json(
            { error: 'Invalid origin - CSRF check failed' },
            { status: 403 },
          )
        }

        ctx.setCookie('dummy_access_token', '', { maxAge: 0, path: '/' })
        ctx.setCookie('dummy_refresh_token', '', { maxAge: 0, path: '/' })
        ctx.setCookie('dummy_user_data', '', { maxAge: 0, path: '/' })
        ctx.setCookie('dummy_session_id', '', { maxAge: 0, path: '/' })
        ctx.setCookie('dummy_session_expires', '', { maxAge: 0, path: '/' })

        return ctx.json({
          success: true,
        })
      },
    ),
  },
})

export const auth = betterAuth({
  appName: 'TanStack Start Starter',
  emailAndPassword: {
    enabled: false,
  },
  // Rate limiting to prevent brute force attacks
  rateLimit: {
    enabled: true,
    window: 10, // 10 seconds window
    max: 5, // 5 requests per window
    storage: 'memory', // Use 'database' or 'secondary-storage' for production multi-instance deployments
  },
  // CSRF protection - only accept requests from trusted origins
  trustedOrigins: TRUSTED_ORIGINS,
  // Advanced security settings
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  plugins: [dummyAuthPlugin()],
})

export type AuthType = typeof auth
