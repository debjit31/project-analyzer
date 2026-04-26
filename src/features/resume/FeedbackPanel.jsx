import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, XCircle, AlertTriangle, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

const feedbackData = [
  {
    id: 'strengths',
    label: 'Strengths',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    items: [
      'Strong quantifiable achievements (e.g., "reduced load time by 40%")',
      'Relevant tech stack aligned with modern frontend roles',
      'Consistent employment history with clear progression',
      'Education section well-formatted and prominent',
    ],
  },
  {
    id: 'weaknesses',
    label: 'Weaknesses',
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    items: [
      'Missing keywords: "TypeScript", "CI/CD", "unit testing"',
      'Skills section lacks prioritization — reorder by relevance',
      'No mention of open source contributions or side projects',
      'Summary section is generic — tailor to target role',
    ],
  },
  {
    id: 'keywords',
    label: 'Missing Keywords',
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    items: [
      'TypeScript — found in 87% of target job descriptions',
      'Agile / Scrum — commonly required for team roles',
      'Performance optimization — key differentiator',
      'Design systems — mentioned in 60% of senior roles',
    ],
  },
  {
    id: 'format',
    label: 'Formatting',
    icon: Minus,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    items: [
      'Font size consistent — ✓ passes ATS scan',
      'Avoid tables/columns — some ATS tools misread them',
      'File size is optimal (< 500KB)',
      'Contact info is in the header — ✓ ATS compliant',
    ],
  },
];

const AccordionItem = ({ section, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = section.icon;

  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-neutral-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon className={cn('w-4 h-4', section.color)} />
          <span className="text-sm font-medium text-neutral-200">{section.label}</span>
          <span className={cn('text-xs px-2 py-0.5 rounded-full border', section.bg, section.color)}>
            {section.items.length}
          </span>
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-neutral-500 transition-transform', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="px-4 pb-4 space-y-2.5 border-t border-neutral-800 pt-3">
              {section.items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2.5 text-sm text-neutral-400"
                >
                  <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', section.color.replace('text-', 'bg-'))} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FeedbackPanel = () => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold text-neutral-300 mb-4">Detailed Feedback</h3>
    {feedbackData.map((section, i) => (
      <AccordionItem key={section.id} section={section} defaultOpen={i === 0} />
    ))}
  </div>
);

export { FeedbackPanel };

