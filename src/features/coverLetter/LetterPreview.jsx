import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, Download, Check, FileText } from 'lucide-react';
import { useToast } from '../../lib/ToastContext';
import { Skeleton } from '../../components/ui/Skeleton';

const LetterPreview = ({ letter, loading, onRegenerate }) => {
  const { push } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!letter) return;
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    push({ message: 'Cover letter copied to clipboard!', variant: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!letter) return;
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.txt';
    a.click();
    URL.revokeObjectURL(url);
    push({ message: 'Cover letter downloaded!', variant: 'default' });
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-xs text-neutral-500 ml-2 font-mono">cover-letter.txt</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!letter}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg disabled:opacity-40 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!letter}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg disabled:opacity-40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          <button
            onClick={onRegenerate}
            disabled={!letter || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-teal-400 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 rounded-lg disabled:opacity-40 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Regenerate
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className={`h-4 rounded bg-neutral-800 ${i % 5 === 4 ? 'w-2/5 mb-6' : i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />
              ))}
            </motion.div>
          ) : letter ? (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                contentEditable
                suppressContentEditableWarning
                className="text-sm text-neutral-300 leading-7 outline-none whitespace-pre-wrap font-mono focus:text-neutral-100 transition-colors"
                dangerouslySetInnerHTML={{ __html: letter.replace(/\n/g, '<br/>') }}
              />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full min-h-80 text-center">
              <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-sm font-medium text-neutral-500 mb-1">Your cover letter will appear here</h3>
              <p className="text-xs text-neutral-600">Fill in the form and click Generate to get started</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export { LetterPreview };

