import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
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

export const logoutFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders()
  const res = await auth.api.signOut({ headers })
  return res
})

export const getSession = createServerFn().handler(async () => {
  const headers = getRequestHeaders()
  const res = await auth.api.getSession({ headers })
  return res
})
