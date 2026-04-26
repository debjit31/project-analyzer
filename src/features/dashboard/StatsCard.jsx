import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Send, Calendar, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';

const iconMap = {
  send: Send,
  calendar: Calendar,
  'trending-up': TrendingUp,
  bookmark: Bookmark,
};

const colorMap = {
  teal: {
    icon: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    glow: 'shadow-teal-900/30',
  },
  violet: {
    icon: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    glow: 'shadow-violet-900/30',
  },
  emerald: {
    icon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    glow: 'shadow-emerald-900/30',
  },
  amber: {
    icon: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    glow: 'shadow-amber-900/30',
  },
};

// Animated counter hook
const useCountUp = (target, duration = 1200) => {
  const ref = useRef(null);
  const numericTarget = typeof target === 'number' ? target : parseInt(target) || 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isPercent = typeof target === 'string' && target.includes('%');
    let start = 0;
    const step = numericTarget / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + step, numericTarget);
      el.textContent = Math.round(current) + (isPercent ? '%' : '');
      if (current >= numericTarget) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [numericTarget, duration]);

  return ref;
};

const StatsCard = ({ label, value, delta, trend, icon, color, index }) => {
  const Icon = iconMap[icon] || Send;
  const colors = colorMap[color] || colorMap.teal;
  const countRef = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className={cn(
        'relative bg-neutral-900 border border-neutral-800 rounded-2xl p-5',
        'hover:border-neutral-700 transition-all duration-200 group overflow-hidden',
        `shadow-lg ${colors.glow}`
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/20 to-transparent pointer-events-none rounded-2xl" />

      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wider">{label}</p>
          <p
            ref={countRef}
            className="text-3xl font-bold text-neutral-50 font-[family-name:var(--font-heading)] tabular-nums"
          >
            {value}
          </p>
          <div className="flex items-center gap-1 mt-2">
            {trend === 'up' ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            )}
            <p className={cn('text-xs font-medium', trend === 'up' ? 'text-emerald-400' : 'text-red-400')}>{delta}</p>
          </div>
        </div>
        <div className={cn('p-2.5 rounded-xl border', colors.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

export { StatsCard };

