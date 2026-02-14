import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'

import { TSignInBody } from '@/schema/auth'
import { loginFn } from '@/server/auth'
import { serverAxios, serverAxiosGet } from '@/server/axios'

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (data: TSignInBody) => {
      const res = await loginFn({ data })

      if ('error' in res) {
        throw res
      }

      return res
    },
  })

export const getCurrentUserQueryOptions = queryOptions({
  queryKey: ['auth'],
  queryFn: async () => {
    const res = await serverAxios.get({ data: { url: '/auth/me' } })
    console.log('res::', res)
    return res
  },
})

export const useGetCurrentUserQuery = () =>
  useQuery(getCurrentUserQueryOptions)
