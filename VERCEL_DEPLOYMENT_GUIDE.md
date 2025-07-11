# 🚀 CleanTabs Vercel Deployment Guide

## ✅ Vercel Deployment Hazırlığı Tamamlandı

### 📋 Yapılan Güncellemeler:

1. **vercel.json** - Vercel yapılandırması güncellendi
2. **package.json** - Vercel build script'i eklendi
3. **prisma/schema.prisma** - Vercel için database yapılandırması
4. **Environment Variables** - Vercel için optimize edildi

## 🗄️ Database Kurulumu (Önce Bu Adımı Yapın)

### Neon Database (Ücretsiz & Önerilen):

1. [Neon.tech](https://neon.tech) hesabı oluşturun
2. Yeni PostgreSQL database oluşturun
3. Connection string'i kopyalayın

### Alternatif Database Sağlayıcıları:
- **Supabase**: Ücretsiz PostgreSQL
- **PlanetScale**: MySQL alternatifi  
- **Railway**: PostgreSQL hosting
- **Aiven**: Managed PostgreSQL

## 🚀 Vercel Deployment Adımları

### 1. Vercel CLI Kurulumu
```bash
npm install -g vercel
```

### 2. Vercel'e Login
```bash
vercel login
```

### 3. Projeyi Bağlayın
```bash
vercel link
```

### 4. Environment Variables Ayarlayın

Vercel dashboard'da veya CLI ile:

```bash
# Temel Auth
vercel env add NEXTAUTH_URL
# Değer: https://cleantabs.app

vercel env add NEXTAUTH_SECRET
# Değer: oxZ4AVcAy2ojZ5jXc8OvBT2VgIod8UG3333HiTrb/68=

# Google OAuth
vercel env add GOOGLE_CLIENT_ID
# Değer: 8581821519-hd4tis25dfh9tnsp168slapdojkequs0.apps.googleusercontent.com

vercel env add GOOGLE_CLIENT_SECRET
# Değer: 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

# GitHub OAuth
vercel env add GITHUB_ID
# Değer: Ov23liA9bGTnjV5KnpYr

vercel env add GITHUB_SECRET
# Değer: 769830451d7ed5af072dc43c993671689ef1c24a

# Database (Neon'dan alacağınız)
vercel env add DATABASE_URL
# Değer: postgresql://username:password@host:5432/cleantabs_production?sslmode=require

vercel env add DIRECT_URL
# Değer: postgresql://username:password@host:5432/cleantabs_production?sslmode=require

# Güvenlik
vercel env add ENCRYPTION_KEY
# Değer: CleanTabs2024SecureKey32CharMin!!

# Uygulama
vercel env add NEXT_PUBLIC_APP_URL
# Değer: https://cleantabs.app

vercel env add NODE_ENV
# Değer: production
```

### 5. Database Migration
```bash
# Local'de migration dosyaları oluşturun
npx prisma migrate dev --name init

# Vercel'de migration çalışacak otomatik
```

### 6. Deploy Edin
```bash
vercel --prod
```

## 🔧 Vercel Dashboard Ayarları

### Domain Ayarları:
1. Vercel dashboard > Settings > Domains
2. `cleantabs.app` domain'ini ekleyin
3. DNS ayarlarını yapın

### Build & Development Settings:
- **Build Command**: `prisma generate && prisma migrate deploy && next build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Function Settings:
- **Runtime**: Node.js 18.x
- **Max Duration**: 30 seconds
- **Memory**: 1024 MB

## 🔐 OAuth Providers Güncelleme

### Google OAuth:
- **Authorized redirect URIs**: `https://cleantabs.app/api/auth/callback/google`
- **Authorized domains**: `cleantabs.app`

### GitHub OAuth:
- **Homepage URL**: `https://cleantabs.app`
- **Authorization callback URL**: `https://cleantabs.app/api/auth/callback/github`

## 📊 Deployment Kontrolleri

### 1. Health Check
```bash
curl https://cleantabs.app/api/health
```

### 2. OAuth Test
- Google ile giriş test edin
- GitHub ile giriş test edin

### 3. Database Test
- Kayıt ol ve giriş yap
- Database connection'ı test edin

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   ```
   Error: Cannot reach database server
   ```
   **Çözüm**: DATABASE_URL ve DIRECT_URL'yi kontrol edin

2. **OAuth Callback Error**
   ```
   Error: Invalid redirect URI
   ```
   **Çözüm**: Google/GitHub console'da callback URL'leri güncelleyin

3. **Build Error**
   ```
   Error: Prisma schema not found
   ```
   **Çözüm**: `prisma generate` komutunun build'de çalıştığından emin olun

4. **Environment Variables Not Found**
   ```
   Error: NEXTAUTH_SECRET is required
   ```
   **Çözüm**: Vercel dashboard'da environment variables'ı kontrol edin

## 📈 Performance Optimizations

### 1. Database Connection Pooling
```javascript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 2. Edge Functions
```javascript
// middleware.ts
export const config = {
  matcher: [
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
  runtime: 'edge',
}
```

### 3. ISR (Incremental Static Regeneration)
```javascript
// app/page.tsx
export const revalidate = 3600 // 1 hour
```

## 🔄 Continuous Deployment

### GitHub Integration:
1. Vercel dashboard > Git Integration
2. GitHub repository'nizi bağlayın
3. Otomatik deployment aktif olacak

### Deployment Branches:
- **Production**: `main` branch
- **Preview**: Feature branches
- **Development**: `develop` branch

## 📊 Monitoring

### Vercel Analytics:
- **Performance**: Core Web Vitals
- **Usage**: Function invocations
- **Errors**: Runtime errors

### Custom Monitoring:
```javascript
// lib/monitoring.ts
export function trackError(error: Error, context: string) {
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service
    console.error(`[${context}]`, error)
  }
}
```

## 🎯 Final Deployment Command

```bash
# Tek seferde deploy
vercel --prod
```

## ✅ Deployment Checklist

- [ ] Database (Neon) kuruldu
- [ ] Environment variables ayarlandı
- [ ] OAuth providers güncellendi
- [ ] Domain DNS ayarları yapıldı
- [ ] vercel.json yapılandırıldı
- [ ] Build script'leri güncellendi
- [ ] Health check çalışıyor
- [ ] OAuth giriş testleri yapıldı

---

## 🎉 Deployment Tamamlandı!

Vercel deployment'ı tamamlandıktan sonra:

1. **Ana Site**: https://cleantabs.app
2. **Health Check**: https://cleantabs.app/api/health
3. **Admin Panel**: https://vercel.com/dashboard

**Tebrikler! CleanTabs artık Vercel'de canlı! 🚀**