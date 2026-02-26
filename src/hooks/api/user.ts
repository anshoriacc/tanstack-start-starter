import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from '@/server/axios'

export const getUserListQueryOptions = (params?: TGetUserListParams) =>
  queryOptions({
    queryKey: ['users', params],
    queryFn: () => {
      const { select, filter, ...rest } = params ?? {}
      const filterParams: Record<string, string> = {}
      filter?.forEach(({ key, value }) => {
        filterParams[key] = value
      })
      return api.get<TGetUserListResponse>('/users', {
        params: {
          ...rest,
          select: select?.join(','),
          ...filterParams,
        },
      })
    },
  })

export const useGetUserListQuery = (params?: TGetUserListParams) =>
  useQuery(getUserListQueryOptions(params))

export type TGetUserListParams = {
  limit?: number
  skip?: number
  select?: Array<keyof TUser>
  filter?: Array<{ key: string; value: string }>
}

export type TUser = {
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
  role: 'admin' | 'moderator' | 'user'
}

export type TGetUserListResponse = {
  users: Array<TUser>
  total: number
  skip: number
  limit: number
}
