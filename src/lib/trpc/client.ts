import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { type AppRouter } from '@/server/api/root'
import superjson from 'superjson'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export const api = createTRPCReact<AppRouter>()

export const trpcClient = api.createClient({
  transformer: superjson,
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        const headers = new Map<string, string>()
        headers.set('x-trpc-source', 'react')
        return Object.fromEntries(headers)
      },
    }),
  ],
})