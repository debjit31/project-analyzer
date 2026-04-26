import { cn } from '../../lib/utils';

/**
 * Badge/Chip component for tags
 */
const Badge = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600',
    primary: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800',
    accent: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
    error: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
    // Kanban status variants
    applied: 'bg-blue-950 text-blue-300 border-blue-800',
    interview: 'bg-violet-950 text-violet-300 border-violet-800',
    offer: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    rejected: 'bg-red-950 text-red-300 border-red-800',
    saved: 'bg-neutral-800 text-neutral-300 border-neutral-700',
    // Score variants
    'score-high': 'bg-emerald-950 text-emerald-300 border-emerald-800',
    'score-mid': 'bg-amber-950 text-amber-300 border-amber-800',
    'score-low': 'bg-red-950 text-red-300 border-red-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
