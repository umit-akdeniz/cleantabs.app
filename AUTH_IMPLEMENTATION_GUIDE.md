# CleanTabs Auth Implementation Guide

## 🎯 Tamamlanan Auth Güncellemeleri

### ✅ Yapılan Değişiklikler

1. **OAuth Providers Eklendi**
   - Google OAuth entegrasyonu
   - GitHub OAuth entegrasyonu
   - Prisma Adapter ile veritabanı entegrasyonu

2. **Auth Sayfalar Güncellendi**
   - `/auth/signin` - Giriş sayfası
   - `/auth/signup` - Kayıt sayfası
   - OAuth butonları ve form entegrasyonu

3. **Navigation Bileşenleri Güncellendi**
   - BasicNav - Kullanıcı menüsü ve çıkış
   - AdvancedNav - Gelişmiş navigasyon
   - Kullanıcı profil dropdown'u

4. **Auth Configuration**
   - `authOptions.ts` - Güçlendirilmiş auth yapılandırması
   - Middleware güncellendi
   - Environment variables hazırlandı

## 🚀 Kurulum Adımları

### 1. Environment Variables

`.env.local` dosyasını oluşturun ve şu değerleri ekleyin:

```env
# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-min-32-chars"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### 2. Google OAuth Kurulumu

1. [Google Cloud Console](https://console.cloud.google.com/) gidin
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. APIs & Services > Credentials'a gidin
4. "Create Credentials" > "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Client ID ve Client Secret'i `.env.local`'a ekleyin

### 3. GitHub OAuth Kurulumu

1. [GitHub Developer Settings](https://github.com/settings/developers) gidin
2. "New OAuth App" tıklayın
3. Application name: "CleanTabs"
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
6. Client ID ve Client Secret'i `.env.local`'a ekleyin

### 4. Veritabanı Migrasyonu

```bash
npx prisma generate
npx prisma db push
```

## 🔧 Özellikler

### Auth Providers
- **Email/Password**: Geleneksel giriş
- **Google OAuth**: Google hesabı ile giriş
- **GitHub OAuth**: GitHub hesabı ile giriş

### Güvenlik
- CSRF koruması
- Rate limiting
- Secure headers
- Session management

### UI/UX
- Responsive tasarım
- Dark mode desteği
- Loading states
- Error handling

## 📱 Kullanım

### Giriş Yapmak
```jsx
import { signIn } from 'next-auth/react'

// Email/Password ile giriş
signIn('credentials', { email, password })

// Google ile giriş
signIn('google')

// GitHub ile giriş
signIn('github')
```

### Çıkış Yapmak
```jsx
import { signOut } from 'next-auth/react'

signOut({ callbackUrl: '/' })
```

### Session Kontrolü
```jsx
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()

if (status === 'loading') return <p>Loading...</p>
if (status === 'unauthenticated') return <p>Not signed in</p>
```

### Server-side Auth
```jsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

const session = await getServerSession(authOptions)
```

## 🎨 UI Components

### Auth Sayfaları
- **Sign In**: `/auth/signin`
- **Sign Up**: `/auth/signup`
- **Error**: `/auth/error`

### Navigation
- **BasicNav**: Temel navigasyon
- **AdvancedNav**: Gelişmiş navigasyon
- **User Menu**: Kullanıcı dropdown menüsü

## 🔐 Güvenlik Özellikleri

### Middleware Koruması
```typescript
// middleware.ts
export default withAuth(
  function middleware(req) {
    // Security headers
    // Rate limiting
    // CSRF protection
  }
)
```

### Protected Routes
- `/dashboard/*` - Kullanıcı panosu
- `/account/*` - Hesap ayarları
- `/settings/*` - Uygulama ayarları

### Public Routes
- `/` - Ana sayfa
- `/auth/*` - Auth sayfaları
- `/features` - Özellikler
- `/pricing` - Fiyatlandırma

## 📊 Veritabanı Modelleri

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  plan          Plan      @default(FREE)
  // ... diğer alanlar
}
```

### Account Model (OAuth)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  // ... OAuth alanları
}
```

## 🚨 Hata Ayıklama

### Yaygın Hatalar

1. **NEXTAUTH_SECRET eksik**
   - `.env.local`'da NEXTAUTH_SECRET tanımlanmalı

2. **OAuth credentials yanlış**
   - Google/GitHub console'da doğru redirect URL'leri kontrol edin

3. **Database connection hatası**
   - Prisma schema'nın güncel olduğundan emin olun

### Debug Modları

```env
# Development'ta debug modunu açın
DEBUG=true
NODE_ENV=development
```

## 🔄 Sonraki Adımlar

1. **Email Verification**: Email doğrulama sistemi
2. **Password Reset**: Şifre sıfırlama
3. **Two-Factor Auth**: İki faktörlü kimlik doğrulama
4. **Social Login**: Diğer sosyal medya entegrasyonları

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. `.env.local` dosyasının doğru yapılandırıldığından emin olun
2. OAuth aplikasyonlarının doğru kurulduğunu kontrol edin
3. Veritabanı migrasyonlarının çalıştığından emin olun

---

Bu implementasyon ile CleanTabs artık:
- ✅ Google OAuth ile giriş
- ✅ GitHub OAuth ile giriş
- ✅ Email/Password ile giriş
- ✅ Güvenli çıkış
- ✅ Session yönetimi
- ✅ Responsive UI
- ✅ Dark mode desteği

özellikleri desteklemektedir!