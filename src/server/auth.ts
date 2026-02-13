import { createServerFn } from '@tanstack/react-start'
import { auth } from '@/lib/auth/server'
import { refreshTokenBodySchema, signInBodySchema } from '@/schema/auth'

export const loginFn = createServerFn()
  .inputValidator(signInBodySchema)
  .handler(async ({ data }) => {
    const res = await auth.api.signInCredentials({ body: data })
    return res
  })

export const refreshTokenFn = createServerFn()
  .inputValidator(refreshTokenBodySchema)
  .handler(async ({ data }) => {
    const res = await auth.api.refreshToken({ body: data })
    return res
  })
