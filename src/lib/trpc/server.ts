import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { ZodError } from 'zod'
import superjson from 'superjson'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'

// Create context for tRPC
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  
  // Get the session from the server
  const session = await auth()
  
  return {
    req,
    res,
    session,
    prisma,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// Create a server-side caller
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

// Auth middleware
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

// Admin middleware
const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  
  if (ctx.session.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const adminProcedure = t.procedure.use(enforceUserIsAdmin)

// Rate limiting middleware
const rateLimitMiddleware = t.middleware(async ({ ctx, next, path }) => {
  // Implement rate limiting logic here
  // You can use Redis or in-memory cache
  const clientIP = ctx.req.headers['x-forwarded-for'] || ctx.req.ip || 'unknown'
  
  // Basic rate limiting - 100 requests per minute per IP
  // TODO: Implement proper rate limiting with Redis
  
  return next()
})

export const rateLimitedProcedure = t.procedure.use(rateLimitMiddleware)

// Logging middleware
const loggingMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const durationMs = Date.now() - start
  
  // Log the request
  console.log(`[${type}] ${path} - ${durationMs}ms`)
  
  return result
})

export const loggedProcedure = t.procedure.use(loggingMiddleware)

// Combined middleware for production
export const secureProcedure = protectedProcedure
  .use(rateLimitMiddleware)
  .use(loggingMiddleware)