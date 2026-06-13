import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export function StatsCard({ title, value, icon, trend, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: 'from-[#1e3a5f] to-[#2d5a8f]',
    secondary: 'from-[#f5a623] to-[#ff8c00]',
    success: 'from-[#10b981] to-[#059669]',
    warning: 'from-[#f59e0b] to-[#d97706]',
    danger: 'from-[#ef4444] to-[#dc2626]',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className={clsx(
              'text-sm mt-2 flex items-center gap-1',
              trend.isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-400 ml-1">较上周</span>
            </p>
          )}
        </div>
        <div className={clsx(
          'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg',
          colorClasses[color]
        )}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
