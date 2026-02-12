import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const getAccessTokenCookie = createServerFn().handler(() => {
  const cookie = getCookie('dummy_access_token')
  return cookie
})
