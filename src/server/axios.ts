import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import axios, { type AxiosRequestConfig } from 'axios'
import { z } from 'zod'

import { auth } from '@/lib/auth/server'
import { BACKEND_URL } from '@/constants/env'

const httpClient = axios.create({ baseURL: BACKEND_URL })

// Error type compatible with server-client serialization
export class ApiError extends Error {
  statusCode: number
  errors?: Array<unknown>

  constructor(statusCode: number, message: string, errors?: Array<unknown>) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
  }
}

function throwApiError(error: unknown): never {
  if (axios.isAxiosError(error) && error.response) {
    const body = error.response.data as Record<string, unknown> | undefined
    throw new ApiError(
      error.response.status,
      (body?.message as string) ?? error.message,
      body?.errors as Array<unknown> | undefined,
    )
  }
  throw error
}

// Token management helpers
async function getAccessToken(): Promise<string | null> {
  const headers = getRequestHeaders()
  try {
    const session = await auth.api.getSession({ headers })
    if (!session?.session) return null
    return (session.session as Record<string, unknown>).accessToken as
      | string
      | null
  } catch {
    return null
  }
}

async function refreshAndGetToken(): Promise<string | null> {
  const headers = getRequestHeaders()
  try {
    // Call better-auth's refreshToken endpoint with actual request headers
    // so it can identify the session from the cookie
    await auth.api.refreshToken({ headers, body: {} })
    // Re-read session to get the new access token
    const session = await auth.api.getSession({ headers })
    if (!session?.session) return null
    return (session.session as Record<string, unknown>).accessToken as
      | string
      | null
  } catch {
    return null
  }
}

const requestSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  url: z.string(),
  data: z.unknown().optional(),
  params: z.record(z.string(), z.unknown()).optional(),
  headers: z.record(z.string(), z.string()).optional(),
})

// Server-side request handler
const serverRequest = createServerFn({ method: 'POST' })
  .inputValidator(requestSchema)
  .handler(async ({ data: input }) => {
    const token = await getAccessToken()

    const config: AxiosRequestConfig = {
      method: input.method,
      url: input.url,
      data: input.data,
      params: input.params,
      headers: {
        ...input.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }

    try {
      const res = await httpClient.request(config)
      return res.data as { [key: string]: {} }
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        throwApiError(error)
      }

      // Attempt token refresh on 401
      const newToken = await refreshAndGetToken()
      if (!newToken) {
        throwApiError(error)
      }

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${newToken}`,
      }

      try {
        const res = await httpClient.request(config)
        return res.data as { [key: string]: {} }
      } catch (retryError) {
        throwApiError(retryError)
      }
    }
  })

// Client-side API wrapper
export const api = {
  get: <T = unknown>(url: string, params?: Record<string, unknown>) =>
    serverRequest({
      data: { method: 'GET' as const, url, params },
    }) as Promise<T>,

  post: <T = unknown>(url: string, data?: unknown) =>
    serverRequest({
      data: { method: 'POST' as const, url, data },
    }) as Promise<T>,

  put: <T = unknown>(url: string, data?: unknown) =>
    serverRequest({
      data: { method: 'PUT' as const, url, data },
    }) as Promise<T>,

  patch: <T = unknown>(url: string, data?: unknown) =>
    serverRequest({
      data: { method: 'PATCH' as const, url, data },
    }) as Promise<T>,

  delete: <T = unknown>(url: string) =>
    serverRequest({
      data: { method: 'DELETE' as const, url },
    }) as Promise<T>,
}
