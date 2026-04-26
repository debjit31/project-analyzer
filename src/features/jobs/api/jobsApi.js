/**
 * Jobs API — used by the original search pages (/results, /jobs).
 *
 * All calls go to the real FastAPI backend (JSearch). No mock fallbacks.
 */
import api from '../../../lib/axios';

// ---------------------------------------------------------------------------
// Public API — used by hooks and pages
// ---------------------------------------------------------------------------

/**
 * Search jobs via the backend pipeline (JSearch → AI analysis).
 */
export const fetchJobs = async ({ jobTitle, location, datePosted }) => {
  const { data } = await api.post('/v1/generate-projects', {
    job_title: jobTitle,
    location: location || '',
    date_posted: datePosted || 'anytime',
  });
  return data;
};

/**
 * Fetch a curated job feed (used by AllJobsPage browse).
 * Defaults to "software engineer" when no query is provided.
 */
export const fetchAllJobs = async () => {
  const { data } = await api.get('/v1/jobs/feed', {
    params: { q: 'software engineer', date_posted: 'anytime' },
  });
  return data;
};

/**
 * Single job by ID — fetches via the feed and finds by ID.
 * Falls back gracefully if the job is not found.
 */
export const fetchJobById = async (id) => {
  const { data } = await api.get('/v1/jobs/feed', {
    params: { q: 'software engineer', date_posted: 'anytime' },
  });
  const jobs = data?.data || [];
  const job = jobs.find((j) => j.id === id);
  if (!job) throw new Error('Job listing not found.');
  return { success: true, data: job };
};
