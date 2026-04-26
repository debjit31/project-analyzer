import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const getScoreColor = (score) => {
  if (score >= 75) return { stroke: '#10b981', text: 'text-emerald-400', label: 'Excellent' };
  if (score >= 50) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'Good' };
  return { stroke: '#ef4444', text: 'text-red-400', label: 'Needs Work' };
};

const ATSScoreRing = ({ score = 0 }) => {
  const R = 72;
  const circumference = 2 * Math.PI * R;
  const { stroke, text, label } = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-44 h-44">
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r={R} fill="none" stroke="#262626" strokeWidth="12" />
          <motion.circle
            cx="90"
            cy="90"
            r={R}
            fill="none"
            stroke={stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 8px ${stroke}60)` }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className={cn('text-4xl font-bold font-[family-name:var(--font-heading)] tabular-nums', text)}
          >
            {score}
          </motion.span>
          <span className="text-xs text-neutral-500 mt-0.5">/100</span>
        </div>
      </div>
      <div className="text-center">
        <p className={cn('text-sm font-semibold', text)}>{label}</p>
        <p className="text-xs text-neutral-500 mt-0.5">ATS Compatibility Score</p>
      </div>
    </div>
  );
};

export { ATSScoreRing };

