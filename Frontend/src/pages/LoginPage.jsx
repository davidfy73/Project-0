import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import api from '../lib/api.js';

const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username wajib diisi')
    .min(3, 'Username minimal 3 karakter')
    .max(20, 'Username maksimal 20 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Hanya boleh huruf, angka, dan underscore'),
  password: z
    .string()
    .min(1, 'Password wajib diisi')
    .min(8, 'Password minimal 8 karakter'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await api.post('/api/auth/login', {
        username: data.username,
        password: data.password,
      });
      login(res.data.user, res.data.accessToken);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ??
        (!err.response
          ? 'Gagal terhubung ke server backend. Pastikan server backend sedang aktif.'
          : 'Terjadi kesalahan. Coba lagi.');
      setError('root', { message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-svh flex items-center justify-center relative overflow-hidden px-4">
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(30, 58, 95, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
            var(--bg-primary)
          `,
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Login card */}
      <div
        className="relative z-10 w-full max-w-[440px] rounded-2xl p-8 sm:p-10"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), 0 0 40px var(--accent-glow)',
        }}
      >
        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            style={{
              backgroundColor: 'var(--accent-deep)',
              border: '1px solid var(--accent-primary)',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
          >
            <Shield size={24} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h1
            className="text-lg font-bold tracking-widest"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
          >
            PHISHYEARN
          </h1>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Welcome Back!
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            We missed you! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register('username')}
              className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: `1px solid ${errors.username ? 'var(--color-danger)' : 'var(--border-primary)'}`,
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = errors.username ? 'var(--color-danger)' : 'var(--accent-primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.username ? 'var(--color-danger)' : 'var(--border-primary)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.username && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--color-danger)' }}>
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                {...register('password')}
                className="w-full h-11 px-4 pr-11 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: `1px solid ${errors.password ? 'var(--color-danger)' : 'var(--border-primary)'}`,
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = errors.password ? 'var(--color-danger)' : 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? 'var(--color-danger)' : 'var(--border-primary)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--color-danger)' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error dari server (username/password salah, rate limit, dll) */}
          {errors.root && (
            <p
              className="text-xs text-center py-2 px-3 rounded-lg"
              style={{
                color: 'var(--color-danger)',
                backgroundColor: 'rgba(255, 91, 100, 0.1)',
                border: '1px solid rgba(255, 91, 100, 0.25)',
              }}
            >
              {errors.root.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-on-accent)',
              border: 'none',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold no-underline transition-colors duration-200"
            style={{ color: 'var(--accent-primary)' }}
            onMouseOver={(e) => (e.target.style.color = 'var(--accent-light)')}
            onMouseOut={(e) => (e.target.style.color = 'var(--accent-primary)')}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
