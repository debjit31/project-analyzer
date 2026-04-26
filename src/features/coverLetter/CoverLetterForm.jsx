import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const toneOptions = ['Professional', 'Confident', 'Friendly', 'Formal', 'Assertive', 'Creative'];

const CoverLetterForm = ({ onGenerate, loading }) => {
  const [form, setForm] = useState({
    jobTitle: '',
    company: '',
    name: '',
    tone: 'Professional',
    skills: '',
    jobDescription: '',
  });

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate?.(form);
  };

  const inputCls =
    'w-full px-3.5 py-2.5 bg-neutral-800/60 border border-neutral-700 rounded-xl text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-teal-600 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
      {/* Name + Job Title */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Your Name</label>
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Debjit Chattopadhyay"
            className={inputCls}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Job Title</label>
          <input
            value={form.jobTitle}
            onChange={(e) => update('jobTitle', e.target.value)}
            placeholder="Senior React Developer"
            className={inputCls}
            required
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Company</label>
        <input
          value={form.company}
          onChange={(e) => update('company', e.target.value)}
          placeholder="Stripe, Vercel, Linear…"
          className={inputCls}
          required
        />
      </div>

      {/* Tone */}
      <div>
        <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Tone</label>
        <div className="relative">
          <select
            value={form.tone}
            onChange={(e) => update('tone', e.target.value)}
            className={cn(inputCls, 'appearance-none pr-8 cursor-pointer')}
          >
            {toneOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      {/* Key skills */}
      <div>
        <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Key Skills / Highlights</label>
        <input
          value={form.skills}
          onChange={(e) => update('skills', e.target.value)}
          placeholder="React, TypeScript, performance optimization…"
          className={inputCls}
        />
      </div>

      {/* Job description */}
      <div className="flex-1">
        <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Job Description (optional)</label>
        <textarea
          value={form.jobDescription}
          onChange={(e) => update('jobDescription', e.target.value)}
          placeholder="Paste the job description here for a more tailored letter…"
          rows={6}
          className={cn(inputCls, 'resize-none leading-relaxed h-36')}
        />
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-70 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-teal-900/30"
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Cover Letter
          </>
        )}
      </motion.button>
    </form>
  );
};

export { CoverLetterForm };

