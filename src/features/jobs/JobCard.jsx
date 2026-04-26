import { motion } from 'framer-motion';
import { MapPin, Clock, Zap, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';

const companyColors = [
  'from-teal-600 to-teal-800',
  'from-violet-600 to-violet-800',
  'from-blue-600 to-blue-800',
  'from-amber-600 to-amber-800',
  'from-pink-600 to-pink-800',
  'from-emerald-600 to-emerald-800',
];

const getScoreVariant = (score) => {
  if (score >= 85) return 'score-high';
  if (score >= 65) return 'score-mid';
  return 'score-low';
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const delta = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (delta === 0) return 'Today';
  if (delta === 1) return 'Yesterday';
  if (delta < 7) return `${delta} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const JobCard = ({ job, index, matchScore, onClick }) => {
  const colorClass = companyColors[parseInt(job.id) % companyColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onClick}
      className={cn(
        'group relative bg-neutral-900 border border-neutral-800 rounded-2xl p-5',
        'hover:border-neutral-700 hover:shadow-xl hover:shadow-black/20',
        'transition-all duration-200 cursor-pointer'
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Company logo placeholder */}
          <div
            className={cn(
              'w-10 h-10 rounded-xl bg-gradient-to-br shrink-0 flex items-center justify-center',
              colorClass
            )}
          >
            <span className="text-white text-xs font-bold">
              {job.company.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium">{job.company}</p>
            <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-white transition-colors leading-snug">
              {job.job_title}
            </h3>
          </div>
        </div>

        {/* Match score */}
        {matchScore && (
          <Badge variant={getScoreVariant(matchScore)} className="shrink-0 gap-1">
            <Zap className="w-3 h-3" />
            {matchScore}% match
          </Badge>
        )}
      </div>

      {/* Tags / tech stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.analysis.tech_stack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700/50"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(job.posted_date)}
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
          View <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Hover border accent */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-teal-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export { JobCard };

