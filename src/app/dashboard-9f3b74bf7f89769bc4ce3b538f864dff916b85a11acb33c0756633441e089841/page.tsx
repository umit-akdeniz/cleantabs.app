'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Users, 
  Globe, 
  BarChart3, 
  Settings, 
  Shield, 
  UserCheck, 
  UserX, 
  Database,
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  Mail,
  Trash2,
  Edit,
  Eye,
  Plus
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'FREE' | 'PREMIUM';
  createdAt: string;
  emailVerified: string | null;
}

interface SiteStats {
  totalSites: number;
  totalCategories: number;
  totalSubcategories: number;
  activeReminders: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [siteStats, setSiteStats] = useState<SiteStats>({
    totalSites: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    activeReminders: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // Bu endpoint'leri ileride oluşturacağız
      const [usersRes, statsRes] = await Promise.all([
        fetch('/api/admin/users').then(res => res.ok ? res.json() : { users: [] }),
        fetch('/api/admin/stats').then(res => res.ok ? res.json() : { 
          totalSites: 0, 
          totalCategories: 0, 
          totalSubcategories: 0, 
          activeReminders: 0 
        })
      ]);
      
      setUsers(usersRes.users || []);
      setSiteStats(statsRes);
    } catch (error) {
      console.error('Admin data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  const handleUserAction = async (userId: string, action: 'approve' | 'suspend' | 'delete') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        await fetchAdminData();
      }
    } catch (error) {
      console.error('User action error:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }: {
    icon: any;
    title: string;
    value: string | number;
    change?: string;
    color: string;
  }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${
          color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
          color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
          color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
          'bg-orange-100 dark:bg-orange-900/30'
        }`}>
          <Icon className={`w-6 h-6 ${
            color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
            color === 'green' ? 'text-green-600 dark:text-green-400' :
            color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
            'text-orange-600 dark:text-orange-400'
          }`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400">CleanTabs Yönetim Paneli</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {session?.user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'users', label: 'Kullanıcılar', icon: Users },
                { id: 'sites', label: 'Site Yönetimi', icon: Globe },
                { id: 'settings', label: 'Ayarlar', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Toplam Kullanıcı"
                value={users.length}
                change="+12% bu ay"
                color="blue"
              />
              <StatCard
                icon={Globe}
                title="Toplam Site"
                value={siteStats.totalSites}
                change="+8% bu ay"
                color="green"
              />
              <StatCard
                icon={Database}
                title="Kategoriler"
                value={siteStats.totalCategories}
                change="+5% bu ay"
                color="purple"
              />
              <StatCard
                icon={Activity}
                title="Aktif Hatırlatıcılar"
                value={siteStats.activeReminders}
                change="+15% bu ay"
                color="orange"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Son Aktiviteler</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { user: 'john@example.com', action: 'Yeni hesap oluşturdu', time: '5 dakika önce', type: 'user' },
                    { user: 'jane@example.com', action: 'Premium plana geçti', time: '2 saat önce', type: 'upgrade' },
                    { user: 'mike@example.com', action: '15 yeni site ekledi', time: '4 saat önce', type: 'content' },
                    { user: 'sarah@example.com', action: 'Hesabını sildi', time: '1 gün önce', type: 'user' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'upgrade' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-white">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Kullanıcı Yönetimi</h2>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Yeni Kullanıcı
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Kullanıcı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Kayıt Tarihi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                          Yükleniyor...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                          Kullanıcı bulunamadı
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-slate-900 dark:text-white">
                                {user.name || 'İsimsiz'}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.plan === 'PREMIUM' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.emailVerified 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {user.emailVerified ? 'Onaylı' : 'Bekliyor'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUserAction(user.id, 'approve')}
                                className="text-green-600 hover:text-green-700 dark:text-green-400"
                                title="Onayla"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                                title="Askıya Al"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                              <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400" title="Düzenle">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-slate-600 hover:text-slate-700 dark:text-slate-400" title="Görüntüle">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="text-red-600 hover:text-red-700 dark:text-red-400"
                                title="Sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sites Tab */}
        {activeTab === 'sites' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Site ve İçerik Yönetimi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Site İstatistikleri</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Toplam Site</span>
                    <span className="font-medium text-slate-900 dark:text-white">{siteStats.totalSites}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Kategoriler</span>
                    <span className="font-medium text-slate-900 dark:text-white">{siteStats.totalCategories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Alt Kategoriler</span>
                    <span className="font-medium text-slate-900 dark:text-white">{siteStats.totalSubcategories}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Popüler Siteler</h3>
                <div className="space-y-2">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    En çok eklenen siteler yakında burada görünecek
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Hatırlatıcılar</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Aktif</span>
                    <span className="font-medium text-slate-900 dark:text-white">{siteStats.activeReminders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Bu hafta</span>
                    <span className="font-medium text-slate-900 dark:text-white">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Sistem Ayarları</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Güvenlik</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">İki faktörlü doğrulama</span>
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Aktif</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Admin oturum süresi</span>
                    <span className="text-slate-900 dark:text-white">30 dakika</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Sistem</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Veritabanı durumu</span>
                    <span className="text-green-600 dark:text-green-400">Sağlıklı</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Son yedekleme</span>
                    <span className="text-slate-900 dark:text-white">Bugün 03:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}