# Site Manager

Modern ve kullanıcı dostu bir site yönetim uygulaması.

## Özellikler

- 📱 Responsive tasarım
- 🌙 Dark/Light mode
- 🏷️ Kategori ve alt kategori yönetimi
- 🔍 Gelişmiş arama
- 💾 SQLite veritabanı
- 🐳 Docker desteği

## Kurulum

### Geliştirme Ortamı

```bash
# Bağımlılıkları yükle
npm install

# Veritabanını hazırla
npm run db:push
npm run db:seed

# Geliştirme sunucusunu başlat
npm run dev
```

### Production Deployment

#### Docker ile

```bash
# Hızlı deployment
npm run deploy

# Manuel deployment
docker build -t site-manager .
docker run -p 3000:3000 -v $(pwd)/database.db:/app/database.db site-manager
```

#### Docker Compose ile

```bash
docker-compose up -d
```

## Environment Variables

`.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değişkenleri ayarlayın:

```env
DATABASE_URL="file:./database.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## Scripts

- `npm run dev` - Geliştirme sunucusu
- `npm run build` - Production build
- `npm run start` - Production sunucu
- `npm run db:seed` - Veritabanını örnek verilerle doldur
- `npm run deploy` - Docker ile deploy et

## Teknolojiler

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Database**: SQLite, Prisma ORM
- **Icons**: Lucide React
- **Deployment**: Docker

## Lisans

MIT