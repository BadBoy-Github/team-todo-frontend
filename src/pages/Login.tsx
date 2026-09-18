import { useState, useContext, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Sparkles, Lock, Mail } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[var(--color-bg-base)] px-4 py-8 overflow-hidden">
      {/* Decorative ambient dual-tone orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-lavender)]/15 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--color-mint)]/15 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Card */}
        <div className="card overflow-hidden p-8 sm:p-10 backdrop-blur-xl bg-[var(--color-bg-surface)]/90 border border-[var(--color-border)] shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_32px_rgba(189,166,247,0.1)]">
          {/* Top dual-tone bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-lavender)] via-[var(--color-lavender-light)] to-[var(--color-mint)]" />

          {/* Logo & Subtitle */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-mint)] mb-4 shadow-[0_0_20px_rgba(189,166,247,0.4)]">
              <Sparkles className="w-6 h-6 text-[#0f1015]" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none flex items-center justify-center gap-1">
              <span className="text-white">Vita</span>
              <span className="text-[var(--color-lavender)]">Syn</span>
              <span className="w-2 h-2 rounded-full bg-[var(--color-mint)] ml-0.5 shadow-[0_0_8px_var(--color-mint)]" />
            </h1>
            <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              VitaSyn Pvt Ltd
            </p>

            <div className="mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
              <h2 className="text-lg font-bold text-white tracking-tight">Team Workspace</h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Enter your credentials to access your dashboard</p>
            </div>
          </div>

          {/* Error notification */}
          {error && (
            <div className="mb-6 p-4 text-xs font-semibold text-red-300 bg-red-500/10 border border-red-500/25 rounded-xl animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field text-sm pl-10"
                  placeholder="admin@vitasyn.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="input-field text-sm pl-10 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-dual w-full py-3 text-sm font-extrabold tracking-wide flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0f1015]/40 border-t-[#0f1015] rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <span>Sign In to Workspace</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Dual-tone bottom accent bar */}
        <div className="mt-4 flex gap-1.5 px-2">
          <div className="flex-1 h-1 rounded-full bg-[var(--color-lavender)] opacity-50 shadow-[0_0_8px_rgba(189,166,247,0.3)]" />
          <div className="flex-1 h-1 rounded-full bg-[var(--color-mint)] opacity-50 shadow-[0_0_8px_rgba(171,236,218,0.3)]" />
        </div>
      </div>
    </div>
  );
};
