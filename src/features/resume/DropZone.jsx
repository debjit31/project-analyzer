import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const DropZone = ({ onFile }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f || f.type !== 'application/pdf') return;
    setFile(f);
    onFile?.(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
    onFile?.(null);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 p-10 cursor-pointer min-h-52',
        dragging
          ? 'border-teal-500 bg-teal-500/5 scale-[1.01]'
          : file
          ? 'border-emerald-500/40 bg-emerald-500/5 cursor-default'
          : 'border-neutral-700 bg-neutral-800/30 hover:border-neutral-600 hover:bg-neutral-800/50'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-100">{file.name}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB · PDF</p>
            </div>
            <button
              onClick={clearFile}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 mt-1 px-3 py-1.5 rounded-lg hover:bg-red-950/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Remove file
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 text-center"
          >
            <motion.div
              animate={dragging ? { scale: 1.1 } : { scale: 1 }}
              className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center"
            >
              {dragging ? (
                <FileText className="w-7 h-7 text-teal-400" />
              ) : (
                <Upload className="w-7 h-7 text-neutral-500" />
              )}
            </motion.div>
            <div>
              <p className="text-sm font-medium text-neutral-200">
                {dragging ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-xs text-neutral-500 mt-1">or click to browse · PDF only · Max 10MB</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { DropZone };

