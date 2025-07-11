# 🚀 CleanTabs Production Deployment Guide

## 🔐 Güvenlik Önlemleri Tamamlandı

### ✅ Yapılan Güvenlik Güncellemeleri:

1. **Güvenlik Kütüphanesi** (`lib/security.ts`)
   - Rate limiting sistemi
   - CSRF koruması
   - Input sanitization
   - Password hashing
   - Data encryption/decryption
   - Güvenli token üretimi

2. **Environment Variables Güvenliği**
   - Production için optimize edilmiş
   - Tüm kritik değişkenler tanımlandı
   - Encryption key eklendi

3. **Database Güvenliği**
   - PostgreSQL prodüksiyon yapılandırması
   - Shadow database desteği
   - Connection pooling

4. **Network Güvenliği**
   - Nginx reverse proxy
   - SSL/TLS yapılandırması
   - Rate limiting
   - Security headers

## 🛠️ Deployment Seçenekleri

### Option 1: Docker ile Deployment (Önerilen)

```bash
# 1. Environment dosyasını hazırlayın
cp .env.example .env.production

# 2. Production değerlerini girin
nano .env.production

# 3. Docker compose ile başlatın
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Manuel Deployment

```bash
# 1. Deployment scriptini çalıştırın
./production-deploy.sh

# 2. Health check yapın
curl https://cleantabs.app/api/health
```

### Option 3: Vercel/Netlify (Basit)

```bash
# 1. Platform'a bağlan
vercel --prod
# veya
netlify deploy --prod
```

## 📋 Deployment Checklist

### Ön Hazırlık:
- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası hazır
- [ ] PostgreSQL database kuruldu
- [ ] Redis cache kuruldu (opsiyonel)

### Environment Variables:
```env
# Kritik Değişkenler
NEXTAUTH_URL="https://cleantabs.app"
NEXTAUTH_SECRET="oxZ4AVcAy2ojZ5jXc8OvBT2VgIod8UG3333HiTrb/68="
GOOGLE_CLIENT_ID="8581821519-hd4tis25dfh9tnsp168slapdojkequs0.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
GITHUB_ID="Ov23liA9bGTnjV5KnpYr"
GITHUB_SECRET="769830451d7ed5af072dc43c993671689ef1c24a"
DATABASE_URL="postgresql://username:password@localhost:5432/cleantabs_production"
ENCRYPTION_KEY="CleanTabs2024SecureKey32CharMin!!"
```

### OAuth Yapılandırması:
- [ ] Google Console'da redirect URI: `https://cleantabs.app/api/auth/callback/google`
- [ ] GitHub'da callback URL: `https://cleantabs.app/api/auth/callback/github`

### Database Yapılandırması:
- [ ] PostgreSQL kurulumu
- [ ] Database kullanıcısı ve şifre
- [ ] Connection string doğru
- [ ] Migrations çalıştırıldı

## 🔒 Güvenlik Ayarları

### 1. SSL/TLS Sertifikası
```bash
# Let's Encrypt ile ücretsiz SSL
sudo certbot --nginx -d cleantabs.app -d www.cleantabs.app
```

### 2. Firewall Ayarları
```bash
# Sadece gerekli portları açın
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 3. Database Güvenliği
```sql
-- Güvenli kullanıcı oluşturma
CREATE USER cleantabs WITH PASSWORD 'strong_password_here';
GRANT CONNECT ON DATABASE cleantabs_production TO cleantabs;
GRANT USAGE ON SCHEMA public TO cleantabs;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cleantabs;
```

### 4. Rate Limiting
- API endpoints için 10 req/sec
- Auth endpoints için 5 req/sec
- Nginx seviyesinde rate limiting

### 5. Security Headers
```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
```

## 📊 Monitoring ve Logging

### Health Check
```bash
curl https://cleantabs.app/api/health
```

### Log Monitoring
```bash
# Application logs
docker logs cleantabs_app

# Nginx logs
docker logs cleantabs_nginx

# Database logs
docker logs cleantabs_postgres
```

### Performance Monitoring
- Response time monitoring
- Database query performance
- Memory usage tracking
- CPU usage monitoring

## 🔄 Backup Stratejisi

### Database Backup
```bash
# Günlük backup
pg_dump -h localhost -U cleantabs cleantabs_production > backup_$(date +%Y%m%d).sql

# Otomatik backup script
0 2 * * * pg_dump -h localhost -U cleantabs cleantabs_production > /backups/daily_$(date +%Y%m%d).sql
```

### File System Backup
```bash
# Uygulama dosyaları
tar -czf app_backup_$(date +%Y%m%d).tar.gz /var/www/cleantabs

# Environment dosyaları
cp .env.production /backups/env_$(date +%Y%m%d).backup
```

## 🚨 Troubleshooting

### Common Issues:

1. **OAuth Callback Error**
   - Google/GitHub console'da callback URL'leri kontrol edin
   - NEXTAUTH_URL değişkenini doğrulayın

2. **Database Connection Error**
   - DATABASE_URL connection string'i kontrol edin
   - Database kullanıcı izinlerini kontrol edin

3. **SSL Certificate Error**
   - Certificate dosyalarının yollarını kontrol edin
   - Certificate'ın geçerliliğini kontrol edin

4. **Rate Limiting Issues**
   - Nginx configuration'ı kontrol edin
   - Rate limit değerlerini ayarlayın

### Emergency Procedures:

1. **Service Restart**
   ```bash
   docker-compose -f docker-compose.prod.yml restart
   ```

2. **Database Rollback**
   ```bash
   psql -h localhost -U cleantabs -d cleantabs_production < backup_YYYYMMDD.sql
   ```

3. **SSL Certificate Renewal**
   ```bash
   sudo certbot renew --nginx
   ```

## 📞 Support ve Maintenance

### Regular Maintenance:
- [ ] Weekly security updates
- [ ] Monthly dependency updates
- [ ] Quarterly security audits
- [ ] Daily backup verification

### Performance Optimization:
- [ ] Database query optimization
- [ ] CDN configuration
- [ ] Image optimization
- [ ] Cache configuration

---

## 🎯 Deployment Komutu

```bash
# Tek komut ile deploy
chmod +x production-deploy.sh && ./production-deploy.sh
```

**Tebrikler! 🎉 CleanTabs artık production'da güvenli bir şekilde çalışmaya hazır.**

Deploy sonrası kontrol edin:
- ✅ https://cleantabs.app
- ✅ https://cleantabs.app/api/health
- ✅ Google OAuth ile giriş
- ✅ GitHub OAuth ile giriş
- ✅ SSL sertifikası
- ✅ Security headers