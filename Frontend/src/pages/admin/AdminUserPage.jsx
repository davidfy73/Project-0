import { useState } from 'react';
import { Search, Eye, Trash2, Shield, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../store/useAdminStore';

// TODO: Operasi daftar dan penghapusan user nanti dihubungkan ke endpoint backend:
// GET /api/admin/users dan DELETE /api/admin/users/:id

export default function AdminUserPage() {
  const { users, deleteUser } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [detailUser, setDetailUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const success = deleteUser(userToDelete.id);
    if (success) {
      toast.success(`User ${userToDelete.username} dan seluruh progresnya berhasil dihapus`);
    } else {
      toast.error('Akun admin dilindungi dan tidak dapat dihapus');
    }
    setUserToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Kolom Pencarian di Atas */}
      <div className="border-b pb-4 flex justify-end" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Cari username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl text-xs sm:text-sm outline-none transition-all"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-primary)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-primary)';
            }}
          />
        </div>
      </div>

      {/* Tabel Desktop (hidden pada layar < 640px) */}
      <div
        className="hidden sm:block rounded-2xl overflow-hidden border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className="border-b text-xs font-mono uppercase tracking-wider"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-muted)',
              }}
            >
              <th className="py-3.5 px-5">Username</th>
              <th className="py-3.5 px-5">Role</th>
              <th className="py-3.5 px-5">Tanggal Daftar</th>
              <th className="py-3.5 px-5">Aktivitas Terakhir</th>
              <th className="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y text-xs sm:text-sm" style={{ borderColor: 'var(--border-primary)' }}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isAdmin = user.role === 'admin';
                return (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-[var(--bg-elevated)]/40"
                  >
                    <td className="py-4 px-5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {user.username}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: isAdmin ? 'rgba(255, 91, 100, 0.15)' : 'var(--accent-glow)',
                          color: isAdmin ? 'var(--color-danger)' : 'var(--accent-light)',
                          border: `1px solid ${isAdmin ? 'rgba(255, 91, 100, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {user.registeredAt}
                    </td>
                    <td className="py-4 px-5 font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {user.lastActive}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailUser(user)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                          style={{
                            backgroundColor: 'var(--bg-elevated)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-primary)',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                          onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-primary)')}
                        >
                          <Eye size={13} />
                          <span>Detail</span>
                        </button>

                        {isAdmin ? (
                          <span
                            className="px-3 py-1.5 rounded-lg text-xs font-mono select-none"
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--text-muted)',
                              border: '1px dashed var(--border-secondary)',
                            }}
                          >
                            Dilindungi
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                            style={{
                              backgroundColor: 'rgba(255, 91, 100, 0.12)',
                              color: 'var(--color-danger)',
                              border: '1px solid rgba(255, 91, 100, 0.3)',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--color-danger)';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 91, 100, 0.12)';
                              e.currentTarget.style.color = 'var(--color-danger)';
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Hapus</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                  Tidak ada user ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Kartu Mobile (< 640px) */}
      <div className="sm:hidden space-y-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isAdmin = user.role === 'admin';
            return (
              <div
                key={user.id}
                className="rounded-2xl p-4 border space-y-3"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {user.username}
                  </span>
                  <span
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isAdmin ? 'rgba(255, 91, 100, 0.15)' : 'var(--accent-glow)',
                      color: isAdmin ? 'var(--color-danger)' : 'var(--accent-light)',
                      border: `1px solid ${isAdmin ? 'rgba(255, 91, 100, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                    }}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="text-xs space-y-1 font-mono" style={{ color: 'var(--text-secondary)' }}>
                  <div>Daftar: {user.registeredAt}</div>
                  <div>Aktivitas: {user.lastActive}</div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                  <button
                    type="button"
                    onClick={() => setDetailUser(user)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    <Eye size={13} />
                    <span>Detail</span>
                  </button>

                  {isAdmin ? (
                    <span
                      className="px-3 py-1.5 rounded-lg text-xs font-mono"
                      style={{
                        color: 'var(--text-muted)',
                        border: '1px dashed var(--border-secondary)',
                      }}
                    >
                      Dilindungi
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setUserToDelete(user)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                      style={{
                        backgroundColor: 'rgba(255, 91, 100, 0.12)',
                        color: 'var(--color-danger)',
                        border: '1px solid rgba(255, 91, 100, 0.3)',
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="rounded-2xl p-8 text-center text-xs sm:text-sm border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-muted)',
            }}
          >
            Tidak ada user ditemukan
          </div>
        )}
      </div>

      {/* Modal Detail User */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-2xl p-6 border shadow-2xl relative"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <button
              type="button"
              onClick={() => setDetailUser(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Detail Pengguna
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Username:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{detailUser.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role:</span>
                <span
                  className="text-xs font-mono uppercase px-2 py-0.5 rounded font-bold"
                  style={{
                    backgroundColor: detailUser.role === 'admin' ? 'rgba(255, 91, 100, 0.15)' : 'var(--accent-glow)',
                    color: detailUser.role === 'admin' ? 'var(--color-danger)' : 'var(--accent-light)',
                  }}
                >
                  {detailUser.role}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tanggal Daftar:</span>
                <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{detailUser.registeredAt}</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderColor: 'var(--border-primary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Aktivitas Terakhir:</span>
                <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>{detailUser.lastActive}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end" style={{ borderColor: 'var(--border-primary)' }}>
              <button
                type="button"
                onClick={() => setDetailUser(null)}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus User */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-2xl p-6 border shadow-2xl relative space-y-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: 'rgba(255, 91, 100, 0.15)',
                  color: 'var(--color-danger)',
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Hapus User?
              </h3>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Hapus user <strong style={{ color: 'var(--text-primary)' }}>{userToDelete.username}</strong>?
              Progres dan hasil kuis user ini ikut terhapus. Tindakan ini tidak bisa dibatalkan.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'var(--color-danger)',
                  color: '#FFFFFF',
                  border: 'none',
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
