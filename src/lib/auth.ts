import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    // Only add OAuth providers if they are configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })] : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })] : []),
    // Email provider - only add if configured
    ...(process.env.EMAIL_SERVER_HOST ? [EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    })] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('Auth attempt for:', credentials?.email);
          
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            return null
          }

          console.log('Looking up user in database...');
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })
          
          console.log('User found:', user ? 'Yes' : 'No');

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
            return null
          }

          console.log('Auth successful for user:', user.id);
          return {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            plan: user.plan,
          }
        } catch (error: any) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (['google', 'github', 'email'].includes(account?.provider)) {
        try {
          // OAuth ile giriş yapan kullanıcıyı veritabanında bul veya oluştur
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          });

          if (!existingUser) {
            // Yeni kullanıcı oluştur
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || user.email?.split('@')[0],
                image: user.image,
                plan: 'FREE',
                emailVerified: account?.provider === 'email' ? new Date() : null
              }
            });
          } else {
            // Mevcut kullanıcı varsa image'ı güncelle
            await prisma.user.update({
              where: { email: user.email },
              data: {
                name: user.name,
                image: user.image
              }
            });
          }
          return true;
        } catch (error) {
          console.error('OAuth sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.plan = user.plan
      } else if (token.email) {
        // OAuth kullanıcıları için plan bilgisini veritabanından al
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email }
        });
        if (dbUser) {
          token.plan = dbUser.plan;
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (token && token.sub) {
        session.user.id = token.sub
        session.user.plan = token.plan || 'FREE'
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
}