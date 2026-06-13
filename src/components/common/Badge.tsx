import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export function Badge({ 
  className, 
  variant = 'default', 
  size = 'md',
  children, 
  ...props 
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        {
          'bg-gray-100 text-gray-700': variant === 'default',
          'bg-[#1e3a5f]/10 text-[#1e3a5f]': variant === 'primary',
          'bg-[#f5a623]/10 text-[#f5a623]': variant === 'secondary',
          'bg-[#10b981]/10 text-[#10b981]': variant === 'success',
          'bg-[#f59e0b]/10 text-[#f59e0b]': variant === 'warning',
          'bg-[#ef4444]/10 text-[#ef4444]': variant === 'danger',
          'bg-[#3b82f6]/10 text-[#3b82f6]': variant === 'info',
        },
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
