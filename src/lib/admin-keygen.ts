import crypto from 'crypto';

// Admin URL için eşsiz keygen oluşturucu
export function generateAdminKey(): string {
  // Zaman damgası + rastgele hash
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(32).toString('hex');
  const combinedString = `${timestamp}-${randomBytes}`;
  
  // SHA-256 hash oluştur
  const hash = crypto.createHash('sha256').update(combinedString).digest('hex');
  
  // 64 karakter uzunluğunda eşsiz key döndür
  return hash;
}

// Admin key'i doğrulama
export function validateAdminKey(key: string): boolean {
  if (!key || typeof key !== 'string' || key.length !== 64) {
    return false;
  }
  
  // Sadece hexadecimal karakterler olup olmadığını kontrol et
  const hexRegex = /^[a-f0-9]+$/i;
  return hexRegex.test(key);
}

// Admin key'i localStorage'da saklama
export function storeAdminKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_access_key', key);
    // Key'i 1 saat sonra otomatik sil
    setTimeout(() => {
      localStorage.removeItem('admin_access_key');
    }, 3600000); // 1 saat = 3600000 ms
  }
}

// Admin key'i localStorage'dan alma
export function getStoredAdminKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_access_key');
  }
  return null;
}

// Admin key'i temizleme
export function clearAdminKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_access_key');
  }
}