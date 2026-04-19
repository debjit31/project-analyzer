import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

/**
 * Select dropdown component
 */
const Select = forwardRef(
  ({ className, label, id, options = [], error, ...props }, ref) => {
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
          <select
            ref={ref}
            id={id}
            className={cn(
              'block w-full appearance-none rounded-md border border-stone-300 bg-white px-4 py-2.5 pr-10 text-stone-900 dark:bg-stone-800 dark:border-stone-600 dark:text-stone-100',
              'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:focus:ring-teal-500/30',
              'transition-colors duration-150 cursor-pointer',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-stone-400 dark:text-stone-500" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
