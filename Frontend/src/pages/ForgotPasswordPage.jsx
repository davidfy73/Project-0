import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSent(true);
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

      <div
        className="relative z-10 w-full max-w-[440px] rounded-2xl p-8 sm:p-10"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4), 0 0 40px var(--accent-glow)',
        }}
      >
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

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Reset Password
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Enter your email to receive a secure recovery link.
          </p>
        </div>

        {isSent ? (
          <div className="space-y-6 text-center">
            <div
              className="p-4 rounded-xl flex items-center gap-3 text-left"
              style={{
                backgroundColor: 'rgba(32, 201, 151, 0.12)',
                border: '1px solid var(--color-success)',
              }}
            >
              <CheckCircle2 size={24} style={{ color: 'var(--color-success)' }} className="shrink-0" />
              <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                Jika alamat email terdaftar di sistem, tautan instruksi reset password telah dikirimkan.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: 'var(--accent-primary)' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email Address
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

            <button
              type="submit"
              className="w-full h-11 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
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
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
