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
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';

    const variants = {
      primary:
        'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 focus:ring-indigo-500 shadow-md hover:shadow-lg',
      secondary:
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      outline:
        'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
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
