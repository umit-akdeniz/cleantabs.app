import { PrismaClient } from '@prisma/client'

// Edge Runtime compatible Prisma client
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'minimal',
  })
}

// Global instance for reuse
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use singleton pattern but without Node.js specific event handlers
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}