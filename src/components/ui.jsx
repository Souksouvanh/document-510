import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { statusBadge } from '../documentData.js';

// ==========================================================================
// BADGE COMPONENT
// ==========================================================================
export function Badge({ children, status, variant, color, dot = false, size = 'sm', className = '' }) {
  if (status) {
    const meta = statusBadge(status);
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
          } ${meta.bg} ${meta.text} ${meta.border} ${className}`}
      >
        {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />}
        {children || meta.label}
      </span>
    );
  }

  const colorStyles = {
    primary: 'bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-300',
    seal: 'bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/20 dark:text-red-300',
    gold: 'bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300',
    success: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300',
    slate: 'bg-slate-500/10 text-slate-700 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300',
  };

  const styleClass = colorStyles[variant || 'slate'] || colorStyles.slate;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
        } ${styleClass} ${className}`}
      style={color ? { color, borderColor: `${color}40`, backgroundColor: `${color}15` } : {}}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-80" />}
      {children}
    </span>
  );
}

// ==========================================================================
// BUTTON COMPONENT
// ==========================================================================
export function Btn({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  title,
  icon: Icon,
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const variantClasses = {
    primary:
      'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow focus-visible:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500',
    seal:
      'bg-red-700 hover:bg-red-800 active:bg-red-900 text-white shadow-sm hover:shadow focus-visible:ring-red-600 dark:bg-red-600 dark:hover:bg-red-500',
    ink:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow focus-visible:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80',
    danger:
      'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/40 dark:hover:bg-red-900/40 dark:text-red-300 dark:border-red-900/60',
    outline:
      'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800',
  };

  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.secondary} ${className}`}
    >
      {Icon && <Icon size={size === 'xs' || size === 'sm' ? 14 : 16} className="shrink-0" />}
      {children}
    </button>
  );
}

// ==========================================================================
// CARD COMPONENT
// ==========================================================================
export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs transition-all ${hover
          ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer'
          : ''
        } ${className}`}
    >
      {children}
    </div>
  );
}

// ==========================================================================
// STAT KPI CARD
// ==========================================================================
export function StatCard({
  label,
  value,
  icon: Icon,
  color = 'blue',
  subtitle,
  badge,
  onClick,
  active = false,
}) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'hover:border-blue-300 dark:hover:border-blue-800',
      glow: 'group-hover:ring-blue-500/20',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950/40',
      iconColor: 'text-red-600 dark:text-red-400',
      borderColor: 'hover:border-red-300 dark:hover:border-red-800',
      glow: 'group-hover:ring-red-500/20',
      activeBorder: 'border-red-500 ring-2 ring-red-500/20',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'hover:border-amber-300 dark:hover:border-amber-800',
      glow: 'group-hover:ring-amber-500/20',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'hover:border-emerald-300 dark:hover:border-emerald-800',
      glow: 'group-hover:ring-emerald-500/20',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`group relative p-4 sm:p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs transition-all duration-200 text-left ${onClick
          ? `cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${scheme.borderColor}`
          : ''
        } ${active ? scheme.activeBorder : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-bold mt-1 text-slate-900 dark:text-slate-100 tracking-tight font-mono-num">
            {value}
          </div>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${scheme.bg}`}
        >
          {Icon && <Icon size={20} className={scheme.iconColor} />}
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </span>
          )}
          {badge}
        </div>
      )}
    </div>
  );
}

// ==========================================================================
// FORM FIELD WRAPPER
// ==========================================================================
export function Field({ label, children, required, error, hint, className = '' }) {
  return (
    <label className={`block mb-3.5 ${className}`}>
      {label && (
        <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </span>
      )}
      {children}
      {hint && !error && (
        <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          {hint}
        </span>
      )}
      {error && (
        <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </label>
  );
}

export const inputClass =
  'w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-150';

// ==========================================================================
// MODAL WRAPPER
// ==========================================================================
export function Modal({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-xl' }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-10 animate-in flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================================================
// THAI OFFICIAL SEAL BADGE (SVG)
// ==========================================================================
export function SealMark({ size = 36, color = '#B91C1C', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Decorative Ring */}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="3" />
      <circle cx="50" cy="50" r="41" stroke={color} strokeWidth="1" strokeDasharray="3 2" />

      {/* Inner Ring */}
      <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="2" />

      {/* Decorative Star Accents */}
      <circle cx="16" cy="50" r="2.5" fill={color} />
      <circle cx="84" cy="50" r="2.5" fill={color} />

      {/* Typography Seal */}
      <text
        x="50"
        y="42"
        fill={color}
        fontSize="15"
        fontWeight="700"
        fontFamily="'Noto Sans Lao', 'Prompt', 'Sarabun', sans-serif"
        textAnchor="middle"
      >
        สารบรรณ
      </text>
      <text
        x="50"
        y="58"
        fill={color}
        fontSize="11"
        fontWeight="600"
        fontFamily="'Noto Sans Lao', 'Prompt', 'Sarabun', sans-serif"
        textAnchor="middle"
      >
        ทะเบียนรับ-ส่ง
      </text>
      <text
        x="50"
        y="72"
        fill={color}
        fontSize="8"
        fontWeight="500"
        fontFamily="'JetBrains Mono', monospace"
        textAnchor="middle"
      >
        DOC-REGISTRY
      </text>
    </svg>
  );
}

// ==========================================================================
// EMPTY STATE COMPONENT
// ==========================================================================
export function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
        {Icon && <Icon size={24} />}
      </div>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Btn variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Btn>
      )}
    </div>
  );
}
