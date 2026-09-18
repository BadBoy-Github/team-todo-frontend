import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar, useSidebar } from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import { Menu } from 'lucide-react';

export const Layout = () => {
  const { user, loading } = useContext(AuthContext);
  const { setOpen } = useSidebar();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-bg-base)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 rounded-full border-t-[var(--color-lavender)] border-[var(--color-bg-elevated)] animate-spin" />
          <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative flex h-screen bg-[var(--color-bg-base)] text-[var(--color-text-primary)] overflow-hidden">
      {/* Dual-Tone Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--color-lavender)]/5 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[var(--color-mint)]/5 blur-[120px]" />

      <Sidebar />
      <div className="relative z-10 flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile & Tablet top bar — hidden on lg+ desktop screens */}
        <header className="lg:hidden shrink-0 flex items-center justify-between px-4 sm:px-6 h-16 bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-lavender)] hover:bg-[var(--color-bg-hover)] hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white leading-none">Vita</span>
                <span className="text-xl font-black tracking-tight text-[var(--color-lavender)] leading-none">Syn</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mt-0.5">
                VitaSyn Pvt Ltd
              </span>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-semibold text-[var(--color-text-primary)] max-w-[120px] truncate">{user.name}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-mint-dark)]">{user.role}</span>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-lavender-muted)] border border-[var(--color-border)] text-[var(--color-lavender-light)] text-xs font-bold shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
