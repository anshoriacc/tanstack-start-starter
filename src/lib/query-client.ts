import { ApiError } from '@/server/axios'
import {
  QueryCache,
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query'
import { AnyRouter } from '@tanstack/react-router'

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
            routerRef.navigate({ to: '/login', replace: true })
          } else {
            if (!isServer) window.location.href = '/login'
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
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
