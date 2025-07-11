import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      plan: "FREE" | "PREMIUM"
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
    plan: "FREE" | "PREMIUM"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    plan?: "FREE" | "PREMIUM"
  }
}