# Quick Deploy Guide - Auth Only

Bu rehber ödeme sistemi olmadan hızlı deployment için hazırlandı.

## 1. Environment Variables (.env.production)

Şu değişkenlerin ayarlanması gerekli:

```env
# Database (zaten var)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="nTIkvtzj/IakSRZQMkcoyZLicFCnZaWCpPAt50CdveY="
NEXTAUTH_URL="https://cleantabs-app.vercel.app"
ENCRYPTION_KEY="dbfab04615685ba5b28111e652915e5d"

# OAuth Providers (opsiyonel - boş bırakılabilir)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

## 2. OAuth Setup (Opsiyonel)

Eğer Google/GitHub login istersen:

### Google:
1. [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials
2. Create OAuth 2.0 Client ID
3. Authorized origins: `https://cleantabs-app.vercel.app`
4. Redirect URIs: `https://cleantabs-app.vercel.app/api/auth/callback/google`

### GitHub:
1. GitHub Settings > Developer settings > OAuth Apps > New OAuth App
2. Homepage URL: `https://cleantabs-app.vercel.app`
3. Authorization callback URL: `https://cleantabs-app.vercel.app/api/auth/callback/github`

## 3. Deploy

```bash
# Vercel CLI ile deploy
vercel --prod

# Ya da GitHub'dan otomatik deploy
# Repository'yi Vercel'e bağla
```

## 4. Database Migration

Deploy sonrası:

```bash
# Production database'e schema push et
npx prisma db push --accept-data-loss
```

## 5. Test

- Site açılıyor mu?
- Email/password login çalışıyor mu?
- OAuth (eğer ayarladıysan) çalışıyor mu?
- Site ekleme/düzenleme çalışıyor mu?

## Notlar

- Ödeme sistemi devre dışı (503 error döner)
- Email provider devre dışı
- Sadece credentials + OAuth authentication aktif
- Tüm yeni özellikler (drag&drop, character limits, etc.) aktif

## Sorun Giderme

Eğer OAuth provider boşsa sadece email/password login çalışır.
Vercel dashboard'dan environment variables'ları kontrol et.