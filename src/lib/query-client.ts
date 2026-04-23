import { ApiError } from '@/server/axios'
import { AnyRouter } from '@tanstack/react-router'
import {
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
  environmentManager,
} from '@tanstack/react-query'
import { toast } from 'sonner'

// Module-level reference, set after router is created
let routerRef: AnyRouter | null = null

export function setRouterRef(router: AnyRouter) {
  routerRef = router
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof ApiError && error.statusCode === 401) {
          if (routerRef) {
            toast.error('Session expired, please login again')
            routerRef.navigate({ to: '/login', replace: true })
          } else {
            toast.error('Session expired, please login again')
            if (!environmentManager.isServer()) window.location.href = '/login'
          }
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.statusCode === 401)
            return false
          if (error instanceof ApiError && error.statusCode === 404)
            return false
          return failureCount < 3
        },
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
