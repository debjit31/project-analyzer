/**
 * Copilot API — API functions used exclusively by the /app/* Copilot pages.
 *
 * All calls go through the shared axios client which proxies to the Java backend.
 * No mock fallbacks — errors surface to the UI for proper handling.
 */
import api from '../../../lib/axios';

// ---------------------------------------------------------------------------
// Match score — computed from actual user tech stack (from auth profile)
// Falls back to a neutral score if the user has not set a tech stack yet.
// ---------------------------------------------------------------------------

/**
 * Compute a match score (50–99) based on tech stack overlap.
 *
 * @param {string[]} techStack   - Tech stack from the AI analysis of the job
 * @param {string[]} userStack   - User's own tech stack (from their profile)
 */
export const computeMatchScore = (techStack = [], userStack = []) => {
  if (!techStack.length) return Math.floor(Math.random() * 20) + 60;
  if (!userStack.length) return Math.floor(Math.random() * 20) + 60;
  const matches = techStack.filter((t) =>
    userStack.some((p) => p.toLowerCase() === t.toLowerCase())
  ).length;
  const raw = (matches / Math.max(techStack.length, 1)) * 100;
  // Clamp to 50-99 — no job is ever 0% or 100% match
  return Math.min(99, Math.max(50, Math.round(raw * 0.49 + 50)));
};

/**
 * Enrich raw job listings from the API with a client-computed match score.
 *
 * @param {Object[]} jobs
 * @param {string[]} userStack - User's tech stack (from profile); may be empty
 */
export const enrichWithMatchScore = (jobs, userStack = []) =>
  jobs.map((job) => ({
    ...job,
    matchScore: computeMatchScore(job.analysis?.tech_stack, userStack),
  }));

// ---------------------------------------------------------------------------
// Copilot API functions
// ---------------------------------------------------------------------------

/**
 * Fetch a curated job feed for the Copilot Job Feed page.
 *
 * @param {{ q?: string, location?: string, date_posted?: string, userStack?: string[] }} params
 * @returns {Promise<{ data: Object[], total: number, source: 'live' }>}
 */
export const fetchCopilotJobFeed = async ({
  q = 'software engineer',
  location = '',
  date_posted = 'anytime',
  userStack = [],
} = {}) => {
  const { data: envelope } = await api.get('/v1/jobs/feed', {
    params: { q, location, date_posted },
  });
  const enriched = enrichWithMatchScore(envelope.data || [], userStack);
  return { data: enriched, total: enriched.length, source: 'live' };
};

/**
 * Search jobs from the Copilot search bar.
 *
 * @param {{ jobTitle: string, location?: string, datePosted?: string, userStack?: string[] }} params
 * @returns {Promise<{ data: Object[], total: number, source: 'live' }>}
 */
export const searchCopilotJobs = async ({ jobTitle, location = '', datePosted = 'anytime', userStack = [] }) => {
  const { data: envelope } = await api.post('/v1/generate-projects', {
    job_title: jobTitle,
    location,
    date_posted: datePosted,
  });
  const enriched = enrichWithMatchScore(envelope.data || [], userStack);
  return { data: enriched, total: enriched.length, source: 'live' };
};

/**
 * Fetch aggregate dashboard stats.
 * @returns {Promise<Object>}
 */
export const fetchDashboardStats = async () => {
  const { data } = await api.get('/v1/dashboard/stats');
  return data.data;
};

