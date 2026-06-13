import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-[#1e3a5f] text-white hover:bg-[#2d5a8f] focus:ring-[#1e3a5f] shadow-md hover:shadow-lg': variant === 'primary',
            'bg-[#f5a623] text-white hover:bg-[#e59615] focus:ring-[#f5a623] shadow-md hover:shadow-lg': variant === 'secondary',
            'border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f]/5 focus:ring-[#1e3a5f]': variant === 'outline',
            'text-gray-600 hover:bg-gray-100 focus:ring-gray-300': variant === 'ghost',
            'bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444]': variant === 'danger',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
