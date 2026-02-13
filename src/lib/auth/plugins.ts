import type { BetterAuthPlugin } from 'better-auth'
import type { BetterAuthClientPlugin } from 'better-auth/client'
import { setSessionCookie } from 'better-auth/cookies'
import { createAuthEndpoint } from 'better-auth/api'
import { AxiosError } from 'axios'

import { axiosApi } from '@/lib/axios'
import { BACKEND_URL } from '@/constants/env'
import { refreshTokenBodySchema, signInBodySchema } from '@/schema/auth'

const BASE_URL = BACKEND_URL

export const customCredentials = () => {
  return {
    id: 'custom-credentials',
    endpoints: {
      signInCredentials: createAuthEndpoint(
        '/sign-in-credentials',
        {
          method: 'POST',
          body: signInBodySchema,
        },
        async (ctx) => {
          const { username, password } = ctx.body

          try {
            const { data } = await axiosApi.post<TLoginResponse>(
              `${BASE_URL}/auth/login`,
              { username, password },
            )

            const { accessToken, refreshToken } = data

            if (!accessToken)
              return ctx.json({ error: 'No access token' }, { status: 400 })

            const user = createUserFromResponse(data)
            const session = await ctx.context.internalAdapter.createSession(
              String(user.id),
              false,
              {
                accessToken: accessToken,
                refreshToken: refreshToken,
              },
            )

            await setSessionCookie(ctx, { session, user }, false)

            return ctx.json({
              success: true,
              token: session.token,
              session,
              user,
            })
          } catch (error: unknown) {
            if (error instanceof AxiosError)
              if (error.response) {
                const status = error.response.status || 400
                const message =
                  error.response.data?.message || 'Authentication failed'
                return ctx.json({ error: message }, { status })
              }
            return ctx.json({ error: 'Authentication failed' }, { status: 500 })
          }
        },
      ),

      refreshToken: createAuthEndpoint(
        '/refresh-token',
        {
          method: 'POST',
          body: refreshTokenBodySchema,
        },
        async (ctx) => {
          const session = ctx.context.session?.session

          if (!session) {
            return ctx.json({ error: 'No session found' }, { status: 401 })
          }

          const refreshToken = session.refreshToken

          if (!refreshToken) {
            return ctx.json(
              { error: 'No refresh token found' },
              { status: 401 },
            )
          }

          const expiresInMins = ctx.body.expiresInMins ?? 1440

          try {
            const { data } = await axiosApi.post<TRefreshTokenResponse>(
              `${BASE_URL}/auth/refresh`,
              {
                refreshToken,
                expiresInMins,
              },
            )

            await ctx.context.internalAdapter.updateSession(session.id, {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            })

            return ctx.json({
              success: true,
              message: 'Token refreshed successfully',
            })
          } catch (error) {
            await ctx.context.internalAdapter.deleteSession(session.id)

            return ctx.json({ error: 'Invalid refresh token' }, { status: 401 })
          }
        },
      ),
    },
  } satisfies BetterAuthPlugin
}

export const customCredentialsClient = () => {
  return {
    id: 'custom-credentials',
    $InferServerPlugin: {} as ReturnType<typeof customCredentials>,
  } satisfies BetterAuthClientPlugin
}

function createUserFromResponse(data: TLoginResponse) {
  return {
    id: String(data.id),
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender,
    image: data.image,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: true,
    name: `${data.firstName} ${data.lastName}`,
  }
}

type TLoginResponse = {
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

type TRefreshTokenResponse = {
  accessToken: string
  refreshToken: string
}
