import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useJobSearch, JobList } from '../features/jobs';
import { Button } from '../components/ui';

/**
 * Results page displaying job listings with project ideas
 */
const ResultsPage = () => {
  const [searchParams] = useSearchParams();

  const params = {
    jobTitle: searchParams.get('title') || '',
    location: searchParams.get('location') || '',
    datePosted: searchParams.get('posted') || 'anytime',
  };

  const { data, isLoading, error, refetch } = useJobSearch(params, {
    enabled: true,
  });

  const jobs = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to search
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Project Ideas
            </h1>
            <p className="text-gray-600">
              {params.jobTitle && (
                <span>
                  For <span className="font-medium">"{params.jobTitle}"</span>
                </span>
              )}
              {params.jobTitle && params.location && ' in '}
              {params.location && (
                <span className="font-medium">{params.location}</span>
              )}
              {!params.jobTitle && !params.location && (
                <span>Browse all available jobs</span>
              )}
            </p>
          </div>

          {!isLoading && jobs.length > 0 && (
            <div className="text-sm text-gray-500">
              {jobs.length} {jobs.length === 1 ? 'result' : 'results'} found
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <JobList
        jobs={jobs}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />

      {/* Bottom CTA */}
      {!isLoading && !error && jobs.length > 0 && (
        <div className="mt-12 text-center py-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Want to search for different jobs?
          </p>
          <Link to="/">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export { ResultsPage };
