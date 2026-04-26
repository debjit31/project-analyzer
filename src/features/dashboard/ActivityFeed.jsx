import { motion } from 'framer-motion';
import { Send, Calendar, Bookmark, FileText, Star, X, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const now = Date.now();
const m = (min) => now - min * 60 * 1000;

const activityFeed = [
  { id: 1, type: 'applied', message: 'Applied to Senior React Developer at Vercel', time: m(4), status: 'success' },
  { id: 2, type: 'interview', message: 'Interview scheduled with Linear on Apr 28', time: m(18), status: 'info' },
  { id: 3, type: 'saved', message: 'Saved Full Stack Engineer role at Stripe', time: m(45), status: 'default' },
  { id: 4, type: 'letter', message: 'Cover letter generated for Figma UI Engineer', time: m(90), status: 'default' },
  { id: 5, type: 'resume', message: 'Resume analyzed — ATS score: 82/100', time: m(180), status: 'success' },
  { id: 6, type: 'applied', message: 'Applied to Product Engineer at Raycast', time: m(300), status: 'success' },
  { id: 7, type: 'rejected', message: 'Application declined — Discord React Native Dev', time: m(600), status: 'error' },
  { id: 8, type: 'offer', message: 'Offer received from Shopify — Frontend Platform', time: m(1440), status: 'success' },
];

const typeConfig = {
  applied: { icon: Send, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  interview: { icon: Calendar, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  saved: { icon: Bookmark, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  letter: { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  resume: { icon: Star, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  rejected: { icon: X, color: 'text-red-400', bg: 'bg-red-500/10' },
  offer: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

const relativeTime = (ts) => {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const ActivityFeed = () => (
  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 h-full flex flex-col">
    <div className="mb-5">
      <h2 className="text-sm font-semibold text-neutral-100">Recent Activity</h2>
      <p className="text-xs text-neutral-500 mt-1">Your latest job application actions</p>
    </div>

    <div className="flex-1 overflow-y-auto space-y-1 -mr-2 pr-2 scrollbar-thin">
      {activityFeed.map((item, i) => {
        const cfg = typeConfig[item.type] || typeConfig.applied;
        const Icon = cfg.icon;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-800/60 transition-colors group"
          >
            <div className={cn('p-2 rounded-lg shrink-0 mt-0.5', cfg.bg)}>
              <Icon className={cn('w-3.5 h-3.5', cfg.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-300 leading-snug group-hover:text-neutral-100 transition-colors">
                {item.message}
              </p>
              <p className="text-xs text-neutral-600 mt-1">{relativeTime(item.time)}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export { ActivityFeed };

