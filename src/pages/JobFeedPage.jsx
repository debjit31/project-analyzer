import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Search, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useCopilotJobFeed } from '../features/jobs/hooks/useCopilotJobs';
import { JobCard } from '../features/jobs/JobCard';
import { JobFilters } from '../features/jobs/JobFilters';
import { JobDetailModal } from '../features/jobs/JobDetailModal';
import { Skeleton } from '../components/ui/Skeleton';

const JobCardSkeleton = ({ index }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.04 }}
    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4"
  >
    <div className="flex items-start gap-3">
      <Skeleton className="w-10 h-10 rounded-xl bg-neutral-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24 bg-neutral-800 rounded" />
        <Skeleton className="h-4 w-40 bg-neutral-800 rounded" />
      </div>
      <Skeleton className="h-5 w-20 bg-neutral-800 rounded-full" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-5 w-14 bg-neutral-800 rounded-md" />
      <Skeleton className="h-5 w-16 bg-neutral-800 rounded-md" />
      <Skeleton className="h-5 w-12 bg-neutral-800 rounded-md" />
    </div>
    <div className="flex gap-4">
      <Skeleton className="h-3 w-32 bg-neutral-800 rounded" />
      <Skeleton className="h-3 w-20 bg-neutral-800 rounded" />
    </div>
  </motion.div>
);

const JobFeedPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [uiFilters, setUiFilters] = useState({
    search: '', selectedLocations: [], selectedTypes: [], remoteOnly: false, salaryMin: 80,
  });
  const [feedParams, setFeedParams] = useState({ q: 'software engineer' });

  const { data: feedData, isLoading, isFetching, isError, error, refetch } =
    useCopilotJobFeed(feedParams);

  const isLive = feedData?.source === 'live';
  const allJobs = feedData?.data ?? [];

  const filtered = useMemo(() => {
    return allJobs.filter((job) => {
      const q = uiFilters.search.toLowerCase();
      if (q &&
        !job.job_title?.toLowerCase().includes(q) &&
        !job.company?.toLowerCase().includes(q) &&
        !(job.analysis?.tech_stack ?? []).some((t) => t.toLowerCase().includes(q))
      ) return false;
      if (uiFilters.remoteOnly && !job.location?.toLowerCase().includes('remote')) return false;
      if (uiFilters.selectedLocations.length &&
        !uiFilters.selectedLocations.some((l) => job.location?.toLowerCase().includes(l.toLowerCase()))
      ) return false;
      return true;
    });
  }, [allJobs, uiFilters]);

  const handleSearch = useCallback((searchTerm) => {
    if (searchTerm.trim().length >= 3) setFeedParams({ q: searchTerm.trim() });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50 font-[family-name:var(--font-heading)] flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-teal-400" />
            Job Feed
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-neutral-500">
              {isLoading ? 'Fetching live jobs…' : (
                <><span className="text-teal-400 font-medium">{filtered.length}</span> roles
                {filtered.length !== allJobs.length && <span className="text-neutral-600"> (filtered from {allJobs.length})</span>}</>
              )}
            </p>
            {!isLoading && (
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${
                isLive ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              }`}>
                {isLive ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isLive ? 'Live data' : 'Demo data'}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Fetching…' : 'Refresh'}
        </button>
      </div>

      <div className="flex gap-6">
        <aside className="w-64 shrink-0 hidden lg:block">
          <JobFilters onFilter={setUiFilters} onSearch={handleSearch} />
        </aside>

        <div className="flex-1 min-w-0">
          {isError && !allJobs.length && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-950/40 border border-red-800/40 flex items-center justify-center mb-4">
                <WifiOff className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-neutral-300 font-semibold mb-1">Could not load jobs</h3>
              <p className="text-sm text-neutral-600 mb-4">{error?.message || 'Backend unreachable'}</p>
              <button onClick={() => refetch()} className="px-4 py-2 text-sm bg-neutral-800 text-neutral-300 rounded-xl border border-neutral-700 hover:bg-neutral-700 transition-colors">
                Try again
              </button>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => <JobCardSkeleton key={i} index={i} />)}
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-neutral-300 font-semibold mb-1">No matching jobs</h3>
              <p className="text-sm text-neutral-600">Try adjusting filters or searching different terms</p>
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} matchScore={job.matchScore} onClick={() => setSelectedJob(job)} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <JobDetailModal
        job={selectedJob}
        matchScore={selectedJob?.matchScore}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
};

export default JobFeedPage;
