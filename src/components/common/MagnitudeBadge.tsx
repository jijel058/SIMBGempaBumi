import React from 'react';

interface Props {
  magnitude: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const MagnitudeBadge: React.FC<Props> = ({ magnitude, size = 'md', showLabel = false }) => {
  const mag = typeof magnitude === 'number' ? magnitude : 0;
  
  let colorClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  let badgeLabel = 'Ringan';

  if (mag >= 7.0) {
    colorClass = 'bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/20 shadow-sm animate-pulse';
    badgeLabel = 'Besar / Merusak';
  } else if (mag >= 6.0) {
    colorClass = 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-orange-500/15 shadow-sm';
    badgeLabel = 'Kuat';
  } else if (mag >= 5.0) {
    colorClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    badgeLabel = 'Sedang';
  } else if (mag >= 4.0) {
    colorClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    badgeLabel = 'Ringan';
  } else {
    colorClass = 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    badgeLabel = 'Mikro';
  }

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-bold',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-base px-3.5 py-1.5 font-extrabold',
    xl: 'text-2xl px-5 py-2.5 font-black tracking-tight',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center justify-center rounded-lg border backdrop-blur-md transition-all ${sizeStyles[size]} ${colorClass}`}
      >
        M {mag.toFixed(1)}
      </span>
      {showLabel && (
        <span className="text-xs font-medium text-slate-400 dark:text-slate-400">
          ({badgeLabel})
        </span>
      )}
    </div>
  );
};

