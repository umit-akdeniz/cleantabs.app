import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      plan: "FREE" | "PREMIUM"
    } & DefaultSession["user"]
  }
  
  interface User {
    plan: "FREE" | "PREMIUM"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    plan: "FREE" | "PREMIUM"
    isValid?: boolean
    lastValidated?: number
  }
}