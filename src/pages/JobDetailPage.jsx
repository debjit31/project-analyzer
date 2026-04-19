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
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>
    </div>
    <Skeleton className="h-24 w-full rounded-lg" />
    <Skeleton className="h-20 w-full rounded-lg" />
    <Skeleton className="h-32 w-full rounded-lg" />
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
        className="inline-flex items-center text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 mb-6 transition-colors"
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
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3 font-[family-name:var(--font-heading)]">
              {job.job_title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-stone-500 dark:text-stone-400">
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
                <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-3">
                  About the Role
                </h2>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
                <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-3">
                Core Problem
              </h2>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                {job.analysis.core_problem}
              </p>
            </CardContent>
          </Card>

          <div className="relative p-6 rounded-lg bg-amber-50/60 border-l-[3px] border-l-amber-400 dark:bg-amber-950/30 dark:border-l-amber-500">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-6 h-6 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                  Portfolio Project Idea
                </h2>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  {job.analysis.project_idea}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-stone-200 dark:border-stone-700">
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

