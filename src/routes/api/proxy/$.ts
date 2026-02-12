import { createFileRoute } from '@tanstack/react-router'
import { getCookie } from '@tanstack/react-start/server'

const DUMMYJSON_BASE_URL = 'https://dummyjson.com'

/**
 * Server-side proxy for authenticated requests to DummyJSON API.
 *
 * This route reads the httpOnly access token from the cookie and attaches
 * it to requests to DummyJSON, allowing secure authenticated API calls.
 *
 * Usage:
 * - Client calls: /api/proxy/users/me
 * - Server reads httpOnly cookie, forwards to: https://dummyjson.com/users/me
 * - Server returns DummyJSON response to client
 */
export const Route = createFileRoute('/api/proxy/$')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        // Get the access token from httpOnly cookie
        const accessToken = getCookie('dummy_access_token')

        if (!accessToken) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized - No access token' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } },
          )
        }

        // Build the target URL
        const path = params._splat || ''
        const url = new URL(request.url)
        const targetUrl = `${DUMMYJSON_BASE_URL}/${path}${url.search}`

        try {
          // Forward the request to DummyJSON with the access token
          const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })

          // If DummyJSON returns 401, the token might be expired
          if (response.status === 401) {
            return new Response(
              JSON.stringify({ error: 'Unauthorized - Token expired' }),
              { status: 401, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Return the DummyJSON response
          const data = await response.json()
          return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to proxy request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },

      POST: async ({ request, params }) => {
        const accessToken = getCookie('dummy_access_token')

        if (!accessToken) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized - No access token' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const path = params._splat || ''
        const url = new URL(request.url)
        const targetUrl = `${DUMMYJSON_BASE_URL}/${path}${url.search}`

        try {
          const body = await request.json()

          const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })

          if (response.status === 401) {
            return new Response(
              JSON.stringify({ error: 'Unauthorized - Token expired' }),
              { status: 401, headers: { 'Content-Type': 'application/json' } },
            )
          }

          const data = await response.json()
          return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to proxy request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },

      PUT: async ({ request, params }) => {
        const accessToken = getCookie('dummy_access_token')

        if (!accessToken) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized - No access token' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const path = params._splat || ''
        const url = new URL(request.url)
        const targetUrl = `${DUMMYJSON_BASE_URL}/${path}${url.search}`

        try {
          const body = await request.json()

          const response = await fetch(targetUrl, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })

          if (response.status === 401) {
            return new Response(
              JSON.stringify({ error: 'Unauthorized - Token expired' }),
              { status: 401, headers: { 'Content-Type': 'application/json' } },
            )
          }

          const data = await response.json()
          return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to proxy request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },

      DELETE: async ({ request, params }) => {
        const accessToken = getCookie('dummy_access_token')

        if (!accessToken) {
          return new Response(
            JSON.stringify({ error: 'Unauthorized - No access token' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } },
          )
        }

        const path = params._splat || ''
        const url = new URL(request.url)
        const targetUrl = `${DUMMYJSON_BASE_URL}/${path}${url.search}`

        try {
          const response = await fetch(targetUrl, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })

          if (response.status === 401) {
            return new Response(
              JSON.stringify({ error: 'Unauthorized - Token expired' }),
              { status: 401, headers: { 'Content-Type': 'application/json' } },
            )
          }

          const data = await response.json()
          return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to proxy request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
