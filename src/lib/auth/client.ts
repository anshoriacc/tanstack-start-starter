import { createAuthClient } from 'better-auth/react'
import {
  customSessionClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins'

import type { auth } from '@/lib/auth/server'
import { BETTER_AUTH_BASE_URL } from '@/constants/env'
import { customCredentialsClient } from './plugins'

export const authClient = createAuthClient({
  baseURL: BETTER_AUTH_BASE_URL,
  plugins: [
    customCredentialsClient(),
    customSessionClient<typeof auth>(),
    inferAdditionalFields<typeof auth>(),
  ],
})

export const { useSession } = authClient
