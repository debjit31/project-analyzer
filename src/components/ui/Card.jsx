import { cn } from '../../lib/utils';

/**
 * Card component with variants
 */
const Card = ({ className, children, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-stone-200 dark:bg-stone-900 dark:border-stone-700',
        hover && 'transition-all duration-150 hover:border-l-teal-500 hover:border-l-[3px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn('px-6 pt-6 pb-4', className)} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn('px-6 pb-6', className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-stone-50/80 border-t border-stone-100 rounded-b-lg dark:bg-stone-800/50 dark:border-stone-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardContent, CardFooter };
