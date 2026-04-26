/**
 * React Query hooks for Copilot pages.
 * All hooks return live data from the backend with mock fallback.
 */
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchCopilotJobFeed,
  searchCopilotJobs,
  fetchDashboardStats,
} from '../api/copilotApi';

// Query key factory — keeps cache keys consistent and invalidation easy
export const copilotKeys = {
  all: ['copilot'],
  feed: (params) => ['copilot', 'feed', params],
  search: (params) => ['copilot', 'search', params],
  stats: () => ['copilot', 'dashboard', 'stats'],
};

/**
 * Fetch the curated job feed for the Copilot Job Feed page.
 *
 * @param {{ q?: string, location?: string, date_posted?: string }} params
 */
export const useCopilotJobFeed = (params = {}) => {
  return useQuery({
    queryKey: copilotKeys.feed(params),
    queryFn: () => fetchCopilotJobFeed(params),
    staleTime: 1000 * 60 * 10, // 10 min — JSearch + AI is expensive
    gcTime: 1000 * 60 * 30,    // keep in cache for 30 min
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Search jobs (triggered by the user entering a query in Job Feed).
 *
 * @param {{ jobTitle: string, location?: string, datePosted?: string }} params
 * @param {{ enabled?: boolean }} options
 */
export const useCopilotJobSearch = (params, { enabled = true } = {}) => {
  return useQuery({
    queryKey: copilotKeys.search(params),
    queryFn: () => searchCopilotJobs(params),
    enabled: Boolean(params?.jobTitle) && enabled,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Fetch aggregate dashboard stats.
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: copilotKeys.stats(),
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 60, // 1 hour — these don't change often
    retry: 0,
    refetchOnWindowFocus: false,
  });
};

