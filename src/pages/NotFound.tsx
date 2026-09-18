import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[var(--color-bg-base)] text-[var(--color-text-primary)] px-4 py-8 overflow-hidden">
      {/* Dual-Tone Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-lavender)]/15 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--color-mint)]/15 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="card p-8 sm:p-12 backdrop-blur-xl bg-[var(--color-bg-surface)]/90 border border-[var(--color-border)] shadow-[0_24px_64px_rgba(0,0,0,0.6),0_0_32px_rgba(189,166,247,0.1)] overflow-hidden">
          {/* Dual-Tone Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-lavender)] via-[var(--color-lavender-light)] to-[var(--color-mint)]" />

          {/* Logo & 404 Visual */}
          <div className="flex flex-col items-center justify-center mb-6">
            <img
              src="/logo.png"
              alt="VitaSyn Logo"
              className="w-16 h-16 object-contain rounded-2xl p-1 bg-white/5 border border-[var(--color-border-lavender)] shadow-[0_0_24px_rgba(189,166,247,0.3)] mb-4"
            />
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-lavender-muted)] border border-[var(--color-border)] mb-3">
              <AlertCircle className="w-3.5 h-3.5 text-[var(--color-lavender)]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-lavender-light)]">
                Error 404
              </span>
            </div>

            <h1 className="text-7xl sm:text-8xl font-black tracking-tight leading-none text-gradient-dual select-none">
              404
            </h1>
          </div>

          {/* Message */}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            Page Not Found
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] font-medium max-w-sm mx-auto leading-relaxed mb-8">
            The page you are looking for doesn't exist, was removed, or might have moved to another URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-dual w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-extrabold"
            >
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Company Tagline */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border-subtle)] flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-white tracking-wider">Vita<span className="text-[var(--color-lavender)]">Syn</span></span>
            <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest">Pvt Ltd</span>
          </div>
        </div>
      </div>
    </div>
  );
};
