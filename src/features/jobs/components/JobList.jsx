import { JobCard } from './JobCard';
import { JobCardSkeleton } from './JobCardSkeleton';
import { ErrorState } from '../../../components/ui';
import { Inbox } from 'lucide-react';

/**
 * Job list component with loading and error states
 */
const JobList = ({ jobs = [], isLoading, error, onRetry }) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load jobs"
        message={error.message || 'An error occurred while fetching job listings.'}
        onRetry={onRetry}
      />
    );
  }

  // Empty state
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Inbox className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-600 max-w-md">
          Try adjusting your search criteria or browse all available listings.
        </p>
      </div>
    );
  }

  // Results
  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export { JobList };
