import type { BetterAuthPlugin } from 'better-auth'
import type { BetterAuthClientPlugin } from 'better-auth/client'
import { setSessionCookie } from 'better-auth/cookies'
import { createAuthEndpoint } from 'better-auth/api'

import { axiosApi } from '@/lib/axios'

const DUMMYJSON_BASE_URL = 'https://dummyjson.com'

export async function postLoginForm(payload) {
  const { data } = await axiosApi.post(
    `${DUMMYJSON_BASE_URL}/auth/login`,
    payload,
  )
  return data
}

export const customCredentials = () => {
  return {
    id: 'custom-credentials',
    schema: {
      session: {
        fields: {
          accessToken: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
        },
      },
    },
    endpoints: {
      signInCredentials: createAuthEndpoint(
        '/sign-in/credentials',
        { method: 'POST' },
        async (ctx) => {
          const { username, password } = ctx.body

          const res = await postLoginForm({ username, password })
          const { accessToken } = res
          console.log('res::', res)
          if (!accessToken)
            return ctx.json({ error: 'No access token' }, { status: 400 })

          const user = { ...res }
          const session = (await ctx.context.internalAdapter.createSession(
            user.id,
            false,
            {
              accessToken: accessToken,
              username: username,
              userId: user.id,
            },
          ))

          // session.accessToken = accessToken
          console.log('user::', user)
          console.log('session::', session)

          // Store token in cookie
          ctx.setCookie('access-token', accessToken) // May be removed later, since the accessToken is already stored in better-auth.session_data

          await setSessionCookie(ctx, { session, user }, false, {
            // accessToken: accessToken,
            // email: username,
            // userId: user.id,
          })

          return ctx.json({
            success: true,
            token: session.token,
            session,
            res,
          })
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
