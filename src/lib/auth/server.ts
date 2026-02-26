import { betterAuth } from 'better-auth'
import { customSession } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { customCredentials } from './plugins'
import { BETTER_AUTH_BASE_URL, BETTER_AUTH_SECRET } from '@/constants/env'

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_BASE_URL,
  emailAndPassword: { enabled: false },
  session: {
    cookieCache: { enabled: true, maxAge: 60 * 60 },
    additionalFields: {
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
    },
  },
  user: {
    additionalFields: {
      username: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      gender: { type: 'string' },
      image: { type: 'string' },
    },
  },
  plugins: [
    tanstackStartCookies(),
    customCredentials(),
    customSession(async ({ session, user }) => {
      const extendedSession = session as typeof session & {
        accessToken?: string
        refreshToken?: string
      }
      const extendedUser = user as typeof user & {
        username?: string
        firstName?: string
        lastName?: string
        gender?: string
        image?: string
      }

      return {
        session: {
          ...session,
          accessToken: extendedSession.accessToken,
          refreshToken: extendedSession.refreshToken,
        },
        user: {
          ...user,
          username: extendedUser.username,
          firstName: extendedUser.firstName,
          lastName: extendedUser.lastName,
          gender: extendedUser.gender,
          image: extendedUser.image,
        },
      }
    }),
  ],
})
