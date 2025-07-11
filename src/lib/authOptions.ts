import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),
    // GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "user:email"
        }
      }
    }),
    // Email/Password Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        }).catch(error => {
          console.error('Database error in authorize:', error);
          return null;
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
          image: user.image || undefined,
          plan: user.plan,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth providers için özel işlemler
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          }).catch(error => {
            console.error('Database error in signIn callback:', error);
            return null;
          });

          if (!existingUser) {
            // Yeni kullanıcı oluştur
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split('@')[0],
                image: user.image,
                plan: 'FREE',
                emailVerified: new Date(),
              }
            });
          } else {
            // Mevcut kullanıcıyı güncelle
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
              }
            });
          }
        } catch (error) {
          console.error('OAuth sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.plan = user.plan
        return token
      } else if (token.email) {
        // Kullanıcı bilgilerini veritabanından kontrol et
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email }
          });
          
          if (!dbUser) {
            // Kullanıcı veritabanında yoksa token'i geçersiz kıl
            console.log('User not found in database, invalidating token:', token.email);
            return {} as any; // Empty token to trigger signout
          }
          
          // Kullanıcı bilgilerini güncelle
          token.plan = dbUser.plan;
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.isValid = true;
          token.lastValidated = Date.now();
        } catch (error) {
          console.error('Database error in JWT callback:', error);
          // Database hatası varsa token'i geçersiz kıl
          return {} as any; // Empty token to trigger signout
        }
      }
      return token
    },
    async session({ session, token }) {
      // Token geçerli değilse session'i geçersiz kıl
      if (!token || !token.isValid || !token.email) {
        console.log('Invalid token, clearing session');
        // Return minimal session to avoid TypeScript errors
        return {
          user: {
            id: '',
            email: '',
            name: '',
            plan: 'FREE'
          },
          expires: new Date(0).toISOString()
        } as any;
      }
      
      if (token && token.sub) {
        session.user.id = token.sub
        session.user.plan = token.plan || 'FREE'
        session.user.name = token.name as string
        if (token.picture) {
          session.user.image = token.picture as string
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Auth işlemlerinden sonra yönlendirme
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/dashboard'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  events: {
    async signIn({ user, account, profile }) {
      console.log(`User ${user.email} signed in with ${account?.provider}`);
    },
    async signOut({ session, token }) {
      console.log(`User ${session?.user?.email || token?.email} signed out`);
      // Server-side cleanup if needed
    },
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`);
    },
    async session({ session, token }) {
      // Session her çağrıldığında kontrol et
      if (token && !token.isValid) {
        console.log('Invalid token detected in session event');
      }
    }
  }
}