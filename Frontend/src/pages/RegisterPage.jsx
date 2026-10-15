import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, username });
    navigate('/dashboard');
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

      {/* Register card */}
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
            Create Account
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Join the cybersecurity learning mission.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Username
            </label>
            <input
              type="text"
              required
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-primary)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-primary)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 pr-11 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-primary)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 mt-2"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-on-accent)',
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
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold no-underline"
            style={{ color: 'var(--accent-primary)' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
