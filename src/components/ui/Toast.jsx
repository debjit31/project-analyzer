import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../lib/ToastContext';
import { cn } from '../../lib/utils';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  default: <Info className="w-5 h-5 text-teal-400" />,
};

const variantStyles = {
  success: 'border-emerald-800/60 bg-emerald-950/80',
  error: 'border-red-800/60 bg-red-950/80',
  warning: 'border-amber-800/60 bg-amber-950/80',
  default: 'border-neutral-700 bg-neutral-900/90',
};

const Toast = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: 60 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'pointer-events-auto flex items-start gap-3 px-4 py-3',
              'rounded-xl border shadow-2xl backdrop-blur-md min-w-[280px] max-w-sm',
              variantStyles[toast.variant] || variantStyles.default
            )}
          >
            <div className="mt-0.5 shrink-0">{icons[toast.variant] || icons.default}</div>
            <p className="flex-1 text-sm text-neutral-100 leading-relaxed">{toast.message}</p>
            <button
              onClick={() => dismiss(toast.id)}
              className="shrink-0 p-0.5 rounded text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export { Toast };

