import { Link } from 'react-router-dom';
import { Briefcase, Search } from 'lucide-react';
import { useAllJobs, JobList } from '../features/jobs';
import { Button } from '../components/ui';

/**
 * Browse all job listings page
 */
const AllJobsPage = () => {
  const { data, isLoading, error, refetch } = useAllJobs();
  const jobs = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                All Job Listings
              </h1>
            </div>
            <p className="text-gray-600">
              Browse all available positions and discover project ideas tailored to each role.
            </p>
          </div>

          <Link to="/">
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search Jobs
            </Button>
          </Link>
        </div>

        {!isLoading && jobs.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            {jobs.length} {jobs.length === 1 ? 'position' : 'positions'} available
          </div>
        )}
      </div>

      {/* Job Listings */}
      <JobList
        jobs={jobs}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
};

export { AllJobsPage };

