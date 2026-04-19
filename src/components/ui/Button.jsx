import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Button component with variants
 */
const Button = forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md dark:focus:ring-offset-stone-900';

    const variants = {
      primary:
        'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 border-b-2 border-teal-800 active:border-b-0 active:mt-0.5 dark:bg-teal-500 dark:hover:bg-teal-600 dark:border-teal-700',
      secondary:
        'bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 focus:ring-stone-400 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-600 dark:hover:bg-stone-700',
      ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100',
      outline:
        'border-2 border-teal-600 text-teal-700 hover:bg-teal-50 focus:ring-teal-500 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-950',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      default: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
