import { useEffect } from 'react';
import { AlertTriangle, Trash2, Info, CheckCircle2, X, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  maxWidth = 'lg',
}: ConfirmModalProps) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const isAlertOnly = !onConfirm;

  // Variant configs
  const variantConfig = {
    danger: {
      bar: 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600',
      iconBox: 'bg-red-500/15 border-red-500/30 text-red-400',
      icon: Trash2,
      confirmBtn: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-[0_4px_16px_rgba(244,63,94,0.35)]',
    },
    warning: {
      bar: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600',
      iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      icon: AlertTriangle,
      confirmBtn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#0f1015] shadow-[0_4px_16px_rgba(245,158,11,0.3)]',
    },
    info: {
      bar: 'bg-gradient-to-r from-[var(--color-lavender)] via-[var(--color-lavender-light)] to-[var(--color-mint)]',
      iconBox: 'bg-[var(--color-lavender-muted)] border-[var(--color-border-lavender)] text-[var(--color-lavender-light)]',
      icon: Info,
      confirmBtn: 'btn-dual text-[#0f1015]',
    },
    success: {
      bar: 'bg-gradient-to-r from-[var(--color-mint-dark)] via-[var(--color-mint)] to-[var(--color-mint-light)]',
      iconBox: 'bg-[var(--color-mint-muted)] border-[var(--color-border-mint)] text-[var(--color-mint-light)]',
      icon: CheckCircle2,
      confirmBtn: 'btn-mint text-[#0f1015]',
    },
  }[variant];

  const Icon = variantConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-200 animate-in fade-in">
      <div className={clsx("w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_32px_rgba(189,166,247,0.12)] overflow-hidden flex flex-col transform transition-all duration-200 scale-100 animate-in zoom-in-95", maxWidthMap[maxWidth])}>
        
        {/* Top Accent Bar */}
        <div className={clsx('h-1.5 w-full shrink-0', variantConfig.bar)} />

        <div className="p-6 sm:p-7">
          {/* Header with Icon and Close Button */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className={clsx('w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg', variantConfig.iconBox)}>
              <Icon className="w-6 h-6" />
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-bg-hover)] rounded-xl transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Message */}
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-2">
            {title}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {!isAlertOnly && (
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="btn-secondary flex-1 text-sm py-2.5 cursor-pointer"
              >
                {cancelText}
              </button>
            )}

            <button
              type="button"
              onClick={isAlertOnly ? onClose : onConfirm}
              disabled={isLoading}
              className={clsx(
                'flex-1 text-sm py-2.5 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
                variantConfig.confirmBtn,
                isLoading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isAlertOnly ? (confirmText === 'Confirm' ? 'Okay' : confirmText) : confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
