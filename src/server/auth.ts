import { auth } from '@/lib/auth/server'
import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const login = createServerFn().handler(async ({ data }) => {
  return await auth.api.signInCredentials({ body: data })
})

export const getServerSession = createServerFn().handler(() => {
  const cookie = getCookie('better-auth.session_data')
  return cookie
})
