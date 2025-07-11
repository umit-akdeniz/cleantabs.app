import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
// import { PrismaAdapter } from "@next-auth/prisma-adapter" // Not used with JWT strategy
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Authorize called with:', { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          return null
        }

        try {
          console.log('Looking for user:', credentials.email);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          console.log('User found:', user ? { id: user.id, email: user.email, hasPassword: !!user.password } : 'No user found');

          if (!user || !user.password) {
            console.log('User not found or no password');
            return null
          }

          console.log('Comparing passwords...');
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password');
            return null
          }

          const returnUser = {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            image: user.image || undefined,
            plan: user.plan,
          };
          
          console.log('Returning user:', returnUser);
          return returnUser;
        } catch (error) {
          console.error('Auth error:', error);
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT callback - token:', token?.email, 'user:', user?.email);
      if (user) {
        token.id = user.id;
        token.plan = user.plan;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - session:', session?.user?.email, 'token:', token?.email);
      if (token && session.user) {
        session.user.id = token.id as string || token.sub!;
        session.user.plan = (token.plan as "FREE" | "PREMIUM") || "FREE";
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}