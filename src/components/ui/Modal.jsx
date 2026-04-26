import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Modal = ({ open, onOpenChange, children, className }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <AnimatePresence>
      {open && (
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild>
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <motion.div
              className={cn(
                'fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                'w-full max-w-2xl max-h-[90vh] overflow-hidden',
                'bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl',
                'flex flex-col',
                className
              )}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </AnimatePresence>
  </Dialog.Root>
);

const ModalHeader = ({ children, onClose, className }) => (
  <div className={cn('flex items-start justify-between px-6 py-5 border-b border-neutral-800', className)}>
    <div className="flex-1 pr-4">{children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
);

const ModalBody = ({ children, className }) => (
  <div className={cn('flex-1 overflow-y-auto px-6 py-5', className)}>{children}</div>
);

const ModalFooter = ({ children, className }) => (
  <div className={cn('px-6 py-4 border-t border-neutral-800 flex items-center justify-end gap-3', className)}>
    {children}
  </div>
);

export { Modal, ModalHeader, ModalBody, ModalFooter };

