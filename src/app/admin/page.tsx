'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

export default function CtAdminPage() {
  const { data: session, status } = useSession();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Admin email kontrolü
  const isAdminEmail = session?.user?.email === 'umitakdenizjob@gmail.com';
  
  useEffect(() => {
    if (status === 'loading') return; // Loading durumunda bekle
    
    if (!session) {
      // Giriş yapılmamışsa ana sayfaya yönlendir
      router.push('/');
      return;
    }
    
    if (session && !isAdminEmail) {
      // Yetkisiz kullanıcı - sadece animasyon göster
      return;
    }
  }, [session, status, isAdminEmail, router]);
  
  // Loading durumu
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Yükleniyor...</div>
      </div>
    );
  }
  
  // Giriş yapılmamışsa yönlendir
  if (!session) {
    return null;
  }
  
  // Yetkisiz kullanıcı - sadece animasyon göster
  if (!isAdminEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          {/* Hareket eden çemberler */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 bg-purple-400/30 rounded-full animate-bounce`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <div
                key={`large-${i}`}
                className={`absolute w-8 h-8 bg-purple-500/20 rounded-full animate-pulse`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
            {[...Array(6)].map((_, i) => (
              <div
                key={`xl-${i}`}
                className={`absolute w-12 h-12 bg-purple-600/15 rounded-full animate-ping`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
          
          {/* Orta kısımda mesaj */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600/20 rounded-full mb-6">
                <Shield className="w-10 h-10 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Erişim Kısıtlı</h1>
              <p className="text-purple-200/80">Bu alana erişim yetkiniz bulunmamaktadır</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Admin şifresi kontrolü
    if (password === 'ctadmin2024!') {
      try {
        // Güvenli admin key oluştur
        const response = await fetch('/api/admin/generate-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate admin key');
        }
        
        const data = await response.json();
        
        // Güvenli admin paneline yönlendir
        router.push(`/secure-admin/${data.adminKey}`);
      } catch (error) {
        console.error('Admin key generation error:', error);
        setError('Güvenlik anahtarı oluşturulamadı. Lütfen tekrar deneyin.');
      }
    } else {
      setError('Yanlış şifre girdiniz.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo ve başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CleanTabs Admin</h1>
          <p className="text-purple-200">Sistem yönetim paneli</p>
        </div>

        {/* Giriş formu */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Admin Şifresi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="Şifrenizi girin"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Giriş yapılıyor...' : 'Admin Paneline Giriş'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-center text-white/60 text-sm">
              Sadece yetkili personel erişebilir
            </p>
          </div>
        </div>

        {/* Alt bilgi */}
        <div className="text-center mt-8">
          <p className="text-purple-200/60 text-sm">
            CleanTabs v1.0 - Sistem Yönetimi
          </p>
        </div>
      </div>
    </div>
  );
}