import { cn } from '../../lib/utils';

/**
 * Skeleton loading placeholder
 */
const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200',
        className
      )}
      {...props}
    />
  );
};

export { Skeleton };
