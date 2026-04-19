import { useQuery } from '@tanstack/react-query';
import { fetchJobs, fetchAllJobs, fetchJobById } from '../api/jobsApi';

/**
 * Custom hook for job search
 * @param {import('../types/job.types').SearchParams} params - Search parameters
 * @param {Object} options - Additional options
 * @param {boolean} options.enabled - Whether to enable the query
 */
export const useJobSearch = (params, { enabled = false } = {}) => {
  return useQuery({
    queryKey: ['jobs', 'search', params],
    queryFn: () => fetchJobs(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Custom hook for fetching all job listings
 */
export const useAllJobs = () => {
  return useQuery({
    queryKey: ['jobs', 'all'],
    queryFn: fetchAllJobs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Custom hook for fetching a single job by ID
 * @param {string} id - Job ID
 */
export const useJobById = (id) => {
  return useQuery({
    queryKey: ['jobs', 'detail', id],
    queryFn: () => fetchJobById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
