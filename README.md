# CleanTabs - Production Ready

**CleanTabs** is a minimal bookmark manager built with Next.js 15, ready for production deployment.

## 🚀 Quick Start

1. **Environment Setup:**
   ```bash
   cp .env.example .env
   # Fill in your production values
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Build:**
   ```bash
   npm run build
   ```

5. **Start:**
   ```bash
   npm start
   ```

## 🔐 Environment Variables Required

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret key  
- `NEXTAUTH_URL` - Your domain URL
- `ENCRYPTION_KEY` - 32+ character encryption key
- Firebase Push Notification credentials (see .env.example)

## 📦 Production Features

- ✅ Hardcoded secrets removed
- ✅ Environment-based configuration
- ✅ Security headers and HTTPS enforcement
- ✅ Production-optimized build
- ✅ Clean codebase - dev/test files removed
- ✅ Firebase push notifications ready
- ✅ Authentication system
- ✅ Bookmark management

## 🔒 Security

All sensitive data must be provided via environment variables. No hardcoded credentials remain in the codebase.

## 📱 Deploy

Ready for deployment on Vercel, Railway, or any Node.js hosting platform.