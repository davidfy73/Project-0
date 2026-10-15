import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email });
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
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

          {/* Password */}
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200 peer-checked:border-transparent"
                style={{
                  backgroundColor: rememberMe ? 'var(--accent-primary)' : 'transparent',
                  border: rememberMe ? 'none' : '1.5px solid var(--border-secondary)',
                }}
              >
                {rememberMe && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium no-underline transition-colors duration-200"
              style={{ color: 'var(--accent-primary)' }}
              onMouseOver={(e) => (e.target.style.color = 'var(--accent-light)')}
              onMouseOut={(e) => (e.target.style.color = 'var(--accent-primary)')}
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full h-11 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-on-accent)',
              border: 'none',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'var(--accent-hover)';
              e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'var(--accent-primary)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Sign In
          </button>
        </form>

        {/* Sign up link */}
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
