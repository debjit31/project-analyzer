import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Zap, CheckCircle, Clock } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../lib/ToastContext';

// Mock match scores, requirements, and salary
const mockDetails = {
  salary: ['$120K–$160K', '$140K–$180K', '$100K–$140K', '$160K–$200K'],
  requirements: [
    ['3+ years React experience', 'Strong TypeScript skills', 'Experience with REST/GraphQL APIs', 'CSS & design system knowledge', 'Testing (Jest/RTL)'],
    ['5+ years frontend', 'Next.js expertise', 'Performance optimization', 'CI/CD familiarity', 'Cross-team collaboration'],
    ['Full-stack capability', 'PostgreSQL / database design', 'API design skills', 'Product instinct', 'Startup mindset'],
  ],
};

const JobDetailModal = ({ job, matchScore, open, onClose }) => {
  const { push } = useToast();
  const [applied, setApplied] = useState(false);

  if (!job) return null;

  // parseInt may return NaN for UUID-style IDs from the real API — fall back to index 0
  const idIndex = parseInt(job.id, 10);
  const reqList = mockDetails.requirements[(isNaN(idIndex) ? 0 : idIndex) % 3] ?? [];
  const salary = mockDetails.salary[(isNaN(idIndex) ? 0 : idIndex) % 4];

  const handleApply = () => {
    setApplied(true);
    push({ message: `Applied to ${job.job_title} at ${job.company}!`, variant: 'success' });
  };

  return (
    <Modal open={open} onOpenChange={(v) => !v && onClose()}>
      <ModalHeader onClose={onClose}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">{job.company.slice(0, 2).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-neutral-50 font-[family-name:var(--font-heading)]">{job.job_title}</h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="text-sm text-neutral-400">{job.company}</span>
              <span className="flex items-center gap-1 text-sm text-neutral-500">
                <MapPin className="w-3.5 h-3.5" /> {job.location}
              </span>
              {matchScore && (
                <Badge variant={matchScore >= 85 ? 'score-high' : 'score-mid'} className="gap-1">
                  <Zap className="w-3 h-3" /> {matchScore}% match
                </Badge>
              )}
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-5">
        {/* Salary + Type */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800 rounded-xl border border-neutral-700 text-sm">
            <span className="text-emerald-400 font-semibold">{salary}</span>
            <span className="text-neutral-500">/ year</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800 rounded-xl border border-neutral-700 text-sm text-neutral-400">
            <Clock className="w-4 h-4" /> Full-time
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">About the role</h3>
          <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        {/* Core problem */}
        {job.analysis?.core_problem && (
        <div className="p-4 bg-teal-950/40 border border-teal-800/40 rounded-xl">
          <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1.5">Core Challenge</p>
          <p className="text-sm text-neutral-300 leading-relaxed">{job.analysis?.core_problem ?? 'No analysis available.'}</p>
        </div>
        )}

        {/* Requirements */}
        <div>
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Requirements</h3>
          <ul className="space-y-2">
            {reqList.map((req, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2.5 text-sm text-neutral-300"
              >
                <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                {req}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Tech stack — only render if the API returned at least one item */}
        {(job.analysis?.tech_stack?.length > 0) && (
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {job.analysis.tech_stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 border border-neutral-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> View Listing
        </a>
        <button
          onClick={handleApply}
          disabled={applied}
          className="px-5 py-2 text-sm font-semibold rounded-xl transition-all bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-teal-900/30"
        >
          {applied ? '✓ Applied' : 'Apply Now'}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export { JobDetailModal };

