'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Shield, Users, UserCheck, UserX, Crown, User, Mail, Calendar, CheckCircle, XCircle, AlertTriangle, Eye, Plus, X, Folder, Globe, Hash } from 'lucide-react';
import { validateAdminKey } from '@/lib/admin-keygen';

interface UserData {
  id: string;
  email: string;
  name: string | null;
  plan: 'FREE' | 'PREMIUM';
  emailVerified: Date | null;
  createdAt: Date;
  _count: {
    categories: number;
    sites: number;
  };
}

export default function SecureAdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const key = params.key as string;
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userModalLoading, setUserModalLoading] = useState(false);
  
  // Yeni kullanıcı formu state'leri
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    password: '',
    plan: 'FREE' as 'FREE' | 'PREMIUM',
    emailVerified: false
  });

  // Admin email kontrolü
  const isAdminEmail = session?.user?.email === 'umitakdenizjob@gmail.com';
  
  useEffect(() => {
    if (status === 'loading') return;
    
    // Session kontrolü
    if (!session || !isAdminEmail) {
      router.push('/');
      return;
    }
    
    // Key doğrulama
    if (!validateAdminKey(key)) {
      router.push('/');
      return;
    }
    
    // Kullanıcıları yükle
    loadUsers();
  }, [session, status, isAdminEmail, key, router]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading users...');
      
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      setUsers(data.users || []);
      console.log('Users loaded:', data.users?.length || 0);
    } catch (error) {
      console.error('Error loading users:', error);
      setError(`Failed to load users: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, newPlan: 'FREE' | 'PREMIUM') => {
    try {
      setActionLoading(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan })
      });
      
      if (!response.ok) throw new Error('Failed to update user plan');
      
      // Kullanıcı listesini güncelle
      setUsers(users.map(user => 
        user.id === userId ? { ...user, plan: newPlan } : user
      ));
    } catch (error) {
      console.error('Error updating user plan:', error);
      setError('Failed to update user plan');
    } finally {
      setActionLoading(null);
    }
  };

  const verifyUserEmail = async (userId: string) => {
    try {
      setActionLoading(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailVerified: new Date().toISOString() })
      });
      
      if (!response.ok) throw new Error('Failed to verify user email');
      
      // Kullanıcı listesini güncelle
      setUsers(users.map(user => 
        user.id === userId ? { ...user, emailVerified: new Date() } : user
      ));
    } catch (error) {
      console.error('Error verifying user email:', error);
      setError('Failed to verify user email');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setActionLoading(userId);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      
      // Kullanıcıyı listeden kaldır
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const viewUserDetails = async (userId: string) => {
    try {
      setUserModalLoading(true);
      setShowUserModal(true);
      
      const response = await fetch(`/api/admin/users/${userId}/details`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      
      const data = await response.json();
      setSelectedUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details');
      setShowUserModal(false);
    } finally {
      setUserModalLoading(false);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setActionLoading('create');
      
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
      
      const data = await response.json();
      
      // Kullanıcı listesini yenile
      await loadUsers();
      
      // Formu temizle ve modalı kapat
      setNewUser({
        email: '',
        name: '',
        password: '',
        plan: 'FREE',
        emailVerified: false
      });
      setShowCreateModal(false);
      
    } catch (error: any) {
      console.error('Error creating user:', error);
      setError(error.message || 'Failed to create user');
    } finally {
      setActionLoading(null);
    }
  };

  // Loading durumu
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Secure Admin Panel</h1>
                <p className="text-purple-200">User Management System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-200">Active Admin</div>
              <div className="text-white font-medium">{session?.user?.email}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{users.length}</div>
                <div className="text-blue-200">Total Users</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {users.filter(u => u.plan === 'PREMIUM').length}
                </div>
                <div className="text-yellow-200">Premium Users</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {users.filter(u => u.emailVerified).length}
                </div>
                <div className="text-green-200">Verified Emails</div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              User List
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New User
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-500/20 border-b border-white/20">
              <div className="flex items-center gap-2 text-red-200">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-4 text-white font-medium">Kullanıcı</th>
                  <th className="text-left p-4 text-white font-medium">Plan</th>
                  <th className="text-left p-4 text-white font-medium">Email Doğrulama</th>
                  <th className="text-left p-4 text-white font-medium">İstatistikler</th>
                  <th className="text-left p-4 text-white font-medium">Kayıt Tarihi</th>
                  <th className="text-left p-4 text-white font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-white/10">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.name || 'No Name'}</div>
                          <div className="text-purple-200 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.plan === 'PREMIUM' 
                          ? 'bg-yellow-500/20 text-yellow-300' 
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {user.emailVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={user.emailVerified ? 'text-green-300' : 'text-red-300'}>
                          {user.emailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-purple-200 text-sm">
                        {user._count.categories} kategori, {user._count.sites} site
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-purple-200 text-sm">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {/* Kullanıcı detayları */}
                        <button
                          onClick={() => viewUserDetails(user.id)}
                          disabled={actionLoading === user.id}
                          className="px-3 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        
                        {/* Plan değiştirme */}
                        <button
                          onClick={() => updateUserPlan(user.id, user.plan === 'PREMIUM' ? 'FREE' : 'PREMIUM')}
                          disabled={actionLoading === user.id}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            user.plan === 'PREMIUM'
                              ? 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
                          }`}
                        >
                          {user.plan === 'PREMIUM' ? 'FREE Yap' : 'PREMIUM Yap'}
                        </button>
                        
                        {/* Email doğrulama */}
                        {!user.emailVerified && (
                          <button
                            onClick={() => verifyUserEmail(user.id)}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1 rounded text-xs font-medium bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                          >
                            Onayla
                          </button>
                        )}
                        
                        {/* Kullanıcı silme */}
                        <button
                          onClick={() => deleteUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="px-3 py-1 rounded text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && !loading && (
            <div className="p-8 text-center text-purple-200">
              Henüz kullanıcı bulunmuyor.
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/20 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Kullanıcı Detayları</h3>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {userModalLoading ? (
                <div className="p-8 text-center text-white">
                  Yükleniyor...
                </div>
              ) : selectedUser ? (
                <div className="p-6 space-y-6">
                  {/* User Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-3">Kullanıcı Bilgileri</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-200">Ad:</span>
                          <span className="text-white">{selectedUser.user.name || 'Belirtilmemiş'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Email:</span>
                          <span className="text-white">{selectedUser.user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Plan:</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            selectedUser.user.plan === 'PREMIUM' 
                              ? 'bg-yellow-500/20 text-yellow-300' 
                              : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {selectedUser.user.plan}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Email Doğrulama:</span>
                          <span className={selectedUser.user.emailVerified ? 'text-green-300' : 'text-red-300'}>
                            {selectedUser.user.emailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Kayıt Tarihi:</span>
                          <span className="text-white">
                            {new Date(selectedUser.user.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-3">İstatistikler</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-200">Toplam Kategori:</span>
                          <span className="text-white">{selectedUser.stats.totalCategories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Alt Kategori:</span>
                          <span className="text-white">{selectedUser.stats.totalSubcategories}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Toplam Site:</span>
                          <span className="text-white">{selectedUser.stats.totalSites}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Son Giriş:</span>
                          <span className="text-white">
                            {selectedUser.stats.lastLogin 
                              ? new Date(selectedUser.stats.lastLogin).toLocaleDateString('tr-TR')
                              : 'Hiç giriş yapmamış'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Bağlı Hesaplar:</span>
                          <span className="text-white">
                            {selectedUser.stats.accountProviders.length > 0 
                              ? selectedUser.stats.accountProviders.join(', ')
                              : 'Yok'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      Kategoriler ({selectedUser.user.categories.length})
                    </h4>
                    {selectedUser.user.categories.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedUser.user.categories.map((category: any) => (
                          <div key={category.id} className="bg-white/5 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-white font-medium">{category.name}</h5>
                              <div className="flex items-center gap-2 text-xs text-purple-200">
                                <span>{category.subcategories.length} alt kategori</span>
                                <span>•</span>
                                <span>{category.subcategories.reduce((total: number, sub: any) => total + sub.sites.length, 0)} site</span>
                              </div>
                            </div>
                            
                            {/* Subcategories */}
                            {category.subcategories.length > 0 && (
                              <div className="mt-2 space-y-1">
                                <div className="text-xs text-purple-200 mb-1">Alt Kategoriler:</div>
                                {category.subcategories.map((sub: any) => (
                                  <div key={sub.id} className="bg-white/5 rounded px-2 py-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-white text-xs">{sub.name}</span>
                                      <span className="text-purple-200 text-xs">{sub.sites.length} site</span>
                                    </div>
                                    {/* Show sites under each subcategory */}
                                    {sub.sites.length > 0 && (
                                      <div className="mt-1 ml-2 space-y-1">
                                        {sub.sites.map((site: any) => (
                                          <div key={site.id} className="flex items-center gap-2 text-xs">
                                            <Globe className="w-3 h-3 text-blue-400" />
                                            <span className="text-white">{site.name}</span>
                                            <span className="text-purple-200 ml-auto">{site.url}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Direct Sites - Not used in current schema, sites are under subcategories */}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-purple-200 text-sm">Henüz kategori oluşturulmamış.</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-full max-w-md">
              <div className="p-6 border-b border-white/20 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Yeni Kullanıcı Oluştur</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewUser({
                      email: '',
                      name: '',
                      password: '',
                      plan: 'FREE',
                      emailVerified: false
                    });
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={createUser} className="p-6 space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="kullanici@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Kullanıcı Adı"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Şifre <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Minimum 6 karakter"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Plan
                  </label>
                  <select
                    value={newUser.plan}
                    onChange={(e) => setNewUser({ ...newUser, plan: e.target.value as 'FREE' | 'PREMIUM' })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="FREE" className="bg-slate-800">FREE</option>
                    <option value="PREMIUM" className="bg-slate-800">PREMIUM</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="emailVerified"
                    checked={newUser.emailVerified}
                    onChange={(e) => setNewUser({ ...newUser, emailVerified: e.target.checked })}
                    className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-400"
                  />
                  <label htmlFor="emailVerified" className="text-white text-sm">
                    Email doğrulanmış olarak işaretle
                  </label>
                </div>
                
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={actionLoading === 'create'}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 font-medium"
                  >
                    {actionLoading === 'create' ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewUser({
                        email: '',
                        name: '',
                        password: '',
                        plan: 'FREE',
                        emailVerified: false
                      });
                    }}
                    className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}