import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Input component with label support
 */
const Input = forwardRef(
  ({ className, label, id, error, icon: Icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-stone-400 dark:text-stone-500" />
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'block w-full rounded-md border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder:text-stone-400 dark:bg-stone-800 dark:border-stone-600 dark:text-stone-100 dark:placeholder:text-stone-500',
              'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:focus:ring-teal-500/30',
              'transition-colors duration-150',
              Icon && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
