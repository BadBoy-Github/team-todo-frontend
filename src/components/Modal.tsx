import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md transition-opacity duration-200">
      <div 
        className="w-full max-w-md bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.7),0_0_24px_rgba(189,166,247,0.1)] overflow-hidden max-h-[92vh] flex flex-col transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95"
      >
        {/* Top Dual-Tone Accent Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-lavender)] via-[var(--color-lavender-light)] to-[var(--color-mint)] shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0 bg-[var(--color-bg-surface)]/60">
          <h3 className="text-lg font-extrabold text-[var(--color-text-primary)] flex items-center gap-2">
            <span>{title}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-[var(--color-text-muted)] transition-all rounded-xl hover:bg-[var(--color-bg-hover)] hover:text-white focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body – scrollable */}
        <div className="overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};
