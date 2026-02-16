import { createAuthClient } from 'better-auth/react'
import {
  customSessionClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins'

import { customCredentialsClient } from './plugins'
import type { auth } from '@/lib/auth/server'
import { SITE_URL } from '@/constants/env'

export const authClient = createAuthClient({
  baseURL: SITE_URL,
  plugins: [
    customCredentialsClient(),
    customSessionClient<typeof auth>(),
    inferAdditionalFields<typeof auth>(),
  ],
})

export const { useSession } = authClient
