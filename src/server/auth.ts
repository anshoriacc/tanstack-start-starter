import { createServerFn } from '@tanstack/react-start'
import { auth } from '@/lib/auth/server'
import { refreshTokenBodySchema, signInBodySchema } from '@/schema/auth'
import { getRequestHeaders } from '@tanstack/react-start/server'

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

export const logoutFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders()
  const res = await auth.api.signOut({ headers })
  return res
})
