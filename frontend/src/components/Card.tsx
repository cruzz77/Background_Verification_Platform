import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  loading?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  loading = false,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded p-6 shadow-premium hover:shadow-premium-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200/50 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-slate-500" />
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 w-24 bg-slate-100 animate-pulse rounded"></div>
          <div className="h-3 w-32 bg-slate-50 animate-pulse rounded"></div>
        </div>
      ) : (
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 leading-none mb-1">{value}</h3>
          {subtext && (
            <p className="text-xs text-slate-400 font-medium leading-none">{subtext}</p>
          )}
        </div>
      )}
    </div>
  );
};
