import { createServerFn } from '@tanstack/react-start'
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { z } from 'zod'

import { auth } from '@/lib/auth/server'
import { BACKEND_URL } from '@/constants/env'
import { getRequestHeaders } from '@tanstack/react-start/server'

const serverAxiosInstance = axios.create({
  baseURL: BACKEND_URL,
})

export interface SerializableAxiosResponse {
  data: Record<string, {}>
  status: number
  statusText: string
  headers: Record<string, string>
}

async function getSessionWithToken(): Promise<{
  accessToken: string
  refreshToken: string
} | null> {
  try {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({
      headers: headers as unknown as Headers,
    })

    if (!session?.session) return null

    return {
      accessToken: (session.session as unknown as Record<string, string>)
        .accessToken,
      refreshToken: (session.session as unknown as Record<string, string>)
        .refreshToken,
    }
  } catch {
    return null
  }
}

function serializeResponse(response: AxiosResponse): SerializableAxiosResponse {
  const headers: Record<string, string> = {}

  if (response.headers) {
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value
      }
    })
  }

  return {
    data: (response.data ?? {}) as Record<string, {}>,
    status: response.status,
    statusText: response.statusText,
    headers,
  }
}

async function makeRequest(
  config: AxiosRequestConfig,
): Promise<SerializableAxiosResponse> {
  const tokens = await getSessionWithToken()
  console.log('tokens::', tokens)

  const requestConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      ...config.headers,
      ...(tokens?.accessToken && {
        Authorization: `Bearer ${tokens.accessToken}`,
      }),
    },
  }

  try {
    const response = await serverAxiosInstance.request(requestConfig)
    return serializeResponse(response)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        await auth.api.refreshToken({
          body: {},
          headers: new Headers(),
        })

        const newTokens = await getSessionWithToken()

        const retryConfig: AxiosRequestConfig = {
          ...config,
          headers: {
            ...config.headers,
            ...(newTokens?.accessToken && {
              Authorization: `Bearer ${newTokens.accessToken}`,
            }),
          },
        }

        const response = await serverAxiosInstance.request(retryConfig)
        return serializeResponse(response)
      } catch {
        throw error
      }
    }
    throw error
  }
}

const axiosConfigSchema = z.object({
  headers: z.record(z.string(), z.unknown()).optional(),
  params: z.record(z.string(), z.unknown()).optional(),
  timeout: z.number().optional(),
  withCredentials: z.boolean().optional(),
  responseType: z
    .enum(['json', 'text', 'blob', 'arraybuffer', 'document'])
    .optional(),
})

const getRequestConfigSchema = z.object({
  url: z.string(),
  config: axiosConfigSchema.optional(),
})

const postRequestConfigSchema = z.object({
  url: z.string(),
  data: z.unknown().optional(),
  config: axiosConfigSchema.optional(),
})

const requestConfigSchema = z.object({
  url: z.string(),
  method: z
    .enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
    .optional(),
  ...axiosConfigSchema.shape,
  data: z.unknown().optional(),
})

export const serverAxios = {
  get: createServerFn({ method: 'GET' })
    .inputValidator(getRequestConfigSchema)
    .handler(async ({ data }) => {
      const { url, config } = data
      return makeRequest({
        ...(config as AxiosRequestConfig),
        method: 'GET',
        url,
      })
    }),

  post: createServerFn({ method: 'POST' })
    .inputValidator(postRequestConfigSchema)
    .handler(async ({ data }) => {
      const { url, data: body, config } = data
      return makeRequest({
        ...(config as AxiosRequestConfig),
        method: 'POST',
        url,
        data: body,
      })
    }),

  put: createServerFn({ method: 'POST' })
    .inputValidator(postRequestConfigSchema)
    .handler(async ({ data }) => {
      const { url, data: body, config } = data
      return makeRequest({
        ...(config as AxiosRequestConfig),
        method: 'PUT',
        url,
        data: body,
      })
    }),

  delete: createServerFn({ method: 'POST' })
    .inputValidator(getRequestConfigSchema)
    .handler(async ({ data }) => {
      const { url, config } = data
      return makeRequest({
        ...(config as AxiosRequestConfig),
        method: 'DELETE',
        url,
      })
    }),

  patch: createServerFn({ method: 'POST' })
    .inputValidator(postRequestConfigSchema)
    .handler(async ({ data }) => {
      const { url, data: body, config } = data
      return makeRequest({
        ...(config as AxiosRequestConfig),
        method: 'PATCH',
        url,
        data: body,
      })
    }),

  request: createServerFn({ method: 'POST' })
    .inputValidator(requestConfigSchema)
    .handler(async ({ data }) => {
      return makeRequest(data as AxiosRequestConfig)
    }),
}
