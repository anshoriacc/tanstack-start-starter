import { betterAuth } from 'better-auth'
import { createAuthMiddleware, customSession } from 'better-auth/plugins'
import { getServerSession } from '@/server/auth'
import { customCredentials } from './plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    cookieCache: { enabled: true, maxAge: 1000 * 60 * 60 },
  },
  emailAndPassword: { enabled: false },
  hooks: {
    // before: createAuthMiddleware(async (ctx) => {
    //   switch (ctx.path) {
    //     case '/get-session': {
    //       const session = await getServerSession();
    //       if (session) {
    //         const _session = JSON.parse(session);
    //         if (_session?.session?.session) {
    //           return ctx.json(_session?.session ?? {});
    //         }
    //       }
    //       return null;
    //     }
    //   }
    // }),
  },
  plugins: [
    customCredentials(),
    customSession(async ({ session, user }) => ({ session, user })),
    tanstackStartCookies(),
  ],
})
