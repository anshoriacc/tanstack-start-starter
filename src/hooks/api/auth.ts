import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { TSignInBody } from '@/schema/auth'
import { loginFn, logoutFn } from '@/server/auth'
import { api } from '@/server/axios'

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

export const useLogoutMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const res = await logoutFn()

      if ('error' in res) {
        throw res
      }

      return res
    },
    onSuccess: () => {
      navigate({ to: '/login', replace: true })
    },
  })
}

export const getCurrentUserQueryOptions = queryOptions({
  queryKey: ['auth'],
  queryFn: () => api.get<TGetCurrentUserResponse>('/auth/me'),
})

export const useGetCurrentUserQuery = () => useQuery(getCurrentUserQueryOptions)

type TGetCurrentUserResponse = {
  id: number
  firstName: string
  lastName: string
  maidenName: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: {
    color: string
    type: string
  }
  ip: string
  address: {
    address: string
    city: string
    state: string
    stateCode: string
    postalCode: string
    coordinates: {
      lat: number
      lng: number
    }
    country: string
  }
  macAddress: string
  university: string
  bank: {
    cardExpire: string
    cardNumber: string
    cardType: string
    currency: string
    iban: string
  }
  company: {
    department: string
    name: string
    title: string
    address: {
      address: string
      city: string
      state: string
      stateCode: string
      postalCode: string
      coordinates: {
        lat: number
        lng: number
      }
      country: string
    }
  }
  ein: string
  ssn: string
  userAgent: string
  crypto: {
    coin: string
    wallet: string
    network: string
  }
  role: string
}
