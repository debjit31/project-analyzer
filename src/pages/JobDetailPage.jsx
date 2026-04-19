import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Lightbulb,
} from 'lucide-react';
import { useJobById } from '../features/jobs';
import {
  Button,
  Badge,
  Card,
  CardContent,
  Skeleton,
  ErrorState,
} from '../components/ui';

const JobDetailSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-8 w-64 mb-3" />
      <div className="flex gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
    </div>
    <Skeleton className="h-24 w-full rounded-xl" />
    <Skeleton className="h-20 w-full rounded-xl" />
    <Skeleton className="h-32 w-full rounded-xl" />
  </div>
);

const JobDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useJobById(id);
  const job = data?.data;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/jobs"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to all jobs
      </Link>

      {isLoading && <JobDetailSkeleton />}

      {error && (
        <ErrorState
          title="Failed to load job"
          message={error.message || 'Could not load this job listing.'}
          onRetry={refetch}
        />
      )}

      {job && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {job.job_title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              {job.posted_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(job.posted_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {job.analysis.tech_stack.map((tech) => (
                <Badge key={tech} variant="primary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {job.description && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  About the Role
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Core Problem
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {job.analysis.core_problem}
              </p>
            </CardContent>
          </Card>

          <div className="relative p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-indigo-900 mb-2">
                  Portfolio Project Idea
                </h2>
                <p className="text-indigo-800 leading-relaxed">
                  {job.analysis.project_idea}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-200">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" className="w-full sm:w-auto">
                Apply on {job.company}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Browse more jobs
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export { JobDetailPage };

