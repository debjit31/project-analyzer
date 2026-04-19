import { cn } from '../../lib/utils';

/**
 * Skeleton loading placeholder
 */
const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-stone-200 dark:bg-stone-700',
        className
      )}
      {...props}
    />
  );
};

export { Skeleton };
